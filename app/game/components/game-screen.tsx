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

  const getGlowColor = () => {
    if (suspicion >= 80) return "rgba(239,68,68,0.7)"; // Red
    if (suspicion >= 50) return "rgba(245,158,11,0.7)"; // Amber
    return "rgba(168,85,247,0.7)"; // Purple
  };

  const getOrbGradients = () => {
    if (suspicion >= 80) return "from-red-650 via-orange-600 to-rose-700";
    if (suspicion >= 50) return "from-amber-500 via-orange-500 to-yellow-600";
    return "from-cyan-500 via-violet-600 to-fuchsia-600";
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
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#07070a_1px,transparent_1px),linear-gradient(to_bottom,#07070a_1px,transparent_1px)] bg-[size:5rem_5rem] opacity-30 pointer-events-none z-0" />
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

      {/* Center Hextech Singularity Core */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center" style={{ perspective: "1000px" }}>
        <div className="relative flex items-center justify-center size-96">
          {/* Nebula Aura Backdrops */}
          <motion.div
            animate={{
              scale: isConnecting ? [1, 1.05, 1] : connected && isAiSpeaking ? [1, 1.2 + volume * 1.5, 1] : [1, 1.02, 1],
              opacity: connected ? [0.12, 0.3, 0.12] : [0.03, 0.08, 0.03],
              borderRadius: ["40% 60% 50% 50% / 50% 40% 60% 50%", "50% 50% 40% 60% / 40% 60% 50% 50%", "40% 60% 50% 50% / 50% 40% 60% 50%"]
            }}
            transition={{ duration: connected && isAiSpeaking ? 0.35 : 6, repeat: Infinity, ease: "easeInOut" }}
            className={cn("absolute size-80 bg-gradient-to-tr blur-3xl transition-all duration-700", getOrbGradients())}
          />
          <motion.div
            animate={{
              scale: isConnecting ? [1, 1.08, 1] : connected && isAiSpeaking ? [1, 1.15 + volume * 1.1, 1] : [1, 1.01, 1],
              borderRadius: ["50% 50% 40% 60% / 40% 60% 50% 50%", "40% 60% 50% 50% / 50% 40% 60% 50%", "50% 50% 40% 60% / 40% 60% 50% 50%"]
            }}
            transition={{ duration: connected && isAiSpeaking ? 0.45 : 4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            className={cn("absolute size-64 bg-gradient-to-tr blur-2xl opacity-60 transition-all duration-700", getOrbGradients())}
          />

          {/* 3D Tilted Rotating Rings */}
          <motion.div
            animate={{ rotateX: 65, rotateY: 20, rotateZ: [0, 360] }}
            transition={{ rotateZ: { duration: 15, repeat: Infinity, ease: "linear" } }}
            className="absolute size-72 rounded-full border border-cyan-400/30 blur-[0.6px] shadow-[0_0_15px_rgba(34,211,238,0.1)] pointer-events-none"
            style={{ transformStyle: "preserve-3d" }}
          />
          <motion.div
            animate={{ rotateX: -45, rotateY: -35, rotateZ: [360, 0] }}
            transition={{ rotateZ: { duration: 18, repeat: Infinity, ease: "linear" } }}
            className="absolute size-64 rounded-full border border-dashed border-fuchsia-500/25 blur-[0.5px] pointer-events-none"
            style={{ transformStyle: "preserve-3d" }}
          />

          {/* Tesseract projection wireframe */}
          <svg viewBox="0 0 100 100" className="absolute size-48 text-violet-400/20 stroke-current stroke-[1.2] fill-none pointer-events-none z-10">
            <motion.rect x="15" y="15" width="70" height="70" rx="4" animate={{ rotate: 360 }} transition={{ duration: 35, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "50px 50px" }} />
            <motion.rect x="32" y="32" width="36" height="36" rx="2" animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "50px 50px" }} />
            <line x1="15" y1="15" x2="32" y2="32" />
            <line x1="85" y1="15" x2="68" y2="32" />
            <line x1="15" y1="85" x2="32" y2="68" />
            <line x1="85" y1="85" x2="68" y2="68" />
          </svg>

          {/* Black Hole Singularity Core */}
          <motion.div
            animate={{
              x: connected ? [-3, 3, -1, 1, -3] : 0,
              y: connected ? [-2, 2, 1, -1, -2] : 0,
              scale: isConnecting ? 0.9 : connected && isAiSpeaking ? 1 + volume * 0.7 : connected && !muted ? [1, 1.04, 1] : 0.9
            }}
            transition={{
              x: { duration: 8, repeat: Infinity, ease: "linear" },
              y: { duration: 7, repeat: Infinity, ease: "linear" },
              scale: { duration: connected && isAiSpeaking ? 0.22 : 3, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute size-36 rounded-full bg-black border border-zinc-900/80 z-20 flex items-center justify-center transition-all duration-700 shadow-inner"
            style={{
              boxShadow: `0 0 35px ${getGlowColor()}, inset 0 0 20px rgba(0, 0, 0, 0.95)`
            }}
          >
            {/* Swirling core singularity vortex */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className={cn("size-24 rounded-full bg-gradient-to-tr opacity-25 blur-md", getOrbGradients())}
            />
          </motion.div>
        </div>

        {/* Status Text Under Singularity */}
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
            className={cn("size-12 rounded-full shadow-lg transition-all cursor-pointer", connected ? "bg-red-650 hover:bg-red-750" : "bg-cyan-650 hover:bg-cyan-750 text-black")}
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
