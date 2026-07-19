"use client";

import { Clock } from "lucide-react";

export function InterrogationTimer({ elapsedTime }: { elapsedTime: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex size-12 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-950/20">
        <Clock className="size-5 text-cyan-400 animate-pulse" />
      </div>
      <div className="flex flex-col">
        <span className="font-mono text-2xl font-bold tracking-tight text-white leading-none">
          {String(Math.floor(elapsedTime / 60)).padStart(2, "0")}:
          {String(elapsedTime % 60).padStart(2, "0")}
        </span>
        <span className="text-[9px] uppercase tracking-widest text-cyan-400/70 font-semibold mt-1">
          Interrogation Time
        </span>
      </div>
    </div>
  );
}
