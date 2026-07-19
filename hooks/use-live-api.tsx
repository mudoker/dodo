'use client';

import { createContext, type FC, type ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AudioStreamer } from '../app/audio/audio-streamer';
import type { MultimodalLiveAPIClientConnection } from '../app/audio/multimodal-live-client';
import { MultimodalLiveClient } from '../app/audio/multimodal-live-client';
import { audioContext } from '../app/audio/utils';
import VolMeterWorket from '../app/audio/worklets/vol-meter';
import type { LiveConfig } from '../app/multimodal-live';

export type UseLiveAPIResults = {
  client: MultimodalLiveClient;
  setConfig: (config: LiveConfig) => void;
  config: LiveConfig;
  connected: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  volume: number;
  outputPlaying: boolean;
  audioInputDevices: MediaDeviceInfo[];
  audioOutputDevices: MediaDeviceInfo[];
  selectedInputDeviceId: string;
  setSelectedInputDeviceId: (deviceId: string) => void;
  selectedOutputDeviceId: string;
  setSelectedOutputDeviceId: (deviceId: string) => void;
  outputDeviceSupported: boolean;
  refreshAudioDevices: () => Promise<void>;
};



const LiveAPIContext = createContext<UseLiveAPIResults | undefined>(undefined);

export type LiveAPIProviderProps = {
	children: ReactNode;
	url?: string;
	apiKey: string;
};

export const LiveAPIProvider: FC<LiveAPIProviderProps> = ({
	url,
	apiKey,
	children,
}) => {
	const liveAPI = useLiveAPI({ url, apiKey });

	return (
		<LiveAPIContext.Provider value={liveAPI}>
			{children}
		</LiveAPIContext.Provider>
	);
};

export const useLiveAPIContext = () => {
	const context = useContext(LiveAPIContext);
	if (!context) {
		throw new Error("useLiveAPIContext must be used wihin a LiveAPIProvider");
	}
	return context;
};

export function useLiveAPI({
  url,
  apiKey,
}: MultimodalLiveAPIClientConnection): UseLiveAPIResults {
  const client = useMemo(
    () => new MultimodalLiveClient({ url, apiKey }),
    [url, apiKey]
  );
  const audioStreamerRef = useRef<AudioStreamer | null>(null);

  const [connected, setConnected] = useState(false);
  const [outputPlaying, setOutputPlaying] = useState(false);
  const [config, setConfig] = useState<LiveConfig>({
    model: 'models/gemini-2.0-flash',
    systemInstruction: {
      parts: [
        {
          text: 'System Context: FinVision / Kitto (finance-focused, static analysis; no real-time).\nDomain Guardrail: Only handle finance, markets, portfolio analysis, or trading questions. Politely refuse unrelated topics and offer finance help instead. Limit any search to finance/trading contexts relevant to Kitto.\nExamples (Refuse):\n- "What\'s the price of iPhone 17?" → Out of scope.\n- "Plan my vacation to Japan" → Out of scope.\n- "Write a poem about cats" → Out of scope.\nExamples (Accept):\n- "Construct a balanced portfolio with moderate risk."\n- "Show S&P 500 sector allocation for my picks."\n- "Summarize this 10-K PDF and highlight risks."\nRefusal Template: "Sorry, I can\'t help with that topic. I can help with finance and trading—e.g., portfolio construction, market insights, or stock analysis. What would you like to explore?"\nCharting: When a visualization is requested or helpful, use the provided chart tool (e.g., render_altair) and pass a valid JSON STRING spec (not an object). Keep explanations concise for dashboard UI.',
        },
      ],
    },
  });
  const [volume, setVolume] = useState(0);
  const [audioInputDevices, setAudioInputDevices] = useState<MediaDeviceInfo[]>([]);
  const [audioOutputDevices, setAudioOutputDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedInputDeviceId, setSelectedInputDeviceId] = useState("");
  const [selectedOutputDeviceId, setSelectedOutputDeviceId] = useState("");
  const [outputDeviceSupported, setOutputDeviceSupported] = useState(false);

  const refreshAudioDevices = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.enumerateDevices) return;
    const devices = await navigator.mediaDevices.enumerateDevices();
    setAudioInputDevices(devices.filter((device) => device.kind === "audioinput"));
    setAudioOutputDevices(devices.filter((device) => device.kind === "audiooutput"));
  }, []);

  // register audio for streaming server -> speakers
  useEffect(() => {
    if (!audioStreamerRef.current) {
      audioContext({ id: 'audio-out' }).then((audioCtx: AudioContext) => {
        setOutputDeviceSupported(typeof (audioCtx as unknown as { setSinkId?: unknown }).setSinkId === "function");
        audioStreamerRef.current = new AudioStreamer(audioCtx);
        audioStreamerRef.current.onStart = () => setOutputPlaying(true);
        audioStreamerRef.current.onComplete = () => setOutputPlaying(false);
        audioStreamerRef.current
          .addWorklet<any>('vumeter-out', VolMeterWorket, (ev: any) => {
            setVolume(ev.data.volume);
          })
          .then(() => {
            // Successfully added worklet
          });
      });
    }
  }, []);

  useEffect(() => {
    refreshAudioDevices().catch(() => {});
    navigator.mediaDevices?.addEventListener?.("devicechange", refreshAudioDevices);
    return () => {
      navigator.mediaDevices?.removeEventListener?.("devicechange", refreshAudioDevices);
    };
  }, [refreshAudioDevices]);

  useEffect(() => {
    const audioCtx = audioStreamerRef.current?.context;
    const setSinkId = (audioCtx as unknown as { setSinkId?: (sinkId: string) => Promise<void> })?.setSinkId;
    if (!audioCtx || !setSinkId) return;
    setSinkId.call(audioCtx, selectedOutputDeviceId).catch((error) => {
      console.warn("[useLiveAPI] Failed to set output device:", error);
    });
  }, [selectedOutputDeviceId]);

  useEffect(() => {
    const stopAudioStreamer = () => {
      audioStreamerRef.current?.stop();
      setOutputPlaying(false);
    };

    const onClose = () => {
      // Ensure any ongoing assistant audio is stopped when the socket closes
      stopAudioStreamer();
      setConnected(false);
    };

    const onAudio = (data: ArrayBuffer) => {
      setOutputPlaying(true);
      audioStreamerRef.current?.addPCM16(new Uint8Array(data));
    };

    const onTurnComplete = () => {
      audioStreamerRef.current?.complete();
    };

    client
      .on('close', onClose)
      .on('interrupted', stopAudioStreamer)
      .on('audio', onAudio)
      .on('turncomplete', onTurnComplete);

    return () => {
      client
        .off('close', onClose)
        .off('interrupted', stopAudioStreamer)
        .off('audio', onAudio)
        .off('turncomplete', onTurnComplete);
    };
  }, [client]);

  const connect = useCallback(async () => {
    console.log("[useLiveAPI] connect() called");
    console.log("[useLiveAPI] Current config:", JSON.stringify(config, null, 2));
    if (!config) {
      console.error("[useLiveAPI] No config set!");
      throw new Error('config has not been set');
    }
    console.log("[useLiveAPI] Disconnecting existing connection...");
    audioStreamerRef.current?.stop();
    setOutputPlaying(false);
    setConnected(false);
    client.disconnect();
    console.log("[useLiveAPI] Calling client.connect with config...");
    try {
      await client.connect(config);
      console.log("[useLiveAPI] client.connect succeeded!");
      setConnected(true);
    } catch (error) {
      console.warn("[useLiveAPI] client.connect failed:", error);
      if (config.model.includes("gemini-2.0-flash")) {
        const fallbackModel = config.model.replace("gemini-2.0-flash", "gemini-2.5-flash");
        console.log(`[useLiveAPI] Triggering fallback with model: ${fallbackModel}`);
        const fallbackConfig = { ...config, model: fallbackModel };
        try {
          await client.connect(fallbackConfig);
          setConfig(fallbackConfig);
          setConnected(true);
          return;
        } catch (fallbackError) {
          console.error("[useLiveAPI] Fallback failed:", fallbackError);
          throw fallbackError;
        }
      }
      throw error;
    }
  }, [client, config]);

  const disconnect = useCallback(async () => {
    // Proactively stop any ongoing assistant audio before disconnecting
    audioStreamerRef.current?.stop();
    setOutputPlaying(false);
    client.disconnect();
    setConnected(false);
  }, [client]);

  return {
    client,
    config,
    setConfig,
    connected,
    connect,
    disconnect,
    volume,
    outputPlaying,
    audioInputDevices,
    audioOutputDevices,
    selectedInputDeviceId,
    setSelectedInputDeviceId,
    selectedOutputDeviceId,
    setSelectedOutputDeviceId,
    outputDeviceSupported,
    refreshAudioDevices,
  };
}
