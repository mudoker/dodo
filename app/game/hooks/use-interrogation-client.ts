"use client";

import { AudioRecorder } from "@/app/audio/audio-recorder";
import { useLiveAPIContext } from "@/hooks/use-live-api";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChatMessage } from "../types";

export function useInterrogationClient({
  crime, timerStarted, onTimerStart, onGoodArgument, onIncreaseImpatience, onWin, onLose
}: {
  crime: string; timerStarted: boolean; onTimerStart: () => void; onGoodArgument: () => void;
  onIncreaseImpatience: (amount: number) => void; onWin: () => void; onLose: () => void;
}) {
  const {
    client, connected, connect, disconnect, volume, config,
    audioInputDevices, audioOutputDevices, selectedInputDeviceId, setSelectedInputDeviceId,
    selectedOutputDeviceId, setSelectedOutputDeviceId, outputDeviceSupported, refreshAudioDevices
  } = useLiveAPIContext();
  const [audioRecorder] = useState(() => new AudioRecorder());
  const [muted, setMuted] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [micArmed, setMicArmed] = useState(false);
  const [isAwaitingResponse, setIsAwaitingResponse] = useState(false);
  const [showInnocenceBonus, setShowInnocenceBonus] = useState(false);
  const [inputVolume, setInputVolume] = useState(0);
  const [lastInputAt, setLastInputAt] = useState<number | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const transcriptRef = useRef("");
  const hasStartedRef = useRef(false);
  const hasSentAccusationRef = useRef(false);
  const firstTurnCompleteRef = useRef(false);
  const userSpokeRef = useRef(false);
  const isAiSpeakingRef = useRef(false);
  const isAwaitingResponseRef = useRef(false);
  const lastMeterUpdateRef = useRef(0);
  const lastAudibleInputAtRef = useRef(0);
  const lastForcedResponseAtRef = useRef(0);
  const silenceCommitTimerRef = useRef<NodeJS.Timeout | null>(null);
  const activeInputDeviceIdRef = useRef<string | undefined>(undefined);
  const manuallyDisconnectedRef = useRef(false);

  useEffect(() => { transcriptRef.current = currentTranscript; }, [currentTranscript]);
  useEffect(() => { isAiSpeakingRef.current = isAiSpeaking; }, [isAiSpeaking]);
  useEffect(() => { isAwaitingResponseRef.current = isAwaitingResponse; }, [isAwaitingResponse]);

  const isConfigReady = Boolean(config.model && config.systemInstruction?.parts?.[0]?.text?.includes("Grimstone"));

  // Automatic connection on mount when config is ready
  useEffect(() => {
    if (isConfigReady && !connected && !isConnecting && !connectionError && !hasStartedRef.current && !manuallyDisconnectedRef.current) {
      hasStartedRef.current = true;
      setIsConnecting(true);
      const timer = setTimeout(async () => {
        try {
          console.log("[useInterrogationClient] Auto-connecting with detective config...");
          await connect();
        } catch (error) {
          console.error("[useInterrogationClient] Auto-connection failed:", error);
          setConnectionError(error instanceof Error ? error.message : "Connection failed");
          setIsConnecting(false);
          hasStartedRef.current = false; // allow manual retry
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [connect, isConfigReady, connected, isConnecting, connectionError]);

  // Connection timeout check
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    if (isConnecting) {
      timeoutId = setTimeout(() => {
        if (!connected || !isSetupComplete) {
          console.warn("[useInterrogationClient] Connection attempt timed out.");
          disconnect();
          setConnectionError("Connection timed out. Google AI Studio server is busy or the API key is unauthorized.");
          setIsConnecting(false);
        }
      }, 15000); // Live sessions can be slow on the first cold connection.
    }
    return () => { if (timeoutId) clearTimeout(timeoutId); };
  }, [isConnecting, connected, isSetupComplete, disconnect]);

  useEffect(() => {
    if (!client) return;
    const handleError = (e: Error) => {
      setConnectionError(e.message);
      setIsConnecting(false);
      setIsAiSpeaking(false);
      setIsSetupComplete(false);
      setMicArmed(false);
      isAwaitingResponseRef.current = false;
      setIsAwaitingResponse(false);
      hasStartedRef.current = false;
    };
    const handleClose = (e: CloseEvent) => {
      setIsConnecting(false);
      setIsAiSpeaking(false);
      setIsSetupComplete(false);
      setMicArmed(false);
      isAwaitingResponseRef.current = false;
      setIsAwaitingResponse(false);
      setConnectionError(e.reason || (e.code !== 1000 ? `Interrogation room closed (code: ${e.code})` : null));
      hasStartedRef.current = false;
    };
    const handleSetupComplete = () => {
      setIsSetupComplete(true);
      setIsConnecting(false);
      setConnectionError(null);
    };
    const handleAudio = () => {
      isAwaitingResponseRef.current = false;
      setIsAwaitingResponse(false);
      setIsAiSpeaking(true);
    };
    const handleContent = (content: any) => {
      const text = content?.modelTurn?.parts?.filter((p: any) => typeof p.text === "string").map((p: any) => p.text).join("") || "";
      if (text) {
        setCurrentTranscript((prev) => prev + text);
        isAwaitingResponseRef.current = false;
        setIsAwaitingResponse(false);
        setIsAiSpeaking(true);
        setChatHistory((prev) => {
          const lastMsg = prev[prev.length - 1];
          if (lastMsg?.sender === "detective" && lastMsg.isLive) {
            return [...prev.slice(0, -1), { ...lastMsg, text: lastMsg.text + text }];
          }
          let base = prev;
          if (userSpokeRef.current) {
            userSpokeRef.current = false;
            const last = prev[prev.length - 1];
            if (!last || last.sender !== "user") {
              base = [...prev, { id: "voice-" + Math.random().toString(), sender: "user", text: "🎤 [Defended via Voice Chat]", timestamp: new Date(), isVoice: true }];
            }
          }
          return [...base, { id: Math.random().toString(), sender: "detective", text, timestamp: new Date(), isLive: true }];
        });
      }
    };

    const handleTurnComplete = () => {
      isAwaitingResponseRef.current = false;
      setIsAwaitingResponse(false);
      setIsAiSpeaking(false);
      if (!firstTurnCompleteRef.current) { firstTurnCompleteRef.current = true; onTimerStart(); }
      setMicArmed(true);
      const trans = transcriptRef.current.toLowerCase();
      if (["free to go", "wrong person", "case dismissed", "let you go", "dropping the charges"].some(p => trans.includes(p))) { onWin(); return; }
      if (["going down", "going to jail", "lock you up", "guilty as charged", "sending you to prison"].some(p => trans.includes(p))) { onLose(); return; }

      const isGood = [
        "oh please", "that's pathetic", "nice try", "you think", "how adorable", "spare me", "weak",
        "feeble", "dammit", "wait", "doesn't add up", "maybe", "perhaps", "i suppose", "alright",
        "fine", "whatever", "i guess", "you got lucky", "this time", "stupid", "beneath", "bullshit"
      ].some(p => trans.includes(p));

      if (timerStarted) {
        if (isGood) {
          setShowInnocenceBonus(true);
          onGoodArgument();
          setTimeout(() => setShowInnocenceBonus(false), 3000);
        } else {
          onIncreaseImpatience(6);
        }
      }
      setChatHistory((prev) => {
        const lastMsg = prev[prev.length - 1];
        return (lastMsg?.sender === "detective" && lastMsg.isLive) ? [...prev.slice(0, -1), { ...lastMsg, isLive: false }] : prev;
      });
      setCurrentTranscript("");
    };

    client.on("content", handleContent).on("turncomplete", handleTurnComplete)
          .on("setupcomplete", handleSetupComplete)
          .on("audio", handleAudio)
          .on("error", handleError)
          .on("close", handleClose);

    return () => {
      client.off("content", handleContent).off("turncomplete", handleTurnComplete)
        .off("setupcomplete", handleSetupComplete)
        .off("audio", handleAudio)
        .off("error", handleError)
        .off("close", handleClose);
    };
  }, [client, onWin, onLose, onTimerStart, onGoodArgument, onIncreaseImpatience, timerStarted]);

  useEffect(() => {
    const onData = (base64: string) => {
      if (isAwaitingResponseRef.current || isAiSpeakingRef.current) return;
      try {
        client.sendRealtimeInput([{ mimeType: "audio/pcm;rate=16000", data: base64 }]);
      } catch {
        audioRecorder.stop();
      }
    };
    const queueSilenceCommit = () => {
      if (silenceCommitTimerRef.current) {
        clearTimeout(silenceCommitTimerRef.current);
      }
      silenceCommitTimerRef.current = setTimeout(() => {
        const now = Date.now();
        if (
          !connected ||
          muted ||
          !micArmed ||
          isAiSpeakingRef.current ||
          now - lastAudibleInputAtRef.current < 900 ||
          now - lastForcedResponseAtRef.current < 2200
        ) {
          return;
        }
        lastForcedResponseAtRef.current = now;
        isAwaitingResponseRef.current = true;
        setIsAwaitingResponse(true);
        try {
          client.sendAudioStreamEnd();
        } catch {
          isAwaitingResponseRef.current = false;
          setIsAwaitingResponse(false);
          audioRecorder.stop();
        }
      }, 950);
    };
    const onVolume = (nextVolume: number) => {
      const now = Date.now();
      if (now - lastMeterUpdateRef.current < 60) return;
      lastMeterUpdateRef.current = now;
      setInputVolume(nextVolume);
      if (nextVolume > 0.025) {
        userSpokeRef.current = true;
        lastAudibleInputAtRef.current = now;
        setLastInputAt(now);
        queueSilenceCommit();
      }
    };
    if (connected && !muted && audioRecorder && micArmed) {
      const nextInputDeviceId = selectedInputDeviceId || undefined;
      if (audioRecorder.recording && activeInputDeviceIdRef.current !== nextInputDeviceId) {
        audioRecorder.stop();
      }
      activeInputDeviceIdRef.current = nextInputDeviceId;
      audioRecorder
        .on("data", onData)
        .on("volume", onVolume)
        .start(nextInputDeviceId)
        .then(() => refreshAudioDevices().catch(() => {}))
        .catch((error) => {
          setConnectionError(error instanceof Error ? error.message : "Microphone failed to start");
        });
    } else {
      audioRecorder.stop();
      activeInputDeviceIdRef.current = undefined;
      setInputVolume(0);
      isAwaitingResponseRef.current = false;
      setIsAwaitingResponse(false);
      if (silenceCommitTimerRef.current) {
        clearTimeout(silenceCommitTimerRef.current);
        silenceCommitTimerRef.current = null;
      }
    }
    return () => {
      audioRecorder.off("data", onData).off("volume", onVolume);
      if (silenceCommitTimerRef.current) {
        clearTimeout(silenceCommitTimerRef.current);
        silenceCommitTimerRef.current = null;
      }
    };
  }, [connected, client, muted, audioRecorder, micArmed, selectedInputDeviceId, refreshAudioDevices]);

  // Connection status sync
  useEffect(() => {
    if (connected && isSetupComplete) {
      setIsConnecting(false);
      setConnectionError(null);
    } else {
      setIsAiSpeaking(false);
    }
  }, [connected, isSetupComplete]);

  useEffect(() => {
    if (connected && isSetupComplete && crime && !hasSentAccusationRef.current) {
      hasSentAccusationRef.current = true;
      setIsAiSpeaking(true);
      const timer = setTimeout(() => {
        try {
          client.send({
            text: `Open the interrogation now. Accuse the suspect of: "${crime}". State one concrete fake clue and one pointed question.`
          }, true);
        } catch (e) {
          setConnectionError("Failed to initiate interrogation");
          setIsAiSpeaking(false);
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [connected, isSetupComplete, crime, client]);

  useEffect(() => { return () => { audioRecorder.stop(); disconnect(); }; }, [audioRecorder, disconnect]);

  const resetSessionRefs = useCallback(() => {
    hasStartedRef.current = false;
    hasSentAccusationRef.current = false;
    firstTurnCompleteRef.current = false;
    userSpokeRef.current = false;
    transcriptRef.current = "";
    lastAudibleInputAtRef.current = 0;
    lastForcedResponseAtRef.current = 0;
    if (silenceCommitTimerRef.current) {
      clearTimeout(silenceCommitTimerRef.current);
      silenceCommitTimerRef.current = null;
    }
    setCurrentTranscript("");
    setIsSetupComplete(false);
    setMicArmed(false);
    isAwaitingResponseRef.current = false;
    setIsAwaitingResponse(false);
    setInputVolume(0);
    setLastInputAt(null);
  }, []);

  const connectSession = useCallback(async () => {
    manuallyDisconnectedRef.current = false;
    resetSessionRefs();
    setConnectionError(null);
    setIsConnecting(true);
    try {
      await connect();
    } catch (error) {
      setConnectionError(error instanceof Error ? error.message : "Connection failed");
      setIsConnecting(false);
      throw error;
    }
  }, [connect, resetSessionRefs]);

  const disconnectSession = useCallback(async () => {
    manuallyDisconnectedRef.current = true;
    audioRecorder.stop();
    resetSessionRefs();
    setIsAiSpeaking(false);
    setIsConnecting(false);
    await disconnect();
  }, [audioRecorder, disconnect, resetSessionRefs]);

  const sendTextMessage = useCallback((text: string) => {
    if (!text.trim() || !connected || !client) return;
    client.send({ text }, true);
    setChatHistory((prev) => [...prev, { id: Math.random().toString(), sender: "user", text, timestamp: new Date(), isVoice: false }]);
  }, [connected, client]);

  const triggerRetry = useCallback(async () => {
    manuallyDisconnectedRef.current = false;
    resetSessionRefs();
    setConnectionError(null);
    setIsConnecting(true);
    setTimeout(async () => { try { await connectSession(); } catch (e) {} }, 100);
  }, [connectSession, resetSessionRefs]);

  return {
    connected, isAiSpeaking, chatHistory, connectionError, isConnecting,
    showInnocenceBonus, volume, inputVolume, lastInputAt, micArmed, isAwaitingResponse, sendTextMessage, muted, setMuted,
    audioInputDevices, audioOutputDevices, selectedInputDeviceId, setSelectedInputDeviceId,
    selectedOutputDeviceId, setSelectedOutputDeviceId, outputDeviceSupported,
    connect: connectSession, disconnect: disconnectSession, triggerRetry
  };
}
