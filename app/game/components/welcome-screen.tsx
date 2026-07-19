"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { AlertTriangle, Gauge, MessageSquare, Mic, Trophy } from "lucide-react";
import { useEffect, useState } from "react";

const PARTICLE_POSITIONS = [
  { left: 5, top: 10 }, { left: 15, top: 80 }, { left: 25, top: 30 },
  { left: 35, top: 60 }, { left: 45, top: 20 }, { left: 55, top: 90 },
  { left: 65, top: 40 }, { left: 75, top: 70 }, { left: 85, top: 15 },
  { left: 95, top: 50 }, { left: 10, top: 45 }, { left: 30, top: 85 },
];

export function WelcomeScreen({ onStart }: { onStart: () => void }) {
  const [terminalLog, setTerminalLog] = useState<string[]>([]);
  
  // Typing simulation on mount
  useEffect(() => {
    const logs = [
      "⚡ SYSTEM UPLINK SECURED...",
      "🔍 SCANNING FOR TARGET: SUSPECT #DODO-USER",
      "🚨 ALLEGATION: CHAOTIC WORKPLACE CRIME",
      "👮 INTERROGATOR ASSIGNED: DETECTIVE GRIMSTONE",
      "🎙️ AUDIO INPUT MODULE: ACTIVE & ENCRYPTED",
      "🎯 ACCUSER IMPATIENCE THRESHOLD: 100%"
    ];
    
    let index = 0;
    const interval = setInterval(() => {
      if (index < logs.length) {
        setTerminalLog((prev) => [...prev, logs[index]]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 400);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 bg-black text-white"
    >
      {/* Background Orbs & Grid */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-black to-zinc-950" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-15" />
        <motion.div
          className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(220, 38, 38, 0.06) 0%, transparent 70%)", filter: "blur(50px)" }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Floating particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {PARTICLE_POSITIONS.map((pos, i) => (
          <motion.div
            key={i}
            className="absolute size-1 rounded-full bg-gradient-to-r from-red-500/30 to-violet-500/20"
            style={{ left: `${pos.left}%`, top: `${pos.top}%` }}
            animate={{ y: [0, -50, 0], opacity: [0.1, 0.5, 0.1] }}
            transition={{ duration: 6 + (i % 4), repeat: Infinity, delay: i * 0.5 }}
          />
        ))}
      </div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="relative z-10 flex max-w-xl flex-col items-center text-center"
      >
        {/* Logo Card */}
        <motion.div
          className="mb-8 flex items-center gap-6"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 12, delay: 0.3 }}
        >
          <div className="relative">
            <motion.div
              className="absolute -inset-6 rounded-full bg-red-500/10 blur-md"
              animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <AlertTriangle className="relative size-14 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.4)]" />
          </div>
          <div className="flex flex-col items-start">
            <h1 className="font-mono text-6xl font-black tracking-tighter text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.08)]">
              DoDo
            </h1>
            <div className="h-0.5 w-full bg-gradient-to-r from-red-500 via-orange-500 to-transparent rounded-full" />
          </div>
        </motion.div>

        {/* Tagline */}
        <div className="mb-6 flex items-center gap-2">
          <span className="text-lg font-medium text-zinc-400">Cyber Interrogation Simulator</span>
          <motion.span className="inline-block h-4 w-0.5 bg-red-500" animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }} />
        </div>

        {/* Retro Terminal Console Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full bg-zinc-950/90 border border-zinc-900 rounded-xl p-4 mb-8 text-left font-mono text-[10px] text-red-500/80 leading-relaxed shadow-2xl relative overflow-hidden min-h-[140px]"
        >
          {/* Laser Scanner Line animation */}
          <motion.div 
            className="absolute inset-x-0 h-[1.5px] bg-red-500/40 shadow-[0_0_8px_#ef4444] z-20 pointer-events-none"
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-0 bg-red-950/5 pointer-events-none z-10" />

          {terminalLog.map((log, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-red-500 font-bold">&gt;</span>
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.1 }}>{log}</motion.span>
            </div>
          ))}
          {terminalLog.length < 6 && (
            <div className="flex gap-2 animate-pulse">
              <span className="text-red-500 font-bold">&gt;</span>
              <span className="w-2 h-3.5 bg-red-500/70" />
            </div>
          )}
        </motion.div>

        {/* Start Action */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="relative mb-10"
        >
          <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-red-600 via-orange-500 to-red-600 opacity-50 blur-md" />
          <Button
            onClick={onStart}
            size="lg"
            className="relative h-14 gap-3 bg-gradient-to-r from-red-600 to-red-700 px-8 text-base font-bold shadow-2xl transition-all hover:from-red-500 hover:to-red-600 text-white"
          >
            <Mic className="size-4 animate-pulse" />
            <span>Enter Interrogation Chamber</span>
          </Button>
        </motion.div>

        {/* Quick Instructions grid */}
        <div className="grid grid-cols-3 gap-4 w-full">
          {[
            { icon: MessageSquare, label: "Mic & Keyboard", desc: "Defend by voice or typing", color: "from-blue-500/10 to-violet-600/5" },
            { icon: Gauge, label: "Suspicion Gauge", desc: "Keep suspicion below 100%", color: "from-red-500/10 to-orange-600/5" },
            { icon: Trophy, label: "Clear Your Name", desc: "Outsmart the toxic detective", color: "from-emerald-500/10 to-green-600/5" },
          ].map(({ icon: Icon, label, desc, color }, index) => (
            <motion.div
              key={label}
              className="group flex flex-col items-center gap-2 p-3.5 rounded-xl border border-zinc-900 bg-zinc-950/20 backdrop-blur-sm"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1, type: "spring", stiffness: 120, damping: 15 }}
              whileHover={{ y: -3, scale: 1.01, borderColor: "rgba(255,255,255,0.06)" }}
            >
              <div className={cn("relative flex size-10 items-center justify-center rounded-lg border border-zinc-800 bg-gradient-to-br", color)}>
                <Icon className="size-5 text-zinc-400 group-hover:text-white transition-colors" />
              </div>
              <p className="text-[10px] font-bold text-zinc-300">{label}</p>
              <p className="text-[9px] text-zinc-500 text-center leading-normal">{desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
