"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Activity, Gauge } from "lucide-react";
import { DetectiveProfile } from "./detective-profile";

export function GameHud({
  suspicion,
  mood,
  score,
  isAiSpeaking,
  connected,
  volume,
  muted,
}: {
  suspicion: number;
  mood: string;
  score: number;
  isAiSpeaking: boolean;
  connected: boolean;
  volume: number;
  muted: boolean;
}) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full lg:w-72 flex flex-col gap-4 z-20">
      <DetectiveProfile mood={mood} suspicion={suspicion} isSpeaking={isAiSpeaking} connected={connected} />
      
      {/* Suspicion Level Gauge */}
      <motion.div key={suspicion} animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 0.3 }} className="rounded-xl border border-zinc-900 bg-zinc-950/30 p-5 backdrop-blur-sm shadow-xl">
        <div className="mb-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2"><Gauge className="size-4.5 text-zinc-400" /><h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Suspicion</h3></div>
          <span className={cn("text-xs font-black px-2 py-0.5 rounded-md font-mono", suspicion >= 80 ? "bg-red-950 text-red-400 animate-pulse" : suspicion >= 50 ? "bg-amber-950 text-amber-400" : "bg-emerald-950 text-emerald-400")}>{suspicion}%</span>
        </div>
        <div className="h-3 w-full rounded-full bg-zinc-950 overflow-hidden border border-zinc-900 p-0.5"><motion.div className={cn("h-full rounded-full bg-gradient-to-r", suspicion >= 75 ? "from-amber-500 to-red-500" : suspicion >= 40 ? "from-emerald-500 to-amber-500" : "from-cyan-500 to-emerald-500")} initial={{ width: "75%" }} animate={{ width: `${suspicion}%` }} transition={{ duration: 0.4 }} /></div>
        <div className="mt-2.5 flex items-center justify-between text-[9px] text-zinc-500 uppercase tracking-widest font-semibold"><span>Innocent</span><span>Locked Up</span></div>
      </motion.div>

      {/* Case Report Card */}
      <div className="rounded-xl border border-zinc-900 bg-zinc-950/30 p-5 backdrop-blur-sm space-y-3 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Case Report</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs border-b border-zinc-900/50 pb-2"><span className="text-zinc-500">Detective Mood</span><span className={cn("font-bold", suspicion >= 85 ? "text-red-400 animate-pulse" : suspicion >= 65 ? "text-red-300" : suspicion >= 45 ? "text-amber-400" : "text-emerald-400")}>{mood}</span></div>
          <div className="flex items-center justify-between text-xs"><span className="text-zinc-500">Score Rating</span><span className="font-bold text-cyan-400 font-mono">{score.toLocaleString()} pts</span></div>
        </div>
      </div>

      {/* Vocal Stress & Biometrics Card */}
      <div className="rounded-xl border border-zinc-900 bg-zinc-950/30 p-5 backdrop-blur-sm space-y-4 shadow-xl text-xs">
        <div className="w-full flex items-center justify-between border-b border-zinc-900 pb-2">
          <div className="flex items-center gap-2">
            <Activity className={cn("size-4 text-cyan-400", connected && !muted && "animate-pulse")} />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-350">Biometric Scan</h3>
          </div>
          <span className={cn("text-[9px] px-1.5 py-0.5 rounded font-black tracking-wider uppercase", !connected ? "bg-zinc-900 text-zinc-550" : muted ? "bg-amber-950/40 text-amber-500" : "bg-cyan-950/40 text-cyan-400 animate-pulse")}>
            {!connected ? "Offline" : muted ? "Muted" : "Active"}
          </span>
        </div>

        {/* Dynamic EKG Stress wave */}
        <div className="relative h-12 w-full bg-black/45 border border-zinc-900/60 rounded-lg overflow-hidden flex items-center justify-center">
          {connected && !muted ? (
            <svg viewBox="0 0 100 30" className="w-full h-12 text-cyan-500/50 stroke-current stroke-[1.5] fill-none">
              <motion.path
                d="M 0,15 L 20,15 L 23,8 L 26,22 L 29,15 L 45,15 L 48,5 L 52,25 L 56,15 L 75,15 L 78,8 L 81,22 L 84,15 L 100,15"
                animate={{
                  strokeDashoffset: [120, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "linear",
                }}
                strokeDasharray="20 10"
              />
            </svg>
          ) : (
            <div className="text-[10px] text-zinc-600 font-mono tracking-widest uppercase animate-pulse">Scanner Standby</div>
          )}
        </div>

        {/* Stress Metrics */}
        <div className="grid grid-cols-2 gap-4 text-[10px] text-zinc-400">
          <div className="space-y-0.5">
            <span className="text-zinc-600 uppercase block font-semibold">Stress Level</span>
            <span className={cn("font-bold text-sm font-mono", !connected ? "text-zinc-550" : suspicion >= 80 ? "text-red-400 animate-pulse" : suspicion >= 50 ? "text-amber-400" : "text-cyan-400")}>
              {!connected ? "0.00" : (suspicion * 0.93 + (isAiSpeaking ? 4.2 : 0)).toFixed(2)}%
            </span>
          </div>
          <div className="space-y-0.5 text-right">
            <span className="text-zinc-600 uppercase block font-semibold">Truth Credibility</span>
            <span className={cn("font-bold text-sm font-mono", !connected ? "text-zinc-550" : (100 - suspicion) <= 25 ? "text-red-400 animate-pulse" : (100 - suspicion) <= 50 ? "text-amber-400" : "text-emerald-400")}>
              {!connected ? "0.00" : (100 - suspicion).toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
