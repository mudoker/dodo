"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { FolderOpen, KeyRound, Radio, ShieldAlert, Terminal, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useLiveAPIContext } from "@/hooks/use-live-api";
import { CRIMES, AVAILABLE_MODELS } from "../constants";
import { LivingOrb } from "./living-orb";
import { WelcomeDossiers } from "./welcome-dossier";

const CASE_SIGNALS = [
  { label: "Voice Link", value: "Armed", tone: "text-cyan-300" },
  { label: "Impatience", value: "100%", tone: "text-amber-300" },
  { label: "Disposition", value: "Hostile", tone: "text-red-300" },
];

export function WelcomeScreen({
  onStart, hasKey, onChangeKey, selectedModel, setSelectedModel
}: {
  onStart: (crime?: string) => void; hasKey: boolean; onChangeKey: () => void;
  selectedModel: string; setSelectedModel: (m: string) => void;
}) {
  const [randomCrime, setRandomCrime] = useState("");
  const [terminalLog, setTerminalLog] = useState<string[]>([]);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; msg: string } | null>(null);

  const { client } = useLiveAPIContext();

  const changeScenario = () => {
    setRandomCrime((current) => {
      if (CRIMES.length < 2) return current;
      let nextCrime = current;
      while (nextCrime === current) {
        nextCrime = CRIMES[Math.floor(Math.random() * CRIMES.length)];
      }
      return nextCrime;
    });
  };

  const testConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      client.disconnect();
      const testConfig = {
        model: selectedModel,
        generationConfig: { responseModalities: "audio" as const },
      };
      
      const connectionPromise = new Promise<void>((resolve, reject) => {
        const onOpen = () => { cleanup(); resolve(); };
        const onError = (err: any) => { cleanup(); reject(err || new Error("Connection failed")); };
        const onClose = (e: any) => { cleanup(); reject(new Error(e.reason || `WebSocket closed (code: ${e.code})`)); };
        const cleanup = () => {
          client.off("open", onOpen);
          client.off("error", onError);
          client.off("close", onClose);
        };
        client.on("open", onOpen);
        client.on("error", onError);
        client.on("close", onClose);
        setTimeout(() => { cleanup(); reject(new Error("Timeout")); }, 5000);
      });

      await client.connect(testConfig);
      await connectionPromise;
      setTestResult({ success: true, msg: "STABLE" });
      client.disconnect();
    } catch (err: any) {
      setTestResult({ success: false, msg: err.message || "FAILED" });
      client.disconnect();
    } finally {
      setIsTesting(false);
    }
  };

  useEffect(() => {
    setRandomCrime(CRIMES[Math.floor(Math.random() * CRIMES.length)]);
    const logs = ["ESTABLISHING AUDIO SECURE LINK...", "UPLINK SECURED // FEED OPEN", "DOSSIER SYNC COMPLETE"];
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="relative flex min-h-screen flex-col items-center justify-between overflow-hidden bg-black p-5 font-mono text-white sm:p-7">
      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(20,184,166,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(239,68,68,0.045)_1px,transparent_1px)] bg-[size:4.5rem_4.5rem]" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_28%_28%,rgba(34,211,238,0.15),transparent_34%),radial-gradient(circle_at_68%_38%,rgba(239,68,68,0.12),transparent_30%),radial-gradient(circle_at_50%_92%,rgba(168,85,247,0.12),transparent_36%)]" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_center,rgba(2,6,23,0.16),rgba(0,0,0,0.72)_72%,rgba(0,0,0,0.96))]" />
      
      {/* Top Banner Status */}
      <div className="relative z-10 flex w-full max-w-6xl items-center justify-between border-b border-zinc-800/70 pb-3 text-[10px] font-bold tracking-widest text-zinc-500">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-red-500 shadow-[0_0_14px_rgba(239,68,68,0.9)] animate-ping" />
          <span className="text-red-500">INTRUSION DETECTED // CASE #{(randomCrime.length * 17) || 99}</span>
        </div>
        <span>SYSTEM TIME: 2026.07.19</span>
      </div>

      {/* Main Core Dashboard */}
      <main className="relative z-10 my-auto grid w-full max-w-6xl items-stretch gap-6 py-8 lg:grid-cols-[1fr_23rem] lg:py-10">
        <section className="min-w-0 flex flex-col justify-between gap-4">
          <div>
            <div className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.28em] text-red-400">
              <ShieldAlert className="size-3.5" /> Live Interrogation Intake
            </div>
            <h1 className="text-5xl font-black uppercase leading-none tracking-normal text-white drop-shadow-[0_0_24px_rgba(239,68,68,0.18)] sm:text-7xl">
              DODO
            </h1>
            <p className="mt-3 max-w-xl text-xs font-bold uppercase tracking-[0.22em] text-zinc-400">
              Tactical accusation engine for ridiculous office crimes.
            </p>
          </div>

          <WelcomeDossiers randomCrime={randomCrime} changeScenario={changeScenario} />

          <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
            <div className="min-h-20 rounded-lg border border-zinc-800 bg-black/50 p-3.5 text-[9px] leading-relaxed text-zinc-500 font-mono">
              <div className="mb-2 flex items-center gap-1.5 font-black uppercase tracking-[0.22em] text-zinc-400">
                <Terminal className="size-3 text-red-400" /> Uplink Console
              </div>
              {terminalLog.map((log, i) => (
                <div key={i} className="flex gap-1.5">
                  <span className="text-red-500">&gt;</span>
                  <span>{log}{i === terminalLog.length - 1 && <span className="ml-1 inline-block h-2.5 w-1 bg-red-500/80 animate-pulse" />}</span>
                </div>
              ))}
            </div>
            <div className="relative flex items-center justify-center">
              <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-red-600 to-cyan-400 opacity-40 blur-sm" />
              <Button onClick={() => onStart(randomCrime)} size="lg" className="relative h-full min-h-14 w-full rounded-lg bg-red-650 px-8 text-xs font-black uppercase tracking-widest text-white hover:bg-red-500 lg:w-72 cursor-pointer">
                <FolderOpen className="size-4" /> Establish Dossier Link
              </Button>
            </div>
          </div>
        </section>

        {/* Sidebar Status Info */}
        <aside className="relative flex flex-col items-center justify-between overflow-hidden rounded-lg border border-zinc-850 bg-zinc-950/55 p-5 backdrop-blur-md">
          <div className="relative z-10 flex w-full items-center justify-between text-[9px] font-black uppercase tracking-[0.22em] text-zinc-500">
            <span className="flex items-center gap-1.5"><Radio className="size-3 text-cyan-300" /> Signal Core</span>
            <span className="text-cyan-300">Standby</span>
          </div>
          <div className="relative z-10 my-1 flex min-h-60 flex-1 w-full items-center justify-center">
            <LivingOrb state="offline" volume={0.01} suspicion={65} />
          </div>
          <div className="relative z-10 grid w-full grid-cols-2 gap-3 text-[9px] uppercase tracking-widest">
            <div className="border border-zinc-850 bg-black/35 p-3">
              <KeyRound className="mb-2 size-3.5 text-amber-300" />
              <span className="block text-zinc-650">API Key</span>
              <span className="mt-1 block font-black text-zinc-200">{hasKey ? "Loaded" : "Missing"}</span>
            </div>
            <div className="border border-zinc-850 bg-black/35 p-3">
              <Zap className="mb-2 size-3.5 text-cyan-300" />
              <span className="block text-zinc-650">Latency</span>
              <span className="mt-1 block font-black text-zinc-200">Volatile</span>
            </div>
          </div>
        </aside>
      </main>

      {/* Footer controls & change API Key */}
      <div className="relative z-10 flex w-full max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-zinc-800/70 pt-3 text-[9px] text-zinc-600 font-mono">
        <span>SECURITY PROTOCOL: GOOGLE_BIDI_SECURE</span>
        
        {/* Model Uplink Selector Dropdown & Test Link */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-zinc-550 font-bold uppercase tracking-wider text-[8px]">UPLINK NODE:</span>
          <select 
            value={selectedModel} 
            onChange={(e) => setSelectedModel(e.target.value)}
            className="bg-zinc-950 border border-zinc-800/80 text-[10px] text-cyan-400 font-bold uppercase tracking-wider px-3.5 py-1.5 rounded cursor-pointer focus:outline-none focus:border-cyan-500 hover:border-zinc-700 font-mono transition-all"
          >
            {AVAILABLE_MODELS.map(m => (
              <option key={m.id} value={m.id} className="bg-zinc-950 text-zinc-300 py-1 font-mono text-[9px]">
                {m.name}
              </option>
            ))}
          </select>
          
          <button 
            type="button" 
            onClick={testConnection} 
            disabled={isTesting} 
            className={cn(
              "cursor-pointer rounded border px-3 py-1.5 text-[8px] font-black uppercase tracking-widest transition-all",
              isTesting 
                ? "bg-zinc-900 border-zinc-800 text-zinc-500 cursor-not-allowed" 
                : "bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/15 hover:border-cyan-400/60"
            )}
          >
            {isTesting ? "Testing..." : "Test Link"}
          </button>
          
          {testResult && (
            <span className={cn(
              "text-[9px] font-bold uppercase tracking-wider animate-pulse",
              testResult.success ? "text-emerald-400" : "text-red-400"
            )}>
              [{testResult.msg}]
            </span>
          )}
        </div>

        {hasKey && (
          <button onClick={onChangeKey} className="cursor-pointer rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 font-black uppercase tracking-widest text-red-300 transition-colors hover:border-red-400/60 hover:bg-red-500/15 hover:text-red-100">
            Reset API Key
          </button>
        )}
      </div>
    </motion.div>
  );
}
