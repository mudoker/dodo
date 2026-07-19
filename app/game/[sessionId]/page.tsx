"use client";

import { LiveAPIProvider } from "@/hooks/use-live-api";
import { use, useEffect, useState } from "react";
import { ApiKeyModal } from "../components/api-key-modal";
import { GameSession } from "../components/game-session";

interface SessionPageProps {
  params: Promise<{ sessionId: string }>;
}

export default function SessionPage({ params }: SessionPageProps) {
  const { sessionId } = use(params);
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
        INITIALIZING SESSION UPLINK...
      </div>
    );
  }

  if (!apiKey) {
    return <ApiKeyModal onApiKeySet={handleApiKeySet} />;
  }

  return (
    <LiveAPIProvider url={uri} apiKey={apiKey}>
      <GameSession sessionId={sessionId} onChangeKey={handleClearApiKey} />
    </LiveAPIProvider>
  );
}
