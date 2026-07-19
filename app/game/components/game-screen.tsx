"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, MicOff, PhoneOff, RefreshCw, ShieldAlert, Wifi } from "lucide-react";
import { useState } from "react";
import { useInterrogationClient } from "../hooks/use-interrogation-client";

interface GameScreenProps {
  crime: string; elapsedTime: number; suspicion: number; timerStarted: boolean; onChangeKey: () => void;
  onWin: () => void; onLose: () => void; onTimerStart: () => void; onGoodArgument: () => void; onIncreaseImpatience: (amount: number) => void;
}

export function GameScreen({
  crime, elapsedTime, suspicion, onWin, onLose, onTimerStart, onGoodArgument, onIncreaseImpatience, timerStarted, onChangeKey
}: GameScreenProps) {
  const {
    connected, isAiSpeaking, connectionError, isConnecting,
    volume, muted, setMuted, disconnect, connect, triggerRetry
  } = useInterrogationClient({
    crime, timerStarted, onTimerStart, onGoodArgument, onIncreaseImpatience, onWin, onLose
  });

  const getOrbGradients = () => {
    if (suspicion >= 80) return "from-red-605 via-orange-600 to-rose-650 shadow-[0_0_60px_rgba(239,68,68,0.25)]";
    if (suspicion >= 50) return "from-amber-500 via-orange-500 to-yellow-600 shadow-[0_0_60px_rgba(245,158,11,0.25)]";
    return "from-cyan-500 via-violet-600 to-fuchsia-600 shadow-[0_0_60px_rgba(168,85,247,0.25)]";
  };

  const getStatusText = () => {
    if (connectionError) return "TRANSMISSION INTERRUPTED";
    if (isConnecting) return "SYNCHRONIZING BIO-UPLINK...";
    if (!connected) return "OFFLINE";
    if (isAiSpeaking) return "ENTITY IS RESPONDING";
    if (muted) return "MICROPHONE MUTED";
    return "LISTENING TO ALIBI...";
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative flex h-screen w-screen flex-col justify-between p-8 bg-black text-zinc-400 font-mono overflow-hidden select-none">
      {/* Background Grid details */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#07070a_1px,transparent_1px),linear-gradient(to_bottom,#07070a_1px,transparent_1px)] bg-[size:5rem_5rem] opacity-35 pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.85)_95%)] pointer-events-none z-0" />

      {/* Top Header Status Bar */}
      <div className="relative z-10 w-full flex items-center justify-between text-[10px] text-zinc-650 border-b border-zinc-900/60 pb-3">
        <div className="flex items-center gap-2">
          <Wifi className={cn("size-3.5", connected ? "text-cyan-400 animate-pulse" : "text-zinc-700")} />
          <span className={cn("font-bold tracking-widest", connected ? "text-cyan-400/80" : "text-zinc-700")}>
            UPLINK: {connected ? `CH_LIVE_${crime.length}` : "STANDBY"}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className={cn("font-bold transition-all", suspicion >= 80 ? "text-red-500" : suspicion >= 50 ? "text-amber-500" : "text-cyan-400/80")}>THREAT INDEX: {suspicion}%</span>
          <button onClick={onChangeKey} className="hover:text-red-400 font-bold uppercase transition-colors cursor-pointer">
            Reset Key
          </button>
        </div>
      </div>

      {/* Center Voice Orb Section */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
        <div className="relative flex items-center justify-center size-80">
          {/* Outer Pulsing Glow Aura */}
          <motion.div
            animate={{
              scale: isConnecting ? [1, 1.04, 1] : connected && isAiSpeaking ? [1, 1.16 + volume * 1.6, 1] : [1, 1.02, 1],
              opacity: connected ? [0.15, 0.35, 0.15] : [0.05, 0.1, 0.05],
              borderRadius: ["42% 58% 50% 50% / 50% 45% 55% 50%", "50% 50% 42% 58% / 45% 55% 50% 50%", "42% 58% 50% 50% / 50% 45% 55% 50%"]
            }}
            transition={{ duration: connected && isAiSpeaking ? 0.3 : 5, repeat: Infinity, ease: "easeInOut" }}
            className={cn("absolute size-64 bg-gradient-to-tr blur-3xl transition-all duration-700", getOrbGradients())}
          />

          {/* Inner Glow Aura */}
          <motion.div
            animate={{
              scale: isConnecting ? [1, 1.06, 1] : connected && isAiSpeaking ? [1, 1.1 + volume * 1.1, 1] : [1, 1.01, 1],
              borderRadius: ["50% 50% 42% 58% / 45% 55% 50% 50%", "45% 55% 50% 50% / 50% 45% 55% 50%", "50% 50% 42% 58% / 45% 55% 50% 50%"]
            }}
            transition={{ duration: connected && isAiSpeaking ? 0.45 : 4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            className={cn("absolute size-52 bg-gradient-to-tr blur-2xl opacity-60 transition-all duration-700", getOrbGradients())}
          />

          {/* Core Interactive Orb */}
          <motion.div
            animate={{
              scale: isConnecting ? 0.95 : connected && isAiSpeaking ? 1 + volume * 0.9 : connected && !muted ? [1, 1.04, 1] : 0.9,
              borderRadius: connected && isAiSpeaking 
                ? ["50% 50% 45% 55% / 50% 45% 55% 50%", "45% 55% 50% 50% / 45% 50% 50% 55%", "50% 50% 45% 55% / 50% 45% 55% 50%"]
                : ["50%", "50%", "50%"]
            }}
            transition={{ duration: connected && isAiSpeaking ? 0.25 : 3, repeat: Infinity, ease: "easeInOut" }}
            className={cn("absolute size-40 bg-gradient-to-tr transition-all duration-700 border border-white/5", getOrbGradients())}
          />
        </div>

        {/* Status Text Under Orb */}
        <div className="text-center mt-6 space-y-2">
          <p className={cn("text-xs font-bold uppercase tracking-[0.2em] transition-all", isConnecting ? "text-amber-400 animate-pulse" : connectionError ? "text-red-500 animate-pulse" : connected && isAiSpeaking ? "text-violet-400" : connected ? "text-cyan-400 animate-pulse" : "text-zinc-650")}>
            {getStatusText()}
          </p>
          <p className="text-[10px] text-zinc-600 max-w-xs font-sans tracking-wide leading-relaxed select-none">
            {connectionError ? "Google Live connection aborted." : connected ? "Microphone active. Speak your alibi clearly to defend yourself." : "Establish transmission connection to synchronize the uplink."}
          </p>
        </div>
      </div>

      {/* Floating Pill Action Dock */}
      <div className="relative z-10 w-full flex flex-col items-center gap-4 border-t border-zinc-900/60 pt-4">
        <AnimatePresence>
          {connectionError && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="flex flex-col items-center gap-1.5 text-center">
              <span className="text-[9px] text-red-550 max-w-md leading-normal select-text flex items-center gap-1.5"><ShieldAlert className="size-3.5" />{connectionError}</span>
              <button onClick={triggerRetry} className="flex items-center gap-1 text-[10px] text-red-400 font-bold uppercase underline hover:text-red-300 cursor-pointer">
                <RefreshCw className="size-3" />
                <span>Retry Sat-Link</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-4 bg-zinc-950/70 border border-zinc-900 px-6 py-3 rounded-full backdrop-blur-md shadow-2xl">
          {/* Mute button */}
          <Button
            variant="ghost"
            size="icon"
            disabled={!connected}
            onClick={() => setMuted(!muted)}
            className={cn("size-10 rounded-full border transition-all cursor-pointer", muted ? "bg-amber-950/30 border-amber-500/30 text-amber-500 hover:bg-amber-900/30" : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800")}
          >
            {muted ? <MicOff className="size-4" /> : <Mic className="size-4" />}
          </Button>

          {/* Connect / Disconnect Action */}
          <Button
            variant="destructive"
            size="icon"
            disabled={isConnecting}
            onClick={connected ? disconnect : connect}
            className={cn("size-12 rounded-full shadow-lg transition-all cursor-pointer", connected ? "bg-red-650 hover:bg-red-750" : "bg-cyan-600 hover:bg-cyan-700 text-black")}
          >
            {isConnecting ? (
              <RefreshCw className="size-5 animate-spin text-black" />
            ) : connected ? (
              <PhoneOff className="size-5" />
            ) : (
              <Wifi className="size-5 text-black" />
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
