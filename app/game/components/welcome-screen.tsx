"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { BadgeAlert, FolderOpen, KeyRound, Radio, RefreshCw, ScanFace, ShieldAlert, Terminal, UserRound, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { CRIMES } from "../constants";
import { LivingOrb } from "./living-orb";

const CASE_SIGNALS = [
  { label: "Voice Link", value: "Armed", tone: "text-cyan-300" },
  { label: "Impatience", value: "100%", tone: "text-amber-300" },
  { label: "Disposition", value: "Hostile", tone: "text-red-300" },
];

export function WelcomeScreen({
  onStart,
  hasKey,
  onChangeKey,
}: {
  onStart: (crime?: string) => void;
  hasKey: boolean;
  onChangeKey: () => void;
}) {
  const [randomCrime, setRandomCrime] = useState("");
  const [terminalLog, setTerminalLog] = useState<string[]>([]);

  const changeScenario = () => {
    setRandomCrime((current) => {
      if (CRIMES.length < 2) return current;
      let nextCrime = current;
      while (nextCrime === current) {
        nextCrime = CRIMES[Math.floor(Math.random() * CRIMES.length)];
      }
      return nextCrime;
    });
  };

  useEffect(() => {
    setRandomCrime(CRIMES[Math.floor(Math.random() * CRIMES.length)]);
    const logs = [
      "ESTABLISHING AUDIO SECURE LINK...",
      "UPLINK SECURED // DETECTIVE FEED OPEN",
      "SUSPECT DOSSIER SYNC COMPLETE"
    ];
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < logs.length) {
        setTerminalLog((prev) => [...prev, logs[idx]]);
        idx++;
      } else {
        clearInterval(interval);
      }
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="relative flex min-h-screen flex-col items-center justify-between overflow-hidden bg-black p-5 font-mono text-white sm:p-7">
      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(20,184,166,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(239,68,68,0.045)_1px,transparent_1px)] bg-[size:4.5rem_4.5rem]" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_28%_28%,rgba(34,211,238,0.15),transparent_34%),radial-gradient(circle_at_68%_38%,rgba(239,68,68,0.12),transparent_30%),radial-gradient(circle_at_50%_92%,rgba(168,85,247,0.12),transparent_36%)]" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_center,rgba(2,6,23,0.16),rgba(0,0,0,0.72)_72%,rgba(0,0,0,0.96))]" />
      
      {/* Top Banner Status */}
      <div className="relative z-10 flex w-full max-w-6xl items-center justify-between border-b border-zinc-800/70 pb-3 text-[10px] font-bold tracking-widest text-zinc-500">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-red-500 shadow-[0_0_14px_rgba(239,68,68,0.9)] animate-ping" />
          <span className="text-red-500">INTRUSION DETECTED // CASE #{(randomCrime.length * 17) || 99}</span>
        </div>
        <span>SYSTEM TIME: 2026.07.19</span>
      </div>

      {/* Main Core Dashboard */}
      <main className="relative z-10 my-auto grid w-full max-w-6xl items-stretch gap-6 py-8 lg:grid-cols-[1fr_23rem] lg:py-10">
        <section className="min-w-0">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.28em] text-red-400">
                <ShieldAlert className="size-3.5" />
                Live Interrogation Intake
              </div>
              <h1 className="text-5xl font-black uppercase leading-none tracking-normal text-white drop-shadow-[0_0_24px_rgba(239,68,68,0.18)] sm:text-7xl">
                DODO
              </h1>
              <p className="mt-3 max-w-xl text-xs font-bold uppercase tracking-[0.22em] text-zinc-400">
                Tactical accusation engine for ridiculous office crimes.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:min-w-80">
              {CASE_SIGNALS.map((signal) => (
                <div key={signal.label} className="border border-zinc-800/80 bg-zinc-950/70 p-3 backdrop-blur-md">
                  <div className="text-[8px] font-bold uppercase tracking-widest text-zinc-600">{signal.label}</div>
                  <div className={cn("mt-2 text-xs font-black uppercase", signal.tone)}>{signal.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative overflow-hidden rounded-lg border border-red-500/20 bg-zinc-950/75 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-md">
              <motion.div className="absolute inset-x-0 h-px bg-red-400/45 shadow-[0_0_18px_rgba(248,113,113,0.9)]" animate={{ top: ["0%", "100%", "0%"] }} transition={{ duration: 4.6, repeat: Infinity, ease: "linear" }} />
              <div className="mb-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-md border border-red-500/30 bg-red-950/20 text-red-300 shadow-[inset_0_0_28px_rgba(239,68,68,0.12)]">
                    <UserRound className="size-5" />
                  </div>
                  <div>
                    <div className="text-[9px] font-black uppercase tracking-[0.24em] text-red-400">Subject File</div>
                    <h2 className="mt-1 text-lg font-black text-zinc-100">Suspect #DODO-USER</h2>
                  </div>
                </div>
                <div className="rounded-full border border-red-500/30 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-red-300">
                  Accused
                </div>
              </div>

              <div className="border-l-2 border-red-500/50 bg-black/35 p-4">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-500">
                    <BadgeAlert className="size-3.5 text-red-400" />
                    Primary Charge
                  </div>
                  <button
                    type="button"
                    onClick={changeScenario}
                    className="inline-flex h-8 items-center gap-1.5 rounded-md border border-cyan-400/30 bg-cyan-400/10 px-3 text-[9px] font-black uppercase tracking-widest text-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.08)] transition-colors hover:border-cyan-300/60 hover:bg-cyan-400/15 hover:text-white"
                  >
                    <RefreshCw className="size-3" />
                    Change Scenario
                  </button>
                </div>
                <p className="text-base font-black leading-snug text-white sm:text-xl">
                  {randomCrime || "Retrieving charge list..."}
                </p>
              </div>

              <div className="mt-4 grid gap-3 text-[10px] uppercase tracking-widest text-zinc-500 sm:grid-cols-3">
                <div className="border border-zinc-800 bg-black/25 p-3">
                  <span className="block text-zinc-600">Plea</span>
                  <span className="mt-1 block font-black text-zinc-200">Unknown</span>
                </div>
                <div className="border border-zinc-800 bg-black/25 p-3">
                  <span className="block text-zinc-600">Evidence</span>
                  <span className="mt-1 block font-black text-amber-300">Absurd</span>
                </div>
                <div className="border border-zinc-800 bg-black/25 p-3">
                  <span className="block text-zinc-600">Risk</span>
                  <span className="mt-1 block font-black text-red-300">Elevated</span>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-lg border border-cyan-400/15 bg-zinc-950/70 p-5 backdrop-blur-md">
              <div className="absolute -right-20 -top-20 size-48 rounded-full bg-cyan-400/10 blur-3xl" />
              <div className="relative flex items-center gap-4">
                <div className="relative flex size-20 items-center justify-center rounded-md border border-zinc-800 bg-black/35">
                  <ScanFace className="size-10 text-zinc-700" />
                  <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 gap-2">
                    <span className="size-1.5 rounded-full bg-violet-400 shadow-[0_0_9px_rgba(167,139,250,0.9)]" />
                    <span className="size-1.5 rounded-full bg-violet-400 shadow-[0_0_9px_rgba(167,139,250,0.9)]" />
                  </div>
                </div>
                <div>
                  <div className="text-[9px] font-black uppercase tracking-[0.24em] text-cyan-300">Officer Assigned</div>
                  <h2 className="mt-1 text-lg font-black text-zinc-100">Det. Grimstone</h2>
                  <p className="mt-2 text-[10px] leading-relaxed text-zinc-500">Low patience. High certainty. Questionable evidence hygiene.</p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-widest">
                  <span className="text-zinc-600">Temperament</span>
                  <span className="font-black text-red-300">Hostile</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-zinc-900">
                  <div className="h-full w-full rounded-full bg-gradient-to-r from-red-500 via-amber-400 to-red-400 shadow-[0_0_18px_rgba(239,68,68,0.55)]" />
                </div>
                <div className="flex items-center justify-between text-[10px] uppercase tracking-widest">
                  <span className="text-zinc-600">Bias</span>
                  <span className="font-black text-amber-300">Already convinced</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-stretch">
            <div className="min-h-24 rounded-lg border border-zinc-800/90 bg-black/50 p-4 text-[10px] leading-relaxed text-zinc-500">
              <div className="mb-3 flex items-center gap-2 font-black uppercase tracking-[0.22em] text-zinc-400">
                <Terminal className="size-3.5 text-red-400" />
                Uplink Console
              </div>
              {terminalLog.map((log, i) => (
                <div key={i} className="flex gap-1.5">
                  <span className="text-red-500">&gt;</span>
                  <span>{log}{i === terminalLog.length - 1 && <span className="ml-1 inline-block h-3 w-1.5 bg-red-500/80 animate-pulse" />}</span>
                </div>
              ))}
            </div>

            <div className="relative flex items-center justify-center">
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-red-600 via-orange-400 to-cyan-400 opacity-50 blur-md" />
              <Button onClick={() => onStart(randomCrime)} size="lg" className="relative h-full min-h-16 w-full rounded-lg bg-red-600 px-8 text-sm font-black uppercase tracking-normal text-white shadow-2xl hover:bg-red-500 lg:w-80">
                <FolderOpen className="size-4.5" />
                <span>Establish Dossier Link</span>
              </Button>
            </div>
          </div>
        </section>

        <aside className="relative mx-auto flex w-full max-w-sm flex-col items-center justify-center overflow-hidden rounded-lg border border-zinc-800/80 bg-zinc-950/55 p-5 backdrop-blur-md">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.13),transparent_54%)]" />
          <div className="relative z-10 flex w-full items-center justify-between text-[9px] font-black uppercase tracking-[0.22em] text-zinc-500">
            <span className="flex items-center gap-1.5"><Radio className="size-3 text-cyan-300" /> Signal Core</span>
            <span className="text-cyan-300">Standby</span>
          </div>
          <div className="relative z-10 my-2 flex min-h-72 flex-1 w-full items-center justify-center">
            <LivingOrb state="offline" volume={0.01} suspicion={65} />
          </div>
          <div className="relative z-10 grid w-full grid-cols-2 gap-3 text-[10px] uppercase tracking-widest">
            <div className="border border-zinc-800 bg-black/35 p-3">
              <KeyRound className="mb-2 size-3.5 text-amber-300" />
              <span className="block text-zinc-600">API Key</span>
              <span className="mt-1 block font-black text-zinc-200">{hasKey ? "Loaded" : "Missing"}</span>
            </div>
            <div className="border border-zinc-800 bg-black/35 p-3">
              <Zap className="mb-2 size-3.5 text-cyan-300" />
              <span className="block text-zinc-600">Latency</span>
              <span className="mt-1 block font-black text-zinc-200">Volatile</span>
            </div>
          </div>
        </aside>
      </main>

      {/* Footer controls & change API Key */}
      <div className="relative z-10 flex w-full max-w-6xl items-center justify-between border-t border-zinc-800/70 pt-3 text-[9px] text-zinc-600">
        <span>SECURITY PROTOCOL: GOOGLE_BIDI_SECURE</span>
        {hasKey && (
          <button onClick={onChangeKey} className="cursor-pointer rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 font-black uppercase tracking-widest text-red-300 shadow-[0_0_18px_rgba(239,68,68,0.08)] transition-colors hover:border-red-400/60 hover:bg-red-500/15 hover:text-red-100">
            Reset API Key
          </button>
        )}
      </div>
    </motion.div>
  );
}
