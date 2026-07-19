"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

const BLOB_PARTICLES = [
  { left: 35, top: 30 }, { left: 60, top: 35 }, { left: 45, top: 65 },
  { left: 70, top: 55 }, { left: 30, top: 50 }, { left: 55, top: 40 },
  { left: 40, top: 70 }, { left: 65, top: 45 },
];

export function FloatingBlob({
  isActive,
  volume,
  isSpeaking,
}: {
  isActive: boolean;
  volume: number;
  isSpeaking: boolean;
}) {
  const amplitude = useMotionValue(0);
  const amplitudeSpring = useSpring(amplitude, { stiffness: 180, damping: 25, mass: 0.5 });

  const blobScale = useTransform(amplitudeSpring, (v) => 0.85 + v * 0.5);
  const blobRotate = useTransform(amplitudeSpring, (v) => -15 + v * 40);
  const innerGlow = useTransform(amplitudeSpring, (v) => Math.min(0.95, 0.4 + v * 0.6));
  const outerScale = useTransform(amplitudeSpring, (v) => 1.2 + v * 0.6);
  const outerOpacity = useTransform(amplitudeSpring, (v) => Math.min(0.7, 0.25 + v * 0.5));
  const ringScale = useTransform(amplitudeSpring, (v) => 1 + v * 0.3);

  const huePrimary = useTransform(amplitudeSpring, (v) => 280 + v * 40);
  const hueSecondary = useTransform(amplitudeSpring, (v) => 180 + v * 30);
  const hueTertiary = useTransform(amplitudeSpring, (v) => 320 + v * 30);

  const blobGradient = useMotionTemplate`radial-gradient(circle at 30% 25%, hsl(${huePrimary} 70% 70% / 0.8), transparent 55%), radial-gradient(circle at 70% 30%, hsl(${hueSecondary} 65% 65% / 0.7), transparent 50%), radial-gradient(circle at 50% 75%, hsl(${hueTertiary} 60% 65% / 0.65), transparent 55%)`;
  const coreGradient = useMotionTemplate`radial-gradient(circle at 50% 50%, hsl(${hueSecondary} 80% 85% / 0.5), transparent 55%)`;

  useEffect(() => {
    const baseLevel = isActive ? 0.3 : 0.15;
    const speakingBoost = isSpeaking ? 0.35 : 0;
    const volumeBoost = volume * 5;
    amplitude.set(Math.min(1.2, baseLevel + speakingBoost + volumeBoost));
  }, [isActive, volume, isSpeaking, amplitude]);

  return (
    <div className="relative flex items-center justify-center">
      {/* Outermost ring */}
      <motion.div
        className="absolute aspect-square w-[380px] rounded-full border border-violet-400/15"
        style={{ scale: ringScale, filter: "blur(2px)" }}
        animate={{ rotate: [0, 360], opacity: [0.2, 0.4, 0.2] }}
        transition={{
          rotate: { duration: 40, repeat: Infinity, ease: "linear" },
          opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      {/* Outer atmospheric glow - neon pastel */}
      <motion.div
        className="absolute aspect-square w-[450px] rounded-full"
        style={{
          scale: outerScale,
          opacity: outerOpacity,
          background: "radial-gradient(circle, rgba(167, 139, 250, 0.25) 0%, rgba(96, 165, 250, 0.2) 30%, rgba(244, 114, 182, 0.15) 50%, transparent 80%)",
          filter: "blur(40px)",
        }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />

      {/* Secondary glow ring */}
      <motion.div
        className="absolute aspect-square w-[320px] rounded-full"
        style={{ opacity: innerGlow, filter: "blur(30px)" }}
        animate={{ scale: [1, 1.1, 1], rotate: [0, -180, -360] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500/30 via-cyan-400/25 to-pink-500/20" />
      </motion.div>

      {/* Pulsing rings when speaking */}
      {isSpeaking && (
        <>
          <motion.div
            className="absolute aspect-square w-[240px] rounded-full border-2 border-cyan-400/20"
            style={{ filter: "blur(2px)" }}
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute aspect-square w-[240px] rounded-full border-2 border-violet-400/20"
            style={{ filter: "blur(2px)" }}
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
          />
        </>
      )}

      {/* Main blob */}
      <motion.div
        className="relative aspect-square w-[220px]"
        style={{ scale: blobScale, rotate: blobRotate }}
        animate={{
          borderRadius: [
            "42% 58% 55% 45%",
            "55% 45% 48% 52%",
            "48% 52% 58% 42%",
            "52% 48% 45% 55%",
            "42% 58% 55% 45%",
          ],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div className="absolute inset-0 rounded-[inherit]" style={{ background: blobGradient, filter: "blur(20px)" }} />
        <motion.div className="absolute inset-[5%] rounded-[inherit]" style={{ background: "radial-gradient(circle at 40% 35%, rgba(129, 230, 217, 0.75) 0%, rgba(167, 139, 250, 0.65) 45%, rgba(244, 114, 182, 0.55) 100%)", filter: "blur(15px)" }} />
        <motion.div className="absolute inset-[15%] rounded-[inherit]" style={{ background: coreGradient, filter: "blur(15px)" }} />
        <motion.div className="absolute inset-0 rounded-[inherit]" style={{ background: "radial-gradient(ellipse at 35% 25%, rgba(255,255,255,0.35) 0%, transparent 50%)", filter: "blur(10px)" }} />
      </motion.div>

      {/* Particle effects */}
      <div className="pointer-events-none absolute inset-0">
        {BLOB_PARTICLES.map((pos, i) => (
          <motion.div
            key={`blob-p-${i}`}
            className="absolute h-2 w-2 rounded-full"
            style={{
              left: `${pos.left}%`,
              top: `${pos.top}%`,
              background: i % 3 === 0 ? "rgba(129, 230, 217, 0.6)" : i % 3 === 1 ? "rgba(167, 139, 250, 0.6)" : "rgba(244, 114, 182, 0.6)",
              boxShadow: i % 3 === 0 ? "0 0 10px rgba(129, 230, 217, 0.4)" : i % 3 === 1 ? "0 0 10px rgba(167, 139, 250, 0.4)" : "0 0 10px rgba(244, 114, 182, 0.4)",
              filter: "blur(2px)",
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [0.7, 1.3, 0.7],
              x: [0, (i % 2 === 0 ? 15 : -15), 0],
              y: [0, (i % 2 === 0 ? -10 : 10), 0],
            }}
            transition={{
              duration: 3 + (i * 0.3),
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}
