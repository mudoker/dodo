"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { RotateCcw, Skull, Trophy } from "lucide-react";
import { Counter } from "./counter";

export function ResultScreen({
  won,
  crime,
  score,
  elapsedTime,
  onRestart,
}: {
  won: boolean;
  crime: string;
  score: number;
  elapsedTime: number;
  onRestart: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-black/95" />

      {/* Background effects */}
      <motion.div
        className={cn(
          "absolute inset-0",
          won
            ? "bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.12),transparent_70%)]"
            : "bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.12),transparent_70%)]"
        )}
        animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Confetti particles for win */}
      {won && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {[
            { left: 10, color: '#10b981', delay: 0, xOffset: 20 },
            { left: 25, color: '#06b6d4', delay: 0.3, xOffset: -15 },
            { left: 40, color: '#fbbf24', delay: 0.6, xOffset: 30 },
            { left: 55, color: '#a855f7', delay: 0.1, xOffset: -20 },
            { left: 70, color: '#10b981', delay: 0.4, xOffset: 25 },
            { left: 85, color: '#06b6d4', delay: 0.7, xOffset: -30 },
          ].map((particle, i) => (
            <motion.div
              key={i}
              className="absolute size-2 rounded-full"
              style={{ left: `${particle.left}%`, backgroundColor: particle.color }}
              initial={{ top: "-5%", rotate: 0 }}
              animate={{ top: "105%", rotate: 360, x: [0, particle.xOffset, -particle.xOffset] }}
              transition={{ duration: 4, repeat: Infinity, delay: particle.delay, ease: "linear" }}
            />
          ))}
        </div>
      )}

      {/* Jail bars for lose */}
      {!won && (
        <motion.div
          className="pointer-events-none absolute inset-0 flex justify-around"
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, type: "spring", damping: 15 }}
        >
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-full w-2.5 bg-gradient-to-b from-zinc-800 via-zinc-700 to-zinc-800 opacity-20 shadow-[0_0_10px_rgba(0,0,0,0.8)]"
            />
          ))}
        </motion.div>
      )}

      <motion.div
        initial={{ scale: 0.9, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 15, delay: 0.1 }}
        className="relative mx-6 w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-800/80 bg-gradient-to-b from-zinc-900/90 to-black/95 p-8 text-center shadow-2xl backdrop-blur-xl"
      >
        {/* Glow indicator */}
        <motion.div
          className={cn(
            "absolute inset-0 opacity-20",
            won ? "bg-gradient-to-br from-emerald-500/20 via-transparent to-cyan-500/20" : "bg-gradient-to-br from-red-500/20 via-transparent to-orange-500/20"
          )}
          animate={{ opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />

        {/* Status icon badge */}
        <div className="relative mx-auto mb-6 flex items-center justify-center">
          <motion.div
            className={cn("absolute size-24 rounded-full", won ? "bg-emerald-500/10" : "bg-red-500/10")}
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 12, delay: 0.2 }}
            className={cn(
              "relative flex size-24 items-center justify-center rounded-full shadow-2xl",
              won ? "bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-emerald-500/30" : "bg-gradient-to-br from-red-500 to-orange-500 shadow-red-500/30"
            )}
          >
            {won ? <Trophy className="size-11 text-white drop-shadow-md" /> : <Skull className="size-11 text-white drop-shadow-md" />}
          </motion.div>
        </div>

        {/* Title */}
        <h2 className={cn("mb-2 text-4xl font-black tracking-tight uppercase", won ? "text-emerald-400 drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]" : "text-red-400 drop-shadow-[0_0_20px_rgba(239,68,68,0.3)]")}>
          {won ? "Case Dismissed!" : "Defeated: Guilty!"}
        </h2>

        <p className="mb-6 text-sm text-zinc-400">
          {won ? "Detective Grimstone reluctantly admitted he has the wrong suspect." : "Status failed. Grimstone forced a guilty verdict for:"}
        </p>

        {/* Case Info Panel */}
        <div className={cn("mb-6 rounded-xl border p-4 backdrop-blur text-left space-y-1.5", won ? "border-emerald-500/20 bg-emerald-950/10" : "border-red-500/20 bg-red-950/10")}>
          <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">The Accusation</span>
          <p className="text-sm font-semibold text-zinc-300">"{crime}"</p>
        </div>

        {/* Stats breakdown */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-zinc-950/50 border border-zinc-800/50 p-3.5 rounded-xl">
            <span className="block text-[10px] text-zinc-500 uppercase tracking-widest font-semibold mb-1">Final Score</span>
            <span className="text-xl font-bold text-cyan-400">
              <Counter value={score} />
            </span>
          </div>
          <div className="bg-zinc-950/50 border border-zinc-800/50 p-3.5 rounded-xl">
            <span className="block text-[10px] text-zinc-500 uppercase tracking-widest font-semibold mb-1">Interrogation Time</span>
            <span className="text-xl font-bold text-zinc-300">{Math.floor(elapsedTime / 60)}m {elapsedTime % 60}s</span>
          </div>
        </div>

        {/* Controls */}
        <div className="relative">
          <motion.div
            className={cn("absolute -inset-1 rounded-xl blur-md opacity-40", won ? "bg-emerald-500" : "bg-red-500")}
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <Button
            onClick={onRestart}
            size="lg"
            className={cn(
              "relative w-full h-14 gap-3 px-8 text-base font-bold shadow-xl transition-transform hover:scale-[1.02]",
              won ? "bg-emerald-600 hover:bg-emerald-500 text-white" : "bg-red-600 hover:bg-red-500 text-white"
            )}
          >
            <RotateCcw className="size-4" />
            {won ? "Play Interrogation Again" : "Try Interrogation Again"}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
