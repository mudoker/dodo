"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function EqualizerWaveform({ isSpeaking, isActive }: { isSpeaking: boolean; isActive: boolean }) {
  const bars = [...Array(10)];
  return (
    <div className="flex items-end gap-1.5 h-10 px-2 justify-center w-full">
      {bars.map((_, i) => {
        const heightMin = 8;
        const heightMax = isSpeaking ? 34 : isActive ? 16 : 8;
        const duration = 0.5 + (i % 3) * 0.15;
        
        return (
          <motion.div
            key={i}
            className={cn(
              "w-1.5 rounded-full bg-gradient-to-t",
              isSpeaking
                ? "from-violet-600 to-pink-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                : isActive
                  ? "from-cyan-500 to-emerald-400 shadow-[0_0_8px_rgba(6,182,212,0.5)]"
                  : "from-zinc-800 to-zinc-700"
            )}
            initial={{ height: heightMin }}
            animate={{
              height: [heightMin, heightMax, heightMin],
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.05,
            }}
          />
        );
      })}
    </div>
  );
}
