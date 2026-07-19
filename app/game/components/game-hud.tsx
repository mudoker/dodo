"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Gauge } from "lucide-react";
import { DetectiveProfile } from "./detective-profile";
import { EqualizerWaveform } from "./equalizer-waveform";
import { FloatingBlob } from "./floating-blob";

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
      <DetectiveProfile mood={mood} suspicion={suspicion} isSpeaking={isAiSpeaking} />
      
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

      {/* Voice Analyzer card */}
      <div className="flex-1 rounded-xl border border-zinc-900 bg-zinc-950/10 p-5 flex flex-col justify-between items-center backdrop-blur-sm overflow-hidden min-h-[180px] shadow-xl">
        <div className="w-full flex items-center gap-2 mb-2 self-start"><span className={cn("size-2 rounded-full bg-cyan-500/85", connected && "animate-pulse")} /><h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Voice Analyzer</h3></div>
        <EqualizerWaveform isSpeaking={isAiSpeaking} isActive={connected && !muted} />
        <div className="scale-35 opacity-30 -my-6"><FloatingBlob isActive={connected} volume={volume} isSpeaking={isAiSpeaking} /></div>
      </div>
    </motion.div>
  );
}
