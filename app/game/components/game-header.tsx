"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export function GameHeader({
  elapsedTime,
  crime,
  onChangeKey,
}: {
  elapsedTime: number;
  crime: string;
  onChangeKey: () => void;
}) {
  return (
    <header className="relative z-20 border-b border-zinc-900 bg-zinc-950/60 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <motion.div className="absolute -inset-2 rounded-full bg-red-500/10 blur-md" animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 2.5, repeat: Infinity }} />
              <AlertTriangle className="relative size-6 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
            </div>
            <span className="font-mono text-xl font-bold tracking-tighter text-white">DoDo</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onChangeKey}
            className="text-zinc-500 hover:text-red-400 gap-1.5 h-8 px-2 text-[9px] uppercase font-bold tracking-wider hover:bg-zinc-950 border border-zinc-900"
          >
            <span>Reset Key</span>
          </Button>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-mono text-2xl font-bold text-white">
            {String(Math.floor(elapsedTime / 60)).padStart(2, "0")}:{String(elapsedTime % 60).padStart(2, "0")}
          </span>
          <span className="text-[9px] uppercase tracking-widest text-cyan-400/70 font-semibold">Active Stopwatch</span>
        </div>
      </div>
      <div className="border-t border-zinc-900 bg-zinc-950/20 px-6 py-2">
        <p className="mx-auto max-w-6xl text-center text-xs text-zinc-400">
          <span className="font-black text-red-500 uppercase">Charges:</span> "{crime}"
        </p>
      </div>
    </header>
  );
}
