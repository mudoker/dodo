"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, Flag, Headphones, Mic, MicOff, PhoneOff, RefreshCw, ShieldAlert, Wifi } from "lucide-react";
import { LivingOrb } from "./living-orb";
import { useInterrogationClient } from "../hooks/use-interrogation-client";

interface GameScreenProps {
  crime: string; elapsedTime: number; suspicion: number; timerStarted: boolean; onChangeKey: () => void;
  onWin: () => void; onLose: () => void; onTimerStart: () => void; onGoodArgument: () => void; onIncreaseImpatience: (amount: number) => void;
}

export function GameScreen({
  crime, elapsedTime, suspicion, onWin, onLose, onTimerStart, onGoodArgument, onIncreaseImpatience, timerStarted, onChangeKey
}: GameScreenProps) {
  const {
    connected, isAiSpeaking, connectionError, isConnecting,
    volume, inputVolume, lastInputAt, micArmed, isAwaitingResponse, muted, setMuted, disconnect, connect, triggerRetry,
    audioInputDevices, audioOutputDevices, selectedInputDeviceId, setSelectedInputDeviceId,
    selectedOutputDeviceId, setSelectedOutputDeviceId, outputDeviceSupported
  } = useInterrogationClient({
    crime, timerStarted, onTimerStart, onGoodArgument, onIncreaseImpatience, onWin, onLose
  });

  const getStatusText = () => {
    if (connectionError) return "TRANSMISSION INTERRUPTED";
    if (isConnecting) return "SYNCHRONIZING BIO-UPLINK...";
    if (!connected) return "OFFLINE";
    if (isAiSpeaking) return "ENTITY IS RESPONDING";
    if (isAwaitingResponse) return "ANALYZING ALIBI...";
    if (muted) return "MICROPHONE MUTED";
    return "LISTENING TO ALIBI...";
  };

  const orbState = connectionError
    ? "error"
    : isConnecting
      ? "connecting"
      : connected && isAiSpeaking
        ? "talking"
        : connected && isAwaitingResponse
          ? "listening"
          : connected && muted
            ? "muted"
            : connected
              ? "listening"
              : "offline";

  const surrender = () => {
    if (connected) disconnect();
    onLose();
  };

  const micLevel = muted || !connected || !micArmed ? 0 : Math.min(1, inputVolume * 18);
  const micActive = micLevel > 0.14;
  const heardRecently = Boolean(lastInputAt && Date.now() - lastInputAt < 1200);
  const micStatusText = muted
    ? "MIC MUTED"
    : !connected
      ? "MIC OFFLINE"
      : !micArmed
        ? "MIC ARMS AFTER FIRST RESPONSE"
        : isAwaitingResponse
          ? "ALIBI SENT"
        : micActive || heardRecently
          ? "MIC RECEIVING"
          : "NO VOICE DETECTED";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative flex h-screen w-screen flex-col justify-between bg-black p-5 font-mono text-zinc-400 select-none overflow-hidden sm:p-8">
      {/* Background Grid details */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(20,184,166,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(217,70,239,0.045)_1px,transparent_1px)] bg-[size:5rem_5rem] opacity-75" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(15,23,42,0)_0%,rgba(8,7,22,0.18)_36%,rgba(0,0,0,0.92)_96%)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[conic-gradient(from_160deg,rgba(34,211,238,0.14),rgba(217,70,239,0.12),rgba(251,191,36,0.1),rgba(34,211,238,0.14))] blur-3xl" />

      {/* Top Header Status Bar */}
      <div className="relative z-10 flex w-full items-center justify-between border-b border-zinc-800/70 pb-3 text-[10px] text-zinc-500">
        <div className="flex items-center gap-2">
          <Wifi className={cn("size-3.5", connected ? "text-cyan-400 animate-pulse" : "text-zinc-700")} />
          <span className={cn("font-bold tracking-widest", connected ? "text-cyan-400/80" : "text-zinc-700")}>
            UPLINK: {connected ? `CH_LIVE_${crime.length}` : "STANDBY"}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className={cn("font-bold transition-all", suspicion >= 80 ? "text-red-500" : suspicion >= 50 ? "text-amber-500" : "text-cyan-400/80")}>THREAT INDEX: {suspicion}%</span>
          <button onClick={onChangeKey} className="cursor-pointer font-bold uppercase transition-colors hover:text-red-400">
            Reset Key
          </button>
        </div>
      </div>

      {/* Center Living Orb */}
      <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center py-2 sm:py-4">
        <LivingOrb state={orbState} volume={volume} suspicion={suspicion} />

        {/* Status Text Under Orb */}
        <div className="-mt-2 space-y-2 text-center sm:mt-0">
          <p className={cn("text-xs font-bold uppercase tracking-[0.24em] transition-all", isConnecting ? "text-amber-300 animate-pulse" : connectionError ? "text-red-400 animate-pulse" : connected && isAiSpeaking ? "text-fuchsia-300" : connected ? "text-cyan-300 animate-pulse" : "text-zinc-500")}>
            {getStatusText()}
          </p>
          <p className="max-w-xs text-[10px] font-sans leading-relaxed tracking-wide text-zinc-500 select-none">
            {connectionError ? "Google Live connection stalled. Retry the uplink or reset the API key." : connected ? "Microphone active. Speak your alibi clearly to defend yourself." : "Establish transmission connection to synchronize the uplink."}
          </p>
          <div className="mx-auto mt-4 w-[min(88vw,24rem)] rounded-lg border border-zinc-800/80 bg-black/45 p-3 text-left shadow-[0_0_30px_rgba(34,211,238,0.06)] backdrop-blur-md">
            <div className="mb-2 flex items-center justify-between gap-3 text-[9px] font-black uppercase tracking-[0.18em]">
              <span className={cn("flex items-center gap-1.5", micActive || heardRecently ? "text-cyan-300" : "text-zinc-500")}>
                {muted ? <MicOff className="size-3.5" /> : <Mic className="size-3.5" />}
                {micStatusText}
              </span>
              <span className={cn("flex items-center gap-1.5", connected && !connectionError ? "text-emerald-300" : "text-red-400")}>
                <Activity className="size-3.5" />
                {connected && !connectionError ? "SIGNAL GOOD" : "SIGNAL LOST"}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-900">
              <motion.div
                className={cn(
                  "h-full rounded-full",
                  micActive || heardRecently
                    ? "bg-gradient-to-r from-cyan-400 via-emerald-300 to-amber-300 shadow-[0_0_14px_rgba(34,211,238,0.45)]"
                    : "bg-zinc-700"
                )}
                animate={{ width: `${Math.max(4, micLevel * 100)}%` }}
                transition={{ duration: 0.12, ease: "easeOut" }}
              />
            </div>
            <div className="mt-2 grid grid-cols-12 gap-1">
              {Array.from({ length: 12 }).map((_, index) => {
                const active = micLevel >= (index + 1) / 12;
                return (
                  <span
                    key={index}
                    className={cn(
                      "h-1 rounded-full transition-colors",
                      active ? "bg-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.45)]" : "bg-zinc-800"
                    )}
                  />
                );
              })}
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 flex items-center gap-1.5 text-[8px] font-black uppercase tracking-[0.18em] text-zinc-500">
                  <Mic className="size-3" />
                  Input
                </span>
                <select
                  value={selectedInputDeviceId}
                  onChange={(event) => setSelectedInputDeviceId(event.target.value)}
                  className="h-8 w-full rounded-md border border-zinc-800 bg-zinc-950 px-2 text-[10px] font-bold text-zinc-300 outline-none transition-colors hover:border-cyan-500/50 focus:border-cyan-400"
                >
                  <option value="">Default microphone</option>
                  {audioInputDevices.map((device, index) => (
                    <option key={device.deviceId || `input-${index}`} value={device.deviceId}>
                      {device.label || `Microphone ${index + 1}`}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 flex items-center gap-1.5 text-[8px] font-black uppercase tracking-[0.18em] text-zinc-500">
                  <Headphones className="size-3" />
                  Output
                </span>
                <select
                  value={selectedOutputDeviceId}
                  onChange={(event) => setSelectedOutputDeviceId(event.target.value)}
                  disabled={!outputDeviceSupported}
                  className={cn(
                    "h-8 w-full rounded-md border border-zinc-800 bg-zinc-950 px-2 text-[10px] font-bold outline-none transition-colors",
                    outputDeviceSupported
                      ? "text-zinc-300 hover:border-cyan-500/50 focus:border-cyan-400"
                      : "cursor-not-allowed text-zinc-600"
                  )}
                >
                  <option value="">{outputDeviceSupported ? "Default speaker" : "Browser default only"}</option>
                  {audioOutputDevices.map((device, index) => (
                    <option key={device.deviceId || `output-${index}`} value={device.deviceId}>
                      {device.label || `Speaker ${index + 1}`}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Pill Action Dock */}
      <div className="relative z-10 flex w-full flex-col items-center gap-4 border-t border-zinc-800/70 pt-4">
        <AnimatePresence>
          {connectionError && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="flex flex-col items-center gap-1.5 text-center">
              <span className="flex max-w-md items-center gap-1.5 text-[9px] leading-normal text-red-400 select-text"><ShieldAlert className="size-3.5" />{connectionError}</span>
              <button onClick={triggerRetry} className="flex items-center gap-1 text-[10px] text-red-400 font-bold uppercase underline hover:text-red-300 cursor-pointer">
                <RefreshCw className="size-3" />
                <span>Retry Sat-Link</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-wrap items-center justify-center gap-3 rounded-full border border-zinc-900 bg-zinc-950/70 px-4 py-3 shadow-2xl backdrop-blur-md sm:gap-4 sm:px-6">
          <Button
            variant="ghost"
            disabled={isConnecting}
            onClick={surrender}
            className="h-10 rounded-full border border-red-500/35 bg-red-950/20 px-4 text-[10px] font-black uppercase tracking-widest text-red-300 shadow-[0_0_18px_rgba(239,68,68,0.08)] transition-all hover:border-red-400/60 hover:bg-red-500/15 hover:text-red-100"
          >
            <Flag className="size-3.5" />
            <span>Surrender</span>
          </Button>

          {/* Mute button */}
          <Button
            variant="ghost"
            size="icon"
            disabled={!connected}
            onClick={() => setMuted(!muted)}
            className={cn("size-10 rounded-full border transition-all cursor-pointer", muted ? "bg-amber-950/30 border-amber-500/30 text-amber-500 hover:bg-amber-900/30" : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800")}
          >
            {muted ? <MicOff className="size-4" /> : <Mic className="size-4" />}
          </Button>

          {/* Connect / Disconnect Action */}
          <Button
            variant="destructive"
            size="icon"
            disabled={isConnecting}
            onClick={connected ? disconnect : connect}
            className={cn("size-12 cursor-pointer rounded-full shadow-lg transition-all", connected ? "bg-red-600 hover:bg-red-700" : "bg-cyan-500 text-black hover:bg-cyan-400")}
          >
            {isConnecting ? (
              <RefreshCw className="size-5 animate-spin text-black" />
            ) : connected ? (
              <PhoneOff className="size-5" />
            ) : (
              <Wifi className="size-5 text-black" />
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
