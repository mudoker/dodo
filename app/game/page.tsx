"use client";

import { LiveAPIProvider, useLiveAPIContext } from "@/hooks/use-live-api";
import { audioContext } from "@/app/audio/utils";
import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { ApiKeyModal } from "./components/api-key-modal";
import { GameScreen } from "./components/game-screen";
import { ResultScreen } from "./components/result-screen";
import { WelcomeScreen } from "./components/welcome-screen";
import { CRIMES, DETECTIVE_SYSTEM_PROMPT } from "./constants";
import { GamePhase } from "./types";

function GameApp({ onChangeKey }: { onChangeKey: () => void }) {
  const [phase, setPhase] = useState<GamePhase>("welcome");
  const [crime, setCrime] = useState("");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [suspicion, setSuspicion] = useState(75);
  const [timerStarted, setTimerStarted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { setConfig, disconnect, connected } = useLiveAPIContext();

  const startGame = useCallback((selectedCrime?: string) => {
    // Proactively resume audio context inside user gesture click
    if (typeof window !== "undefined") {
      audioContext({ id: "audio-out" }).then((ctx) => {
        if (ctx.state === "suspended") {
          ctx.resume().catch((e) => console.warn("Failed to resume AudioContext:", e));
        }
      }).catch((e) => console.warn("Failed to access AudioContext:", e));
    }

    const randomCrime = selectedCrime || CRIMES[Math.floor(Math.random() * CRIMES.length)];
    setCrime(randomCrime);
    setElapsedTime(0);
    setSuspicion(75);
    setTimerStarted(false);

    const gameConfig = {
      model: "models/gemini-2.0-flash",
      systemInstruction: { parts: [{ text: DETECTIVE_SYSTEM_PROMPT }] },
      generationConfig: {
        responseModalities: "audio" as const,
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: "Charon" } },
        },
      },
    };
    setConfig(gameConfig);
    setPhase("playing");
  }, [setConfig]);

  // Stopwatch ticking
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
    setPhase("welcome");
    setCrime("");
    setElapsedTime(0);
    setSuspicion(75);
    setTimerStarted(false);
  }, [connected, disconnect]);

  const finalScore = Math.max(0, 2000 - (suspicion * 12) - (elapsedTime * 2));

  // Suspicion triggers
  useEffect(() => {
    if (phase === "playing") {
      if (suspicion >= 100) handleLose();
      else if (suspicion <= 0) handleWin();
    }
  }, [suspicion, phase, handleWin, handleLose]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-violet-950 selection:text-white">
      <AnimatePresence mode="wait">
        {phase === "welcome" && (
          <WelcomeScreen
            key="welcome"
            onStart={startGame}
            hasKey={true}
            onChangeKey={onChangeKey}
          />
        )}
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

export default function GamePage() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("dodo_gemini_api_key");
    if (stored) {
      setApiKey(stored);
    }
    setIsLoaded(true);
  }, []);

  const handleApiKeySet = (key: string) => {
    localStorage.setItem("dodo_gemini_api_key", key);
    setApiKey(key);
  };

  const handleClearApiKey = () => {
    localStorage.removeItem("dodo_gemini_api_key");
    setApiKey(null);
  };

  const host = "generativelanguage.googleapis.com";
  const uri = `wss://${host}/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent`;

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center font-mono text-zinc-500 text-xs animate-pulse">
        INITIALIZING DOSSIER UPLINK...
      </div>
    );
  }

  if (!apiKey) {
    return <ApiKeyModal onApiKeySet={handleApiKeySet} />;
  }

  return (
    <LiveAPIProvider url={uri} apiKey={apiKey}>
      <GameApp onChangeKey={handleClearApiKey} />
    </LiveAPIProvider>
  );
}
