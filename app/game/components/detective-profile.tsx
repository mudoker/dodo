"use client";

import { motion } from "framer-motion";

export function DetectiveProfile({ mood, suspicion, isSpeaking, connected }: { mood: string; suspicion: number; isSpeaking: boolean; connected: boolean }) {
  const eyeColor = suspicion >= 85 ? "#ef4444" : suspicion >= 65 ? "#f97316" : suspicion >= 45 ? "#fbbf24" : "#a855f7";

  return (
    <div className="relative w-full aspect-video rounded-xl bg-zinc-950/80 border border-zinc-900 overflow-hidden flex flex-col items-center justify-center shadow-inner">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] pointer-events-none z-10 opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-t from-red-950/10 via-transparent to-violet-950/10 pointer-events-none" />
      
      <motion.div
        animate={isSpeaking && connected ? "speaking" : "idle"}
        variants={{
          speaking: {
            y: [0, -1, 1, 0],
            scale: [1, 1.02, 0.98, 1],
            transition: { duration: 0.4, repeat: Infinity }
          },
          idle: {
            y: 0,
            scale: 1,
            transition: { duration: 0.25 }
          }
        }}
        className="w-24 h-24 relative flex items-center justify-center text-zinc-800"
      >
        <svg viewBox="0 0 100 100" className="size-full fill-zinc-800 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
          <path d="M15,55 Q50,48 85,55 C75,54 25,54 15,55 Z" className="fill-zinc-700" />
          <path d="M30,52 L35,28 Q50,22 65,28 L70,52 Z" className="fill-zinc-800" />
          <path d="M30,52 L31,48 Q50,44 69,48 L70,52 Z" className="fill-red-900/80" />
          <path d="M10,85 C15,70 30,65 50,65 C70,65 85,70 90,85 Z" className="fill-zinc-900" />
        </svg>

        <div className="absolute top-[48%] left-[50%] flex gap-3 -translate-x-1/2 -translate-y-1/2">
          <motion.div
            animate={{ scaleY: [1, 0.1, 1] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2.5 }}
            className="size-1 rounded-full"
            style={{
              backgroundColor: eyeColor,
              boxShadow: `0 0 8px ${eyeColor}, 0 0 3px ${eyeColor}`,
            }}
          />
          <motion.div
            animate={{ scaleY: [1, 0.1, 1] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2.5 }}
            className="size-1 rounded-full"
            style={{
              backgroundColor: eyeColor,
              boxShadow: `0 0 8px ${eyeColor}, 0 0 3px ${eyeColor}`,
            }}
          />
        </div>
      </motion.div>

      {isSpeaking && connected && (
        <div className="absolute inset-x-0 bottom-3.5 flex items-center justify-center gap-1 z-20">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ height: [3, 10, 3] }}
              transition={{ duration: 0.25 + i * 0.05, repeat: Infinity, ease: "easeInOut" }}
              className="w-0.5 rounded-full bg-violet-400 shadow-[0_0_4px_rgba(168,85,247,0.4)]"
            />
          ))}
        </div>
      )}

      <div className="absolute top-2.5 left-3 flex items-center gap-1.5 z-20">
        <span className={`size-1.5 rounded-full ${connected ? "bg-red-650 animate-ping" : "bg-zinc-700"}`} />
        <span className={`text-[8px] uppercase tracking-wider font-extrabold ${connected ? "text-red-500" : "text-zinc-600"}`}>
          {connected ? "REC FEED" : "FEED OFFLINE"}
        </span>
      </div>

      <div className="absolute top-2.5 right-3 z-20">
        <span className="text-[8px] uppercase tracking-wider text-zinc-650 font-mono">CAM_01_GRIM</span>
      </div>

      <div className="absolute bottom-2.5 left-3 z-20">
        <span className="text-[8px] uppercase tracking-widest text-zinc-400 font-extrabold">STATUS: {mood}</span>
      </div>
    </div>
  );
}
