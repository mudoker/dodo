"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, MicOff, PhoneOff, RefreshCw, ShieldAlert, Wifi } from "lucide-react";
import { LivingOrb } from "./living-orb";
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

  const getStatusText = () => {
    if (connectionError) return "TRANSMISSION INTERRUPTED";
    if (isConnecting) return "SYNCHRONIZING BIO-UPLINK...";
    if (!connected) return "OFFLINE";
    if (isAiSpeaking) return "ENTITY IS RESPONDING";
    if (muted) return "MICROPHONE MUTED";
    return "LISTENING TO ALIBI...";
  };

  const orbState = connectionError
    ? "error"
    : isConnecting
      ? "connecting"
      : connected && isAiSpeaking
        ? "talking"
        : connected && muted
          ? "muted"
          : connected
            ? "listening"
            : "offline";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative flex h-screen w-screen flex-col justify-between bg-black p-5 font-mono text-zinc-400 select-none overflow-hidden sm:p-8">
      {/* Background Grid details */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(20,184,166,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(217,70,239,0.045)_1px,transparent_1px)] bg-[size:5rem_5rem] opacity-75" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(15,23,42,0)_0%,rgba(8,7,22,0.18)_36%,rgba(0,0,0,0.92)_96%)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[conic-gradient(from_160deg,rgba(34,211,238,0.14),rgba(217,70,239,0.12),rgba(251,191,36,0.1),rgba(34,211,238,0.14))] blur-3xl" />

      {/* Top Header Status Bar */}
      <div className="relative z-10 flex w-full items-center justify-between border-b border-zinc-800/70 pb-3 text-[10px] text-zinc-500">
        <div className="flex items-center gap-2">
          <Wifi className={cn("size-3.5", connected ? "text-cyan-400 animate-pulse" : "text-zinc-700")} />
          <span className={cn("font-bold tracking-widest", connected ? "text-cyan-400/80" : "text-zinc-700")}>
            UPLINK: {connected ? `CH_LIVE_${crime.length}` : "STANDBY"}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className={cn("font-bold transition-all", suspicion >= 80 ? "text-red-500" : suspicion >= 50 ? "text-amber-500" : "text-cyan-400/80")}>THREAT INDEX: {suspicion}%</span>
          <button onClick={onChangeKey} className="cursor-pointer font-bold uppercase transition-colors hover:text-red-400">
            Reset Key
          </button>
        </div>
      </div>

      {/* Center Living Orb */}
      <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center py-2 sm:py-4">
        <LivingOrb state={orbState} volume={volume} suspicion={suspicion} />

        {/* Status Text Under Orb */}
        <div className="-mt-2 space-y-2 text-center sm:mt-0">
          <p className={cn("text-xs font-bold uppercase tracking-[0.24em] transition-all", isConnecting ? "text-amber-300 animate-pulse" : connectionError ? "text-red-400 animate-pulse" : connected && isAiSpeaking ? "text-fuchsia-300" : connected ? "text-cyan-300 animate-pulse" : "text-zinc-500")}>
            {getStatusText()}
          </p>
          <p className="max-w-xs text-[10px] font-sans leading-relaxed tracking-wide text-zinc-500 select-none">
            {connectionError ? "Google Live connection stalled. Retry the uplink or reset the API key." : connected ? "Microphone active. Speak your alibi clearly to defend yourself." : "Establish transmission connection to synchronize the uplink."}
          </p>
        </div>
      </div>

      {/* Floating Pill Action Dock */}
      <div className="relative z-10 flex w-full flex-col items-center gap-4 border-t border-zinc-800/70 pt-4">
        <AnimatePresence>
          {connectionError && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="flex flex-col items-center gap-1.5 text-center">
              <span className="flex max-w-md items-center gap-1.5 text-[9px] leading-normal text-red-400 select-text"><ShieldAlert className="size-3.5" />{connectionError}</span>
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
            className={cn("size-12 cursor-pointer rounded-full shadow-lg transition-all", connected ? "bg-red-600 hover:bg-red-700" : "bg-cyan-500 text-black hover:bg-cyan-400")}
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
