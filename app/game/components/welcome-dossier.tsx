"use client";

import { motion } from "framer-motion";
import { BadgeAlert, RefreshCw, ScanFace } from "lucide-react";

export function WelcomeDossiers({
  randomCrime,
  changeScenario
}: {
  randomCrime: string;
  changeScenario: () => void;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      {/* Suspect dossier */}
      <div className="relative overflow-hidden rounded-lg border border-red-500/20 bg-zinc-950/75 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-md">
        <motion.div className="absolute inset-x-0 h-px bg-red-400/45 shadow-[0_0_18px_rgba(248,113,113,0.9)]" animate={{ top: ["0%", "100%", "0%"] }} transition={{ duration: 4.6, repeat: Infinity, ease: "linear" }} />
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-md border border-red-500/30 bg-red-950/20 text-red-300">
              <UserRound className="size-5" />
            </div>
            <div>
              <div className="text-[9px] font-black uppercase tracking-[0.24em] text-red-400">Subject File</div>
              <h2 className="mt-1 text-sm font-black text-zinc-100">Suspect #DODO-USER</h2>
            </div>
          </div>
          <div className="rounded-full border border-red-500/30 px-3 py-1 text-[8px] font-black uppercase tracking-widest text-red-300">Accused</div>
        </div>

        <div className="border-l-2 border-red-500/50 bg-black/35 p-3.5">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-500">
              <BadgeAlert className="size-3.5 text-red-400" /> Primary Charge
            </div>
            <button type="button" onClick={changeScenario} className="inline-flex h-7 items-center gap-1.5 rounded-md border border-cyan-400/30 bg-cyan-400/10 px-2.5 text-[8px] font-black uppercase tracking-widest text-cyan-200 hover:border-cyan-300 cursor-pointer">
              <RefreshCw className="size-2.5" /> Change Scenario
            </button>
          </div>
          <p className="text-sm font-black leading-snug text-white sm:text-base">"{randomCrime || "Retrieving charge list..."}"</p>
        </div>
      </div>

      {/* Officer dossier */}
      <div className="relative overflow-hidden rounded-lg border border-cyan-400/15 bg-zinc-950/70 p-5 backdrop-blur-md">
        <div className="relative flex items-center gap-3">
          <div className="relative flex size-12 items-center justify-center rounded-md border border-zinc-800 bg-black/35">
            <ScanFace className="size-6 text-zinc-700" />
            <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 gap-1.5">
              <span className="size-1 rounded-full bg-violet-400" />
              <span className="size-1 rounded-full bg-violet-400" />
            </div>
          </div>
          <div>
            <div className="text-[9px] font-black uppercase tracking-[0.24em] text-cyan-300">Officer Assigned</div>
            <h2 className="mt-0.5 text-sm font-black text-zinc-100">Det. Grimstone</h2>
          </div>
        </div>
        <div className="mt-4 space-y-2.5 text-[9px] uppercase tracking-widest">
          <div className="flex items-center justify-between"><span className="text-zinc-650">Temperament</span><span className="font-black text-red-300">Hostile</span></div>
          <div className="h-1 bg-zinc-900 overflow-hidden rounded"><div className="h-full w-full bg-gradient-to-r from-red-500 to-red-400" /></div>
          <div className="flex items-center justify-between"><span className="text-zinc-650">Bias</span><span className="font-black text-amber-300">Already convinced</span></div>
        </div>
      </div>
    </div>
  );
}

const UserRound = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="currentColor"><circle cx="50" cy="35" r="20" /><path d="M15,85 C15,65 30,55 50,55 C70,55 85,65 85,85 Z" /></svg>
);
