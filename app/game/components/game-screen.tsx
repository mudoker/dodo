"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Gauge, Info, MessageSquare, Mic, MicOff, Pause, Play, Send, ShieldAlert, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useInterrogationClient } from "../hooks/use-interrogation-client";
import { DetectiveProfile } from "./detective-profile";
import { EqualizerWaveform } from "./equalizer-waveform";
import { FloatingBlob } from "./floating-blob";

export function GameScreen({
  crime,
  elapsedTime,
  suspicion,
  onWin,
  onLose,
  onTimerStart,
  onGoodArgument,
  onIncreaseImpatience,
  timerStarted,
}: {
  crime: string;
  elapsedTime: number;
  suspicion: number;
  onWin: () => void;
  onLose: () => void;
  onTimerStart: () => void;
  onGoodArgument: () => void;
  onIncreaseImpatience: (amount: number) => void;
  timerStarted: boolean;
}) {
  const {
    connected, isAiSpeaking, chatHistory, connectionError, isConnecting,
    showInnocenceBonus, volume, sendTextMessage, muted, setMuted,
    disconnect, connect, triggerRetry
  } = useInterrogationClient({
    crime, timerStarted, onTimerStart, onGoodArgument, onIncreaseImpatience, onWin, onLose
  });

  const [textInput, setTextInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatHistory, isAiSpeaking]);

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    sendTextMessage(textInput.trim());
    setTextInput("");
  };

  const getDetectiveMood = () => {
    if (suspicion >= 85) return "Furious 😡";
    if (suspicion >= 65) return "Hostile 😠";
    if (suspicion >= 45) return "Suspicious 🤨";
    if (suspicion >= 20) return "Impatient 😐";
    return "Flustered 😳";
  };

  const currentScore = Math.max(0, 2000 - (suspicion * 12) - (elapsedTime * 2));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative flex min-h-screen flex-col overflow-hidden bg-black font-sans">
      <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center opacity-30 blur-2xl">
        <FloatingBlob isActive={connected} volume={volume} isSpeaking={isAiSpeaking} />
      </div>
      <div className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.6)_95%)]" />

      {/* Header */}
      <header className="relative z-20 border-b border-zinc-900 bg-zinc-950/60 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <motion.div className="absolute -inset-2 rounded-full bg-red-500/10 blur-md" animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 2.5, repeat: Infinity }} />
              <AlertTriangle className="relative size-6 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
            </div>
            <span className="font-mono text-xl font-bold tracking-tighter text-white">DoDo</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-mono text-2xl font-bold text-white">{String(Math.floor(elapsedTime / 60)).padStart(2, "0")}:{String(elapsedTime % 60).padStart(2, "0")}</span>
            <span className="text-[9px] uppercase tracking-widest text-cyan-450/70 font-semibold">Active Stopwatch</span>
          </div>
        </div>
        <div className="border-t border-zinc-900 bg-zinc-950/20 px-6 py-2">
          <p className="mx-auto max-w-6xl text-center text-xs text-zinc-400"><span className="font-black text-red-500 uppercase">Charges:</span> "{crime}"</p>
        </div>
      </header>

      {/* Innocence Gain Alert */}
      <AnimatePresence>
        {showInnocenceBonus && (
          <motion.div initial={{ opacity: 0, y: -40, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.9 }} className="fixed left-1/2 top-28 z-50 -translate-x-1/2 rounded-xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/95 to-zinc-950/95 px-6 py-3 shadow-xl backdrop-blur-xl flex items-center gap-2.5">
            <Zap className="size-5 text-emerald-400 animate-bounce" />
            <div>
              <p className="text-xs font-bold text-emerald-400 uppercase">Innocence Gain</p>
              <p className="text-[10px] text-zinc-400">Suspicion Level Decreased by 15%</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Board */}
      <main className="relative z-10 flex flex-col lg:flex-row gap-6 px-6 py-6 max-w-6xl mx-auto w-full overflow-hidden flex-1">
        {/* Left Side: Interrogation Chat log */}
        <div className="flex flex-1 flex-col h-[calc(100vh-220px)] lg:h-[calc(100vh-200px)] min-h-[350px] rounded-xl border border-zinc-900 bg-zinc-950/20 overflow-hidden shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-zinc-900 bg-zinc-950/80 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 font-mono">INTERROGATION TRANSCRIPT</span>
            </div>
            <span className="text-[9px] font-mono text-zinc-500 font-bold uppercase">CASE ID: #{(crime ? crime.length * 17 : 99)}</span>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-4 pr-3 pb-4 scrollbar bg-zinc-950/10 p-5 shadow-inner select-text">
            {chatHistory.length === 0 && !isConnecting && <div className="flex h-full flex-col items-center justify-center text-center text-zinc-500 space-y-3"><MessageSquare className="size-10 text-zinc-700 animate-pulse" /><p className="font-semibold text-zinc-400 text-sm">Room Offline. Wait for accusation.</p></div>}
            {isConnecting && <div className="flex h-full flex-col items-center justify-center text-center text-amber-500 space-y-3 animate-pulse"><div className="size-8 rounded-full border-2 border-amber-500/30 border-t-amber-500 animate-spin" /><p className="text-xs font-bold uppercase">Connecting...</p></div>}
            {chatHistory.map((msg) => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 18 }} className={cn("flex w-full flex-col", msg.sender === "detective" ? "items-start" : "items-end")}>
                <div className="flex items-center gap-2 mb-1 px-1"><span className={cn("text-[10px] font-bold uppercase tracking-wider", msg.sender === "detective" ? "text-violet-400" : "text-cyan-400")}>{msg.sender === "detective" ? "Detective Grimstone" : "You (Suspect)"}</span></div>
                <div className={cn("max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed border shadow-md", msg.sender === "detective" ? "bg-gradient-to-br from-violet-950/40 to-zinc-950/80 text-zinc-200 border-violet-900/20" : msg.isVoice ? "bg-gradient-to-br from-cyan-950/20 to-zinc-950/50 text-cyan-300/80 border-cyan-800/10 italic" : "bg-cyan-950/30 text-zinc-100 border-cyan-800/20")}>
                  {msg.text}{msg.isLive && <motion.span className="inline-block ml-1 h-3 w-1.5 bg-violet-400" animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }} />}
                </div>
              </motion.div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="bg-zinc-950/80 border-t border-zinc-900 p-4 backdrop-blur-md">
            <form onSubmit={handleSendText} className="flex gap-2">
              <Input value={textInput} onChange={(e) => setTextInput(e.target.value)} placeholder={!connected ? "Establish connection first..." : isAiSpeaking ? "Wait for the detective to finish..." : "Type your alibi here..."} disabled={!connected || isAiSpeaking} className="bg-black/50 border-zinc-850 text-white placeholder:text-zinc-600 focus-visible:ring-violet-600/30 font-sans" />
              <Button type="submit" disabled={!connected || !textInput.trim() || isAiSpeaking} className="bg-violet-600 hover:bg-violet-500 text-white px-5"><Send className="size-4" /></Button>
            </form>
            <div className="mt-3 flex items-center justify-between border-t border-zinc-900 pt-3">
              <div className="flex items-center gap-2">
                <Button variant={muted ? "outline" : "destructive"} size="sm" onClick={() => setMuted(!muted)} disabled={!connected} className={cn("h-9 px-3 text-xs gap-1.5 font-bold transition-all", muted ? "border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800" : "bg-red-950/30 border-red-500/20 text-red-400 hover:bg-red-900/30")}>{muted ? <MicOff className="size-3.5" /> : <Mic className="size-3.5" />}<span>{muted ? "Unmute" : "Mute"}</span></Button>
                <Button variant="ghost" size="sm" onClick={connected ? disconnect : connect} className={cn("h-9 px-3 text-xs gap-1.5 font-bold border", connected ? "border-emerald-500/20 bg-emerald-950/10 text-emerald-400" : "border-zinc-800 bg-zinc-900/50 text-zinc-400")}>{connected ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}<span>{connected ? "Disconnect" : "Connect"}</span></Button>
              </div>
              <span className={cn("text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5", connectionError ? "text-red-400" : !connected ? "text-zinc-600" : isAiSpeaking ? "text-violet-400" : muted ? "text-orange-400" : "text-emerald-400")}>
                {connectionError ? <><ShieldAlert className="size-3.5" /><span onClick={triggerRetry} className="cursor-pointer underline">Error (Retry)</span></> : !connected ? <><Info className="size-3.5" /><span>Offline</span></> : isAiSpeaking ? <><span className="size-1.5 rounded-full bg-violet-400 animate-ping" /><span>Detective Replies</span></> : muted ? <><MicOff className="size-3.5" /><span>Muted</span></> : <><span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" /><span>Active Mic</span></>}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: HUD Panel */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full lg:w-72 flex flex-col gap-4">
          <DetectiveProfile mood={getDetectiveMood()} suspicion={suspicion} isSpeaking={isAiSpeaking} />
          <motion.div key={suspicion} animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 0.3 }} className="rounded-xl border border-zinc-900 bg-zinc-950/30 p-5 backdrop-blur-sm">
            <div className="mb-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2"><Gauge className="size-4.5 text-zinc-400" /><h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Suspicion</h3></div>
              <span className={cn("text-xs font-black px-2 py-0.5 rounded-md font-mono", suspicion >= 80 ? "bg-red-950 text-red-400" : suspicion >= 50 ? "bg-amber-950 text-amber-400" : "bg-emerald-950 text-emerald-400")}>{suspicion}%</span>
            </div>
            <div className="h-3 w-full rounded-full bg-zinc-950 overflow-hidden border border-zinc-900 p-0.5"><motion.div className={cn("h-full rounded-full bg-gradient-to-r", suspicion >= 75 ? "from-amber-500 to-red-500" : suspicion >= 40 ? "from-emerald-500 to-amber-500" : "from-cyan-500 to-emerald-500")} initial={{ width: "75%" }} animate={{ width: `${suspicion}%` }} transition={{ duration: 0.4 }} /></div>
            <div className="mt-2.5 flex items-center justify-between text-[9px] text-zinc-500 uppercase tracking-widest font-semibold"><span>Innocent</span><span>Locked Up</span></div>
          </motion.div>

          <div className="rounded-xl border border-zinc-900 bg-zinc-950/30 p-5 backdrop-blur-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Case Report</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs border-b border-zinc-900/50 pb-2"><span className="text-zinc-500">Detective Mood</span><span className={cn("font-bold", suspicion >= 85 ? "text-red-400 animate-pulse" : suspicion >= 65 ? "text-red-300" : suspicion >= 45 ? "text-amber-400" : "text-emerald-400")}>{getDetectiveMood()}</span></div>
              <div className="flex items-center justify-between text-xs"><span className="text-zinc-500">Score Rating</span><span className="font-bold text-cyan-400 font-mono">{currentScore.toLocaleString()} pts</span></div>
            </div>
          </div>

          <div className="flex-1 rounded-xl border border-zinc-900 bg-zinc-950/10 p-5 flex flex-col justify-between items-center backdrop-blur-sm overflow-hidden min-h-[180px]">
            <div className="w-full flex items-center gap-2 mb-2 self-start"><span className={cn("size-2 rounded-full bg-cyan-500/85", connected && "animate-pulse")} /><h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Voice Analyzer</h3></div>
            <EqualizerWaveform isSpeaking={isAiSpeaking} isActive={connected && !muted} />
            <div className="scale-35 opacity-30 -my-6"><FloatingBlob isActive={connected} volume={volume} isSpeaking={isAiSpeaking} /></div>
          </div>
        </motion.div>
      </main>
    </motion.div>
  );
}
