"use client";

import { LiveAPIProvider } from "@/hooks/use-live-api";
import { audioContext } from "@/app/audio/utils";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ApiKeyModal } from "./components/api-key-modal";
import { WelcomeScreen } from "./components/welcome-screen";
import { CRIMES } from "./constants";

const SESSION_STORAGE_PREFIX = "dodo_game_session_";

function createSessionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function WelcomeApp({
  onChangeKey,
  selectedModel,
  setSelectedModel,
}: {
  onChangeKey: () => void;
  selectedModel: string;
  setSelectedModel: (m: string) => void;
}) {
  const router = useRouter();

  const startGame = useCallback((selectedCrime?: string) => {
    if (typeof window !== "undefined") {
      audioContext({ id: "audio-out" }).then((ctx) => {
        if (ctx.state === "suspended") {
          ctx.resume().catch((e) => console.warn("Failed to resume AudioContext:", e));
        }
      }).catch((e) => console.warn("Failed to access AudioContext:", e));
    }

    const randomCrime = selectedCrime || CRIMES[Math.floor(Math.random() * CRIMES.length)];
    const sessionId = createSessionId();
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        `${SESSION_STORAGE_PREFIX}${sessionId}`,
        JSON.stringify({ crime: randomCrime, model: selectedModel, createdAt: Date.now() })
      );
    }
    router.push(`/game/${sessionId}`);
  }, [router, selectedModel]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-violet-950 selection:text-white">
      <WelcomeScreen
        onStart={startGame}
        hasKey={true}
        onChangeKey={onChangeKey}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
      />
    </div>
  );
}

export default function GamePage() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedModel, setSelectedModel] = useState("models/gemini-2.5-flash-native-audio-latest");

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
      <WelcomeApp
        onChangeKey={handleClearApiKey}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
      />
    </LiveAPIProvider>
  );
}
