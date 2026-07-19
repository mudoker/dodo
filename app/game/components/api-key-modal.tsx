"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";

export function ApiKeyModal({ onApiKeySet }: { onApiKeySet: (apiKey: string) => void }) {
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedKey = apiKey.trim();

    if (!trimmedKey) {
      setError("Please enter your API key");
      return;
    }

    setError("");
    onApiKeySet(trimmedKey);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm px-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md rounded-2xl border border-zinc-900 bg-zinc-950 p-8 shadow-2xl backdrop-blur-xl"
      >
        <div className="mb-6 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-violet-950/40 p-4 border border-violet-500/20">
              <AlertTriangle className="size-8 text-violet-400" />
            </div>
          </div>
          <h2 className="mb-2 text-2xl font-bold text-white tracking-tight">API Key Required</h2>
          <p className="text-sm text-zinc-500">
            Enter your Google Gemini API key to enter the room
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="api-key" className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-400">
              Google Gemini API Key
            </label>
            <Input
              id="api-key"
              type="password"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setError("");
              }}
              placeholder="Enter your API key..."
              className={cn(
                "w-full bg-black/40 border-zinc-800 text-white placeholder:text-zinc-700",
                error && "border-red-500/50 focus:border-red-500"
              )}
            />
            {error && (
              <p className="mt-2 text-xs text-red-400 font-medium">{error}</p>
            )}
            <p className="mt-2 text-[10px] text-zinc-600">
              Your key is only saved in memory and sent directly to Google AI servers. Get one from{" "}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-400 hover:text-violet-300 underline"
              >
                Google AI Studio
              </a>
            </p>
          </div>

          <Button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold h-12"
          >
            Connect to Interrogation Room
          </Button>
        </form>
      </motion.div>
    </motion.div>
  );
}
