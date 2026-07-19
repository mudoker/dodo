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
  const { client, connected, connect, disconnect, volume, config } = useLiveAPIContext();
  const [audioRecorder] = useState(() => new AudioRecorder());
  const [muted, setMuted] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showInnocenceBonus, setShowInnocenceBonus] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const transcriptRef = useRef("");
  const hasStartedRef = useRef(false);
  const hasSentAccusationRef = useRef(false);
  const firstTurnCompleteRef = useRef(false);
  const userSpokeRef = useRef(false);

  useEffect(() => { transcriptRef.current = currentTranscript; }, [currentTranscript]);

  const isConfigReady = config.model === "models/gemini-2.0-flash-live-001" && config.systemInstruction?.parts?.[0]?.text?.includes("Grimstone");

  // Automatic connection on mount when config is ready
  useEffect(() => {
    if (isConfigReady && !connected && !isConnecting && !connectionError && !hasStartedRef.current) {
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
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [connect, isConfigReady, connected, isConnecting, connectionError]);

  // Connection timeout check
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    if (isConnecting) {
      timeoutId = setTimeout(() => {
        if (!connected) {
          console.warn("[useInterrogationClient] Connection attempt timed out.");
          disconnect();
          setConnectionError("Connection timed out. Google AI Studio server is busy or the API key is unauthorized.");
          setIsConnecting(false);
        }
      }, 7000); // 7 seconds timeout
    }
    return () => { if (timeoutId) clearTimeout(timeoutId); };
  }, [isConnecting, connected, disconnect]);

  useEffect(() => {
    if (!client) return;
    const handleContent = (content: any) => {
      const text = content?.modelTurn?.parts?.filter((p: any) => typeof p.text === "string").map((p: any) => p.text).join("") || "";
      if (text) {
        setCurrentTranscript((prev) => prev + text);
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
      setIsAiSpeaking(false);
      if (!firstTurnCompleteRef.current) { firstTurnCompleteRef.current = true; onTimerStart(); }
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
          .on("error", (e) => { setConnectionError(e.message); setIsConnecting(false); })
          .on("close", (e) => { setIsConnecting(false); setConnectionError(e.reason || (e.code !== 1000 ? `Interrogation room closed (code: ${e.code})` : null)); });

    return () => {
      client.off("content", handleContent).off("turncomplete", handleTurnComplete).off("error", () => {}).off("close", () => {});
    };
  }, [client, onWin, onLose, onTimerStart, onGoodArgument, onIncreaseImpatience, timerStarted]);

  useEffect(() => {
    const onData = (base64: string) => {
      userSpokeRef.current = true;
      client.sendRealtimeInput([{ mimeType: "audio/pcm;rate=16000", data: base64 }]);
    };
    if (connected && !muted && audioRecorder && timerStarted) {
      audioRecorder.on("data", onData).start();
    } else {
      audioRecorder.stop();
    }
    return () => { audioRecorder.off("data", onData); };
  }, [connected, client, muted, audioRecorder, timerStarted]);

  // Connection status sync
  useEffect(() => { if (connected) { setIsConnecting(false); setConnectionError(null); } }, [connected]);

  useEffect(() => {
    if (connected && crime && !hasSentAccusationRef.current) {
      hasSentAccusationRef.current = true;
      setIsAiSpeaking(true);
      const timer = setTimeout(() => {
        try { client.send({ text: `Accused of: "${crime}". Accuse them NOW!` }, true); } catch (e) {
          setConnectionError("Failed to initiate interrogation");
          setIsAiSpeaking(false);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [connected, crime, client]);

  useEffect(() => { return () => { audioRecorder.stop(); disconnect(); }; }, [audioRecorder, disconnect]);

  const sendTextMessage = useCallback((text: string) => {
    if (!text.trim() || !connected || !client) return;
    client.send({ text }, true);
    setChatHistory((prev) => [...prev, { id: Math.random().toString(), sender: "user", text, timestamp: new Date(), isVoice: false }]);
  }, [connected, client]);

  const triggerRetry = useCallback(async () => {
    setConnectionError(null);
    setIsConnecting(true);
    hasStartedRef.current = false;
    hasSentAccusationRef.current = false;
    firstTurnCompleteRef.current = false;
    setTimeout(async () => { try { await connect(); } catch (e) {} }, 100);
  }, [connect]);

  return {
    connected, isAiSpeaking, chatHistory, connectionError, isConnecting,
    showInnocenceBonus, volume, sendTextMessage, muted, setMuted,
    connect, disconnect, triggerRetry
  };
}
