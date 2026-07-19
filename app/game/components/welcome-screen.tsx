"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { AlertTriangle, FolderOpen, ShieldAlert, Terminal, UserX } from "lucide-react";
import { useEffect, useState } from "react";
import { CRIMES } from "../constants";
import { FloatingBlob } from "./floating-blob";

export function WelcomeScreen({
  onStart,
  hasKey,
  onChangeKey,
}: {
  onStart: () => void;
  hasKey: boolean;
  onChangeKey: () => void;
}) {
  const [randomCrime, setRandomCrime] = useState("");
  const [terminalLog, setTerminalLog] = useState<string[]>([]);

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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="relative flex min-h-screen flex-col items-center justify-between p-6 bg-black text-white font-mono overflow-hidden">
      {/* Vibrant Background flows */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-45 blur-xl">
        <FloatingBlob isActive={false} volume={0} isSpeaking={false} />
      </div>
      <div className="pointer-events-none absolute inset-0 z-[1] bg-black/40 backdrop-blur-[1px]" />
      
      {/* Top Banner Status */}
      <div className="relative z-10 w-full max-w-5xl flex items-center justify-between border-b border-zinc-900 pb-3 text-[10px] text-zinc-500 font-bold tracking-widest">
        <div className="flex items-center gap-2">
          <span className="size-2 bg-red-500 animate-ping rounded-full" />
          <span className="text-red-500">INTRUSION DETECTED // CASE #{(randomCrime.length * 17) || 99}</span>
        </div>
        <span>SYSTEM TIME: 2026.07.19</span>
      </div>

      {/* Main Core Dashboard */}
      <div className="relative z-10 w-full max-w-5xl flex flex-col gap-6 my-auto">
        <div className="text-center space-y-2 mb-2">
          <h1 className="text-5xl font-black tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] uppercase">DODO</h1>
          <p className="text-xs tracking-widest text-zinc-400 font-bold uppercase">Tactical Interrogation Client</p>
        </div>

        {/* Dossiers Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Suspect File */}
          <div className="rounded-xl border border-zinc-900 bg-zinc-950/80 p-5 shadow-2xl relative overflow-hidden flex flex-col sm:flex-row gap-4 backdrop-blur-sm min-h-[170px]">
            <motion.div className="absolute inset-x-0 h-[1.5px] bg-red-500/20 shadow-[0_0_8px_#ef4444]" animate={{ top: ["0%", "100%", "0%"] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} />
            <div className="relative flex size-24 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/30 overflow-hidden flex-shrink-0 self-center">
              <svg viewBox="0 0 100 100" className="size-16 fill-zinc-800 animate-pulse"><circle cx="50" cy="35" r="20" /><path d="M15,85 C15,65 30,55 50,55 C70,55 85,65 85,85 Z" /></svg>
              <div className="absolute inset-0 border border-red-500/20 rounded-lg animate-pulse" />
            </div>
            <div className="flex-1 flex flex-col justify-between space-y-2 text-xs">
              <div>
                <span className="text-[9px] uppercase font-bold text-red-500 tracking-wider">SUBJECT FILE // ACCUSED</span>
                <h3 className="text-sm font-bold text-zinc-200 mt-1">Suspect #DODO-USER</h3>
              </div>
              <div className="bg-black/40 border border-zinc-900 p-2.5 rounded text-[10px] leading-relaxed text-zinc-400">
                <span className="font-extrabold text-red-400">CHARGE:</span> {randomCrime ? `"${randomCrime}"` : "Retrieving charge list..."}
              </div>
            </div>
          </div>

          {/* Interrogator Profile */}
          <div className="rounded-xl border border-zinc-900 bg-zinc-950/80 p-5 shadow-2xl relative overflow-hidden flex flex-col sm:flex-row gap-4 backdrop-blur-sm min-h-[170px]">
            <div className="relative flex size-24 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/30 overflow-hidden flex-shrink-0 self-center">
              <svg viewBox="0 0 100 100" className="size-16 fill-zinc-800"><path d="M15,55 Q50,48 85,55 C75,54 25,54 15,55 Z" /><path d="M30,52 L35,28 Q50,22 65,28 L70,52 Z" /><path d="M10,85 C15,70 30,65 50,65 C70,65 85,70 90,85 Z" /></svg>
              <div className="absolute top-[48%] left-[50%] flex gap-2 -translate-x-1/2 -translate-y-1/2">
                <span className="size-1 rounded-full bg-purple-500 shadow-[0_0_4px_#a855f7]" />
                <span className="size-1 rounded-full bg-purple-500 shadow-[0_0_4px_#a855f7]" />
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-between space-y-2 text-xs">
              <div>
                <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider">OFFICER ASSIGNED</span>
                <h3 className="text-sm font-bold text-zinc-200 mt-1">Det. Grimstone</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px] text-zinc-400">
                <div><span className="text-zinc-600 block">TEMPERAMENT:</span> <span className="text-red-400 font-bold">HOSTILE</span></div>
                <div><span className="text-zinc-600 block">IMPATIENCE:</span> <span className="text-amber-400 font-bold">100%</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Uplink Console logs & Action Button */}
        <div className="flex flex-col items-center gap-5 mt-4">
          <div className="w-full bg-zinc-950/70 border border-zinc-900 rounded-lg p-3 text-[10px] text-zinc-500 leading-relaxed font-mono min-h-[75px]">
            {terminalLog.map((log, i) => (
              <div key={i} className="flex gap-1.5">
                <span className="text-red-500">&gt;</span>
                <span>{log}{i === terminalLog.length - 1 && <span className="inline-block w-1.5 h-3 bg-red-500/80 ml-1 animate-pulse" />}</span>
              </div>
            ))}
          </div>

          <div className="relative">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-red-600 via-orange-500 to-red-600 opacity-60 blur-md" />
            <Button onClick={onStart} size="lg" className="relative h-14 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-10 text-base font-bold shadow-2xl flex items-center gap-2.5">
              <FolderOpen className="size-4.5" />
              <span>ESTABLISH SECURE DOSSIER LINK</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer controls & change API Key */}
      <div className="relative z-10 w-full max-w-5xl flex items-center justify-between border-t border-zinc-900 pt-3 text-[9px] text-zinc-600">
        <span>SECURITY PROTOCOL: GOOGLE_BIDI_SECURE</span>
        {hasKey && (
          <button onClick={onChangeKey} className="text-zinc-500 hover:text-red-400 font-bold uppercase underline underline-offset-4 cursor-pointer">
            Reset API Key
          </button>
        )}
      </div>
    </motion.div>
  );
}
