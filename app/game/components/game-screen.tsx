"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Info, Mic, MicOff, Pause, Play, Send, ShieldAlert, Terminal, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useInterrogationClient } from "../hooks/use-interrogation-client";
import { FloatingBlob } from "./floating-blob";
import { GameHeader } from "./game-header";
import { GameHud } from "./game-hud";

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
  onChangeKey,
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
  onChangeKey: () => void;
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
      {/* Tactical Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0b0b0f_1px,transparent_1px),linear-gradient(to_bottom,#0b0b0f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none z-[1]" />
      <div className="pointer-events-none fixed inset-0 z-[2] bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.6)_95%)]" />

      {/* Header */}
      <GameHeader elapsedTime={elapsedTime} crime={crime} onChangeKey={onChangeKey} />

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
            {chatHistory.length === 0 && !isConnecting && (
              <div className="flex h-full flex-col items-center justify-center text-center text-zinc-500 space-y-6">
                <div className="relative flex items-center justify-center">
                  <motion.div
                    className="absolute size-24 rounded-full border border-violet-500/20"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0.4, 0.1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute size-16 rounded-full border border-cyan-500/25"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                  />
                  <div className="relative size-10 rounded-full bg-zinc-950 border border-zinc-900 flex items-center justify-center">
                    <Terminal className="size-4.5 text-violet-400 animate-pulse" />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="font-mono text-[10px] font-bold text-zinc-300 uppercase tracking-widest animate-pulse">ESTABLISHING AUDIO TRANSMISSION</p>
                  <p className="text-[9px] text-zinc-500 max-w-xs leading-normal">
                    Secure satellite uplink handshaking... please standby for detective accusation feed.
                  </p>
                </div>
              </div>
            )}
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={connected ? disconnect : connect}
                  disabled={isConnecting}
                  className={cn(
                    "h-9 px-3 text-xs gap-1.5 font-bold border transition-all",
                    connected
                      ? "border-emerald-500/20 bg-emerald-950/10 text-emerald-400 hover:bg-emerald-900/20"
                      : "border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800"
                  )}
                >
                  {isConnecting ? (
                    <div className="size-3.5 rounded-full border border-zinc-650 border-t-zinc-400 animate-spin" />
                  ) : connected ? (
                    <Pause className="size-3.5" />
                  ) : (
                    <Play className="size-3.5" />
                  )}
                  <span>{isConnecting ? "Connecting..." : connected ? "Disconnect" : "Connect"}</span>
                </Button>
              </div>
              <span className={cn("text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5", connectionError ? "text-red-400" : !connected ? "text-zinc-600" : isAiSpeaking ? "text-violet-400" : muted ? "text-orange-400" : "text-emerald-400")}>
                {connectionError ? <><ShieldAlert className="size-3.5" /><span onClick={triggerRetry} className="cursor-pointer underline">Error (Retry)</span></> : !connected ? <><Info className="size-3.5" /><span>Offline</span></> : isAiSpeaking ? <><span className="size-1.5 rounded-full bg-violet-400 animate-ping" /><span>Detective Replies</span></> : muted ? <><MicOff className="size-3.5" /><span>Muted</span></> : <><span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" /><span>Active Mic</span></>}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side HUD Panel */}
        <GameHud
          suspicion={suspicion}
          mood={getDetectiveMood()}
          score={currentScore}
          isAiSpeaking={isAiSpeaking}
          connected={connected}
          volume={volume}
          muted={muted}
        />
      </main>
    </motion.div>
  );
}
