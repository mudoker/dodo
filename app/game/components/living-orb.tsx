"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";

type OrbState = "offline" | "connecting" | "listening" | "talking" | "muted" | "error";

interface LivingOrbProps {
  state: OrbState;
  volume: number;
  suspicion: number;
}

interface OrbParticle {
  angle: number;
  distance: number;
  size: number;
  speed: number;
  phase: number;
  hue: number;
}

const TWO_PI = Math.PI * 2;

function getStateAccent(state: OrbState, suspicion: number) {
  if (state === "error") {
    return {
      core: "rgba(248, 113, 113, 0.9)",
      secondary: "rgba(251, 146, 60, 0.8)",
      aura: "rgba(239, 68, 68, 0.42)",
      ring: "rgba(248, 113, 113, 0.45)",
      label: "text-red-400",
    };
  }

  if (suspicion >= 80) {
    return {
      core: "rgba(255, 105, 48, 0.96)",
      secondary: "rgba(239, 68, 68, 0.9)",
      aura: "rgba(239, 68, 68, 0.52)",
      ring: "rgba(251, 113, 133, 0.58)",
      label: "text-amber-300",
    };
  }

  if (suspicion >= 50) {
    return {
      core: "rgba(45, 212, 191, 0.9)",
      secondary: "rgba(217, 70, 239, 0.78)",
      aura: "rgba(20, 184, 166, 0.38)",
      ring: "rgba(45, 212, 191, 0.38)",
      label: "text-cyan-300",
    };
  }

  return {
    core: "rgba(125, 211, 252, 0.92)",
    secondary: "rgba(168, 85, 247, 0.78)",
    aura: "rgba(56, 189, 248, 0.36)",
    ring: "rgba(125, 211, 252, 0.38)",
    label: "text-sky-300",
  };
}

function drawOrb(
  context: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  particles: OrbParticle[],
  state: OrbState,
  volume: number,
  suspicion: number,
  time: number,
) {
  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  const unit = Math.min(width, height) / 640;
  const accent = getStateAccent(state, suspicion);
  const isTalking = state === "talking";
  const isListening = state === "listening";
  const isError = state === "error";
  const hostility = Math.min(1, Math.max(0, suspicion / 100));
  const energy = Math.min(0.32, Math.max(0, volume * 1.4 + (isTalking ? 0.08 : 0)));
  const agitation = 1 + hostility * 0.24;
  const breathe = isListening ? 0 : Math.sin(time * (1.15 + hostility * 0.32)) * (0.012 + hostility * 0.005);
  const baseRadius = 136 * unit * (1 + breathe + energy * 0.02 + hostility * 0.01);

  context.clearRect(0, 0, width, height);
  context.globalCompositeOperation = "source-over";

  const floorGradient = context.createRadialGradient(centerX, centerY + 132 * unit, 10 * unit, centerX, centerY + 136 * unit, 164 * unit);
  floorGradient.addColorStop(0, accent.aura);
  floorGradient.addColorStop(0.34, "rgba(88, 28, 135, 0.18)");
  floorGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  context.fillStyle = floorGradient;
  context.beginPath();
  context.ellipse(centerX, centerY + 140 * unit, 156 * unit, 30 * unit, 0, 0, TWO_PI);
  context.fill();

  const outerGlow = context.createRadialGradient(centerX, centerY, baseRadius * 0.35, centerX, centerY, baseRadius * 2.2);
  outerGlow.addColorStop(0, accent.aura);
  outerGlow.addColorStop(0.34, hostility > 0.78 ? "rgba(249, 115, 22, 0.2)" : "rgba(147, 51, 234, 0.16)");
  outerGlow.addColorStop(0.68, hostility > 0.78 ? "rgba(239, 68, 68, 0.1)" : "rgba(34, 211, 238, 0.06)");
  outerGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
  context.fillStyle = outerGlow;
  context.beginPath();
  context.arc(centerX, centerY, baseRadius * 2.25, 0, TWO_PI);
  context.fill();

  context.save();
  context.translate(centerX, centerY);
  context.rotate(time * (isTalking ? 0.28 + hostility * 0.12 : 0.1 + hostility * 0.07));
  for (let ring = 0; ring < 3; ring += 1) {
    const ringRadiusX = (188 + ring * 20 + energy * 6) * unit;
    const ringRadiusY = (46 + ring * 8) * unit;
    context.strokeStyle = ring === 0 ? accent.ring : `rgba(${ring === 1 ? "217, 70, 239" : "251, 191, 36"}, ${0.18 - ring * 0.035})`;
    context.lineWidth = (1.2 - ring * 0.2) * unit;
    context.setLineDash(ring === 1 ? [5 * unit, 10 * unit] : []);
    context.beginPath();
    context.ellipse(0, 0, ringRadiusX, ringRadiusY, -0.48 + ring * 0.72, 0, TWO_PI);
    context.stroke();
  }
  context.restore();
  context.setLineDash([]);

  context.save();
  context.translate(centerX, centerY);
  context.beginPath();
  const points = 180;
  for (let i = 0; i <= points; i += 1) {
    const angle = (i / points) * TWO_PI;
    const lowWave = Math.sin(angle * 3 + time * 1.05 * agitation) * (4 + hostility * 2.2) * unit;
    const midWave = Math.sin(angle * 7 - time * 1.55 * agitation) * (2.4 + hostility * 1.8) * unit;
    const hostilitySpike = Math.max(0, Math.sin(angle * 12 + time * 2.2 * agitation)) * hostility * 2.4 * unit;
    const sharpWave = isTalking ? Math.max(0, Math.sin(angle * 10 + time * 2.4 * agitation)) * energy * 2.2 * unit : 0;
    const errorDent = isError ? Math.sin(angle * 10 + time * 6) * 7 * unit : 0;
    const radius = baseRadius + lowWave + midWave + hostilitySpike + sharpWave + errorDent;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  }
  context.closePath();
  context.clip();

  const coreDriftX = Math.sin(time * 0.34 * agitation) * (30 + hostility * 14) * unit + Math.sin(time * 0.7 * agitation) * (10 + hostility * 5) * unit;
  const coreDriftY = Math.cos(time * 0.3 * agitation) * (24 + hostility * 11) * unit + Math.sin(time * 0.58 * agitation) * (8 + hostility * 5) * unit;
  const coreGradient = context.createRadialGradient(coreDriftX - 42 * unit, coreDriftY - 52 * unit, 8 * unit, coreDriftX, coreDriftY, baseRadius * 1.12);
  coreGradient.addColorStop(0, "rgba(255, 255, 255, 0.95)");
  coreGradient.addColorStop(0.16, isListening ? "rgba(219, 234, 254, 0.92)" : accent.core);
  coreGradient.addColorStop(0.44, accent.secondary);
  coreGradient.addColorStop(0.72, "rgba(21, 8, 42, 0.92)");
  coreGradient.addColorStop(1, "rgba(2, 6, 23, 0.98)");
  context.fillStyle = coreGradient;
  context.fillRect(-baseRadius * 1.4, -baseRadius * 1.4, baseRadius * 2.8, baseRadius * 2.8);

  context.globalCompositeOperation = "screen";
  for (let i = 0; i < 26; i += 1) {
    const angle = i * 1.618 + time * (0.55 + (i % 4) * 0.08);
    const distance = (12 + ((i * 29) % 70)) * unit;
    const blobRadius = (12 + ((i * 11) % 32) + energy * 5) * unit;
    const x = Math.cos(angle) * distance * 0.72;
    const y = Math.sin(angle * 0.86) * distance * 0.7;
    const blob = context.createRadialGradient(x, y, 0, x, y, blobRadius);
    blob.addColorStop(0, i % 3 === 0 ? accent.core : i % 3 === 1 ? (hostility > 0.78 ? "rgba(251, 146, 60, 0.6)" : "rgba(34, 211, 238, 0.55)") : "rgba(236, 72, 153, 0.52)");
    blob.addColorStop(1, "rgba(0, 0, 0, 0)");
    context.fillStyle = blob;
    context.beginPath();
    context.arc(x, y, blobRadius, 0, TWO_PI);
    context.fill();
  }

  context.globalCompositeOperation = "overlay";
  context.strokeStyle = "rgba(255, 255, 255, 0.09)";
  context.lineWidth = 1.1 * unit;
  for (let band = -4; band <= 4; band += 1) {
    context.beginPath();
    context.ellipse(0, band * 18 * unit, baseRadius * (0.85 - Math.abs(band) * 0.035), 11 * unit, Math.sin(time + band) * 0.45, 0, TWO_PI);
    context.stroke();
  }

  context.globalCompositeOperation = "screen";
  const pearlX = Math.sin(time * 0.58 * agitation) * (34 + hostility * 12) * unit + Math.sin(time * 0.98 * agitation) * (10 + hostility * 5) * unit;
  const pearlY = Math.cos(time * 0.46 * agitation) * (28 + hostility * 10) * unit + Math.sin(time * 0.82 * agitation) * (8 + hostility * 4) * unit;
  const pearlRadius = (44 + energy * 3 + hostility * 3) * unit;
  const centeredPearl = context.createRadialGradient(pearlX, pearlY, 0, pearlX, pearlY, pearlRadius);
  centeredPearl.addColorStop(0, "rgba(255, 246, 225, 0.84)");
  centeredPearl.addColorStop(0.22, hostility > 0.78 ? "rgba(251, 146, 60, 0.6)" : "rgba(45, 212, 191, 0.52)");
  centeredPearl.addColorStop(0.48, hostility > 0.78 ? "rgba(239, 68, 68, 0.38)" : "rgba(217, 70, 239, 0.34)");
  centeredPearl.addColorStop(0.7, hostility > 0.78 ? "rgba(250, 204, 21, 0.24)" : "rgba(251, 191, 36, 0.2)");
  centeredPearl.addColorStop(1, "rgba(0, 0, 0, 0)");
  context.fillStyle = centeredPearl;
  context.beginPath();
  context.arc(pearlX, pearlY, pearlRadius, 0, TWO_PI);
  context.fill();

  const pearlHotspot = context.createRadialGradient(pearlX - 10 * unit, pearlY - 9 * unit, 0, pearlX - 10 * unit, pearlY - 9 * unit, 20 * unit);
  pearlHotspot.addColorStop(0, "rgba(255, 255, 255, 0.88)");
  pearlHotspot.addColorStop(0.52, "rgba(125, 211, 252, 0.48)");
  pearlHotspot.addColorStop(1, "rgba(0, 0, 0, 0)");
  context.fillStyle = pearlHotspot;
  context.beginPath();
  context.arc(pearlX - 10 * unit, pearlY - 9 * unit, 20 * unit, 0, TWO_PI);
  context.fill();

  const highlight = context.createRadialGradient(-45 * unit, -58 * unit, 0, -45 * unit, -58 * unit, 72 * unit);
  highlight.addColorStop(0, "rgba(255, 255, 255, 0.78)");
  highlight.addColorStop(0.48, "rgba(186, 230, 253, 0.22)");
  highlight.addColorStop(1, "rgba(255, 255, 255, 0)");
  context.fillStyle = highlight;
  context.beginPath();
  context.ellipse(-45 * unit, -58 * unit, 55 * unit, 28 * unit, -0.72, 0, TWO_PI);
  context.fill();

  context.restore();

  const rim = context.createRadialGradient(centerX, centerY, baseRadius * 0.68, centerX, centerY, baseRadius * 1.14);
  rim.addColorStop(0, "rgba(0, 0, 0, 0)");
  rim.addColorStop(0.76, "rgba(255, 255, 255, 0.08)");
  rim.addColorStop(0.9, accent.ring);
  rim.addColorStop(1, "rgba(0, 0, 0, 0)");
  context.globalCompositeOperation = "screen";
  context.fillStyle = rim;
  context.beginPath();
  context.arc(centerX, centerY, baseRadius * 1.15, 0, TWO_PI);
  context.fill();

  for (const particle of particles) {
    const orbit = particle.angle + time * particle.speed * agitation * 0.85;
    const wobble = Math.sin(time * 0.65 * agitation + particle.phase) * (12 + hostility * 4) * unit;
    const x = centerX + Math.cos(orbit) * (particle.distance * unit + wobble);
    const y = centerY + Math.sin(orbit * 0.82) * (particle.distance * 0.48 * unit + wobble * 0.2);
    const alpha = 0.32 + Math.sin(time * 1.4 + particle.phase) * 0.18 + energy * 0.08;
    context.fillStyle = `hsla(${particle.hue}, 95%, 70%, ${alpha})`;
    context.shadowColor = `hsla(${particle.hue}, 95%, 70%, 0.8)`;
    context.shadowBlur = 14 * unit;
    context.beginPath();
    context.arc(x, y, particle.size * unit * (1 + energy * 0.35), 0, TWO_PI);
    context.fill();
  }
  context.shadowBlur = 0;
  context.globalCompositeOperation = "source-over";
}

export function LivingOrb({ state, volume, suspicion }: LivingOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef(state);
  const volumeRef = useRef(volume);
  const smoothedVolumeRef = useRef(0);
  const suspicionRef = useRef(suspicion);
  const particles = useMemo<OrbParticle[]>(
    () =>
      Array.from({ length: 34 }, (_, index) => ({
        angle: (index / 34) * TWO_PI,
        distance: 150 + ((index * 47) % 74),
        size: 1.2 + ((index * 13) % 24) / 10,
        speed: 0.1 + ((index * 7) % 20) / 100,
        phase: index * 0.73,
        hue: index % 3 === 0 ? 188 : index % 3 === 1 ? 294 : 42,
      })),
    [],
  );

  useEffect(() => {
    stateRef.current = state;
    volumeRef.current = volume;
    suspicionRef.current = suspicion;
  }, [state, volume, suspicion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    let animationFrame = 0;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    };

    const render = (now: number) => {
      const targetVolume = Math.min(0.08, Math.max(0, volumeRef.current));
      smoothedVolumeRef.current += (targetVolume - smoothedVolumeRef.current) * 0.025;
      drawOrb(context, canvas, particles, stateRef.current, smoothedVolumeRef.current, suspicionRef.current, now / 1000);
      animationFrame = requestAnimationFrame(render);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    animationFrame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
    };
  }, [particles]);

  const accent = getStateAccent(state, suspicion);
  const isTalking = state === "talking";
  const isListening = state === "listening";
  const isError = state === "error";

  return (
    <div className="relative flex aspect-square w-[min(72vw,50vh,26rem)] min-w-64 items-center justify-center">
      <motion.div
        className="absolute inset-[9%] rounded-full blur-3xl"
        animate={{
          opacity: isError ? [0.22, 0.48, 0.22] : isListening ? 0.46 : [0.3, 0.48, 0.3],
          scale: isTalking ? [1, 1.025, 1] : [1, 1.018, 1],
        }}
        transition={{ duration: isTalking ? 1.15 : 4.4, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: `radial-gradient(circle, ${accent.aura}, rgba(168,85,247,0.18) 44%, transparent 72%)`,
        }}
      />
      <motion.div
        className={cn(
          "absolute inset-[20%] rounded-full border mix-blend-screen",
          isListening ? "border-sky-200/45" : "border-white/15",
        )}
        animate={{ rotate: isTalking ? [0, 4, -3, 0] : 360, scale: isTalking ? [1, 1.025, 1] : 1 }}
        transition={{ duration: isTalking ? 1.4 : 22, repeat: Infinity, ease: isTalking ? "easeInOut" : "linear" }}
        style={{ boxShadow: `0 0 70px ${accent.aura}, inset 0 0 38px ${accent.aura}` }}
      />
      <canvas
        ref={canvasRef}
        aria-label="Living voice orb"
        className="relative z-10 size-full"
      />
    </div>
  );
}
