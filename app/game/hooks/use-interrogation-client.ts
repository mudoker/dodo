"use client";

import { AudioRecorder } from "@/app/audio/audio-recorder";
import { useLiveAPIContext } from "@/hooks/use-live-api";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChatMessage } from "../types";

export function useInterrogationClient({
  crime,
  timerStarted,
  onTimerStart,
  onGoodArgument,
  onIncreaseImpatience,
  onWin,
  onLose,
}: {
  crime: string;
  timerStarted: boolean;
  onTimerStart: () => void;
  onGoodArgument: () => void;
  onIncreaseImpatience: (amount: number) => void;
  onWin: () => void;
  onLose: () => void;
}) {
  const { client, connected, connect, disconnect, volume } = useLiveAPIContext();
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

  useEffect(() => {
    if (!client) return;

    const handleContent = (content: unknown) => {
      const contentObj = content as { modelTurn?: { parts?: Array<{ text?: string }> } };
      const text = contentObj?.modelTurn?.parts?.filter((part) => typeof part.text === "string").map((part) => part.text).join("") || "";
      if (text) {
        setCurrentTranscript((prev) => prev + text);
        setIsAiSpeaking(true);

        setChatHistory((prev) => {
          const lastMsg = prev[prev.length - 1];
          if (lastMsg && lastMsg.sender === "detective" && lastMsg.isLive) {
            return [...prev.slice(0, -1), { ...lastMsg, text: lastMsg.text + text }];
          }
          
          let base = prev;
          if (userSpokeRef.current) {
            userSpokeRef.current = false;
            const lastNonVoice = prev[prev.length - 1];
            if (!lastNonVoice || lastNonVoice.sender !== "user") {
              base = [...prev, { id: "voice-" + Math.random().toString(), sender: "user", text: "🎤 [Defended via Voice Chat]", timestamp: new Date(), isVoice: true }];
            }
          }
          return [...base, { id: Math.random().toString(), sender: "detective", text: text, timestamp: new Date(), isLive: true }];
        });
      }
    };

    const handleTurnComplete = () => {
      setIsAiSpeaking(false);
      if (!firstTurnCompleteRef.current) {
        firstTurnCompleteRef.current = true;
        onTimerStart();
      }

      const transcript = transcriptRef.current.toLowerCase();
      if (["free to go", "wrong person", "case dismissed", "let you go", "dropping the charges", "my mistake"].some(phrase => transcript.includes(phrase))) {
        onWin();
        return;
      }
      if (["going down", "going to jail", "lock you up", "guilty as charged", "worthless piece of shit", "sending you to prison"].some(phrase => transcript.includes(phrase))) {
        onLose();
        return;
      }

      const goodArgumentPhrases = [
        "oh please", "that's pathetic", "nice try", "you think that's clever", "how adorable",
        "spare me", "weak argument", "feeble attempt", "dammit", "wait", "doesn't add up", "maybe",
        "perhaps", "i suppose", "alright", "fine", "whatever", "i guess", "you got lucky", "this time"
      ];
      const isGood = goodArgumentPhrases.some(phrase => transcript.includes(phrase));
      const isDismissive = ["pathetic", "weak", "feeble", "stupid", "beneath", "not smart enough", "not clever", "adorable", "spare me", "bullshit"].some(phrase => transcript.includes(phrase));

      if (timerStarted) {
        if (isGood || isDismissive) {
          setShowInnocenceBonus(true);
          onGoodArgument();
          setTimeout(() => setShowInnocenceBonus(false), 3000);
        } else {
          onIncreaseImpatience(6);
        }
      }

      setChatHistory((prev) => {
        const lastMsg = prev[prev.length - 1];
        return (lastMsg && lastMsg.sender === "detective" && lastMsg.isLive) ? [...prev.slice(0, -1), { ...lastMsg, isLive: false }] : prev;
      });
      setCurrentTranscript("");
    };

    client.on("content", handleContent).on("turncomplete", handleTurnComplete)
          .on("setupcomplete", () => {}).on("error", (e) => { setConnectionError(e.message); setIsConnecting(false); })
          .on("close", (e) => { setIsConnecting(false); setConnectionError(e.reason || (e.code !== 1000 ? `Interrogation room closed (code: ${e.code})` : null)); });

    return () => {
      client.off("content", handleContent).off("turncomplete", handleTurnComplete)
            .off("error", () => {}).off("close", () => {});
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

  useEffect(() => {
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      setIsConnecting(true);
      const timer = setTimeout(async () => {
        try { await connect(); setIsConnecting(false); } catch (error) {
          setConnectionError(error instanceof Error ? error.message : "Connection failed");
          setIsConnecting(false);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [connect]);

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
