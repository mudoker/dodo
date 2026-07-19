"use client";

import { audioContext } from "@/app/audio/utils";
import { useLiveAPIContext } from "@/hooks/use-live-api";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { CRIMES, DETECTIVE_SYSTEM_PROMPT } from "../constants";
import { GamePhase } from "../types";
import { GameScreen } from "./game-screen";
import { ResultScreen } from "./result-screen";

const SESSION_STORAGE_PREFIX = "dodo_game_session_";
const DEFAULT_MODEL = "models/gemini-2.5-flash-native-audio-latest";

interface StoredGameSession {
  crime?: string;
  model?: string;
}

interface GameSessionProps {
  sessionId: string;
  onChangeKey: () => void;
}

function readStoredSession(sessionId: string): StoredGameSession {
  if (typeof window === "undefined") return {};

  try {
    const raw = sessionStorage.getItem(`${SESSION_STORAGE_PREFIX}${sessionId}`);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function GameSession({ sessionId, onChangeKey }: GameSessionProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<GamePhase>("playing");
  const [crime, setCrime] = useState("");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [suspicion, setSuspicion] = useState(75);
  const [timerStarted, setTimerStarted] = useState(false);
  const [isSessionLoaded, setIsSessionLoaded] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { setConfig, disconnect, connected } = useLiveAPIContext();

  useEffect(() => {
    audioContext({ id: "audio-out" }).then((ctx) => {
      if (ctx.state === "suspended") {
        ctx.resume().catch((error) => console.warn("Failed to resume AudioContext:", error));
      }
    }).catch((error) => console.warn("Failed to access AudioContext:", error));

    const storedSession = readStoredSession(sessionId);
    const restoredCrime = storedSession.crime || CRIMES[Math.floor(Math.random() * CRIMES.length)];
    const restoredModel = storedSession.model || DEFAULT_MODEL;

    setCrime(restoredCrime);
    setElapsedTime(0);
    setSuspicion(75);
    setTimerStarted(false);
    setPhase("playing");
    setConfig({
      model: restoredModel,
      systemInstruction: { parts: [{ text: DETECTIVE_SYSTEM_PROMPT }] },
      generationConfig: {
        responseModalities: ["AUDIO"] as const,
        maxOutputTokens: 80,
        temperature: 0.7,
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: "Charon" } },
        },
      },
      realtimeInputConfig: {
        automaticActivityDetection: {
          disabled: true,
        },
        turnCoverage: "TURN_INCLUDES_ONLY_ACTIVITY",
      },
    });
    setIsSessionLoaded(true);
  }, [sessionId, setConfig]);

  useEffect(() => {
    if (phase === "playing" && timerStarted) {
      timerRef.current = setInterval(() => { setElapsedTime((prev) => prev + 1); }, 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }
  }, [phase, timerStarted]);

  const handleTimerStart = useCallback(() => setTimerStarted(true), []);
  const handleLose = useCallback(() => { if (timerRef.current) clearInterval(timerRef.current); setPhase("lost"); }, []);
  const handleWin = useCallback(() => { if (timerRef.current) clearInterval(timerRef.current); setPhase("won"); }, []);
  const handleGoodArgument = useCallback(() => setSuspicion((prev) => Math.max(0, prev - 15)), []);
  const handleIncreaseImpatience = useCallback((amount: number) => setSuspicion((prev) => Math.min(100, prev + amount)), []);

  const handleRestart = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (connected) disconnect();
    router.push("/game");
  }, [connected, disconnect, router]);

  useEffect(() => {
    if (phase === "playing") {
      if (suspicion >= 100) handleLose();
      else if (suspicion <= 0) handleWin();
    }
  }, [suspicion, phase, handleWin, handleLose]);

  const finalScore = Math.max(0, 2000 - (suspicion * 12) - (elapsedTime * 2));

  if (!isSessionLoaded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center font-mono text-zinc-500 text-xs animate-pulse">
        RESTORING SESSION {sessionId.slice(0, 8).toUpperCase()}...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-violet-950 selection:text-white">
      <AnimatePresence mode="wait">
        {phase === "playing" && (
          <GameScreen
            key="playing"
            crime={crime}
            elapsedTime={elapsedTime}
            suspicion={suspicion}
            onWin={handleWin}
            onLose={handleLose}
            onTimerStart={handleTimerStart}
            onGoodArgument={handleGoodArgument}
            onIncreaseImpatience={handleIncreaseImpatience}
            timerStarted={timerStarted}
            onChangeKey={onChangeKey}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(phase === "won" || phase === "lost") && (
          <ResultScreen
            key="result"
            won={phase === "won"}
            crime={crime}
            score={finalScore}
            elapsedTime={elapsedTime}
            onRestart={handleRestart}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
