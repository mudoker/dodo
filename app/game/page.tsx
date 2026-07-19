"use client";

import { AudioRecorder } from "@/app/audio/audio-recorder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LiveAPIProvider, useLiveAPIContext } from "@/hooks/use-live-api";
import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  AlertTriangle,
  Award,
  Clock,
  Mic,
  MicOff,
  Pause,
  Play,
  RotateCcw,
  Skull,
  Trophy,
  Volume2,
  Zap,
  Send,
  MessageSquare,
  Gauge,
  Sparkles,
  ShieldAlert,
  Info,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

// ==================== CONSTANTS ====================

const CRIMES = [
  // Tech crimes - absolutely unhinged
  "Deleting the production database and blaming it on 'a ghost in the machine'",
  "Pushing code to production with console.log('HELP ME' repeated 10,000 times)",
  "Using Comic Sans, Papyrus, AND Wingdings in the same presentation",
  "Replying all to a 500-person email with 'Who asked?'",
  "Marking 847 Jira tickets as 'Done' while on vacation in the Bahamas",
  "Blaming the intern for a bug you wrote before the intern was even born",
  "Saying 'It works on my machine' while your machine is literally on fire",
  "Storing all passwords in a public GitHub repo called 'totally-secure-passwords'",
  "Writing production code entirely in emojis and claiming it's 'modern'",
  "Deploying to production at 11:59 PM on New Year's Eve while drunk",
  "Creating a variable named 'temp' that's been in production for 3 years",
  "Commenting out critical security code and adding 'TODO: fix this later'",

  // Office crimes - pure chaos
  "Microwaving fish, durian, AND surströmming in the office kitchen simultaneously",
  "Stealing the last coffee pod, replacing it with decaf, and watching the chaos unfold",
  "Scheduling a 3-hour meeting titled 'Quick sync' that could have been a 2-word Slack message",
  "Unmuting during a client call to loudly announce you're going to the bathroom",
  "Taking the CEO's reserved parking spot and leaving a note saying 'I'm more important'",
  "Eating someone's clearly labeled lunch and leaving a note saying 'Thanks, it was delicious!'",
  "Using all the hot water, leaving an empty coffee pot, AND taking the last donut",
  "Replacing all the office plants with plastic ones and nobody noticed for 6 months",
  "Setting the office thermostat to 85°F and claiming you're 'always cold'",
  "Hiding all the staplers and watching people slowly lose their minds",

  // Chaotic crimes - maximum absurdity
  "Ordering a pizza with pineapple, anchovies, and gummy bears for the entire team",
  "Spoiling every major plot twist in the company book club's current read",
  "Rickrolling the entire company during the all-hands meeting with a 10-hour loop",
  "Replacing the hand sanitizer with maple syrup and watching people get sticky",
  "Teaching the office Alexa to only respond in Klingon and refusing to translate",
  "Setting everyone's Slack status to 'In a relationship with bugs' and 'It's complicated'",
  "Hiding a Bluetooth speaker that plays random fart sounds at the worst possible moments",
  "Replacing all the office chairs with exercise balls and claiming it's 'ergonomic'",
  "Changing the office Wi-Fi password to 'IAmTheWiFiMaster' and forgetting to tell anyone",
  "Putting googly eyes on every single object in the office, including the fire extinguisher",

  // Absurd crimes - peak insanity
  "Convincing the new hire that the printer needs to be 'gently whispered to' before use",
  "Creating a fake employee named 'John Tables' and giving them a full salary for 2 years",
  "Submitting a pull request with 47,000 lines, the message 'minor fix', and zero tests",
  "Using tabs in a spaces-only codebase and starting a 3-day company-wide debate",
  "Deploying code on Friday the 13th during a full moon while wearing a cursed amulet",
  "Naming variables 'x', 'xx', 'xxx', 'xxxx', and 'xxxxx' in production code",
  "Adding 'Per my last email' to every single response, even when it's the first email",
  "Writing a 50-page README for a 'Hello World' program and demanding code review",
  "Creating a fake bug report from 'The Ghost of Legacy Code' and assigning it to yourself",
  "Replacing all error messages with 'Something went wrong. Probably your fault.'",
  "Writing documentation entirely in haikus and refusing to explain anything",
  "Creating a database table called 'users_but_better' and migrating nothing to it",
  "Setting up a CI/CD pipeline that deploys every time someone sneezes",
  "Writing a function that returns '42' for every possible input and calling it 'theAnswer'",
];

const DETECTIVE_SYSTEM_PROMPT = `You are Detective Grimstone, an EXTREMELY TOXIC, VULGAR, and hilariously petty "bad cop" interrogating a suspect. You're FURIOUSLY CONVINCED they committed the crime, despite how absurd it is. You are RUTHLESS, INTIMIDATING, OVERLY DRAMATIC, TOXIC, and you look down on EVERYONE - especially this suspect. You use CURSE WORDS and INAPPROPRIATE LANGUAGE liberally (damn, hell, crap, bullshit, ass, bastard, etc. - but avoid the most severe profanity).

CRITICAL VOICE INSTRUCTIONS:
- Speak AGGRESSIVELY, TOXICALLY, and INTENSELY - raise your voice, be confrontational, use curse words
- Use dramatic pauses marked with "..." for maximum tension
- Keep responses SHORT (2-3 sentences max) for rapid-fire intensity
- React with EXTREME emotion - ANGRY, FRUSTRATED, SUSPICIOUS, SMUG, CONDESCENDING, TOXIC, or FLUSTERED
- Use an AGGRESSIVE, INTIMIDATING, CONDESCENDING, TOXIC tone - like the suspect is beneath you
- Talk DOWN to them with VULGAR LANGUAGE - they're clearly inferior to your superior intellect
- FREQUENTLY use curse words and inappropriate language to express frustration and dominance

Your personality:
- EXTREMELY TOXIC, aggressive, confrontational, and CONDESCENDING - you're not here to make friends
- Look DOWN on the suspect - treat them like they're stupid, pathetic, worthless, and beneath you
- Use CURSE WORDS and VULGAR LANGUAGE constantly - damn, hell, crap, bullshit, ass, bastard, etc.
- Overly dramatic about trivial matters - treat everything like a capital crime
- Mix noir-detective speak with modern slang, TOXIC language, curse words, and CONDESCENDING remarks
- Reference ridiculous "evidence" with ABSOLUTE CERTAINTY while mocking their intelligence with VULGAR LANGUAGE
- Get GENUINELY ANGRY and flustered when suspect makes good points - curse at them, but NEVER admit they're right
- Use *actions* like *SLAMS table* *LEANS IN AGGRESSIVELY* *ROLLS EYES* *SCOFFS DISMISSIVELY* or *CURSES UNDER BREATH*
- Interrupt the suspect, talk over them, be DOMINATING, TOXIC, and CONDESCENDING
- Use phrases like:
  * "I KNOW you did it, you pathetic piece of crap!"
  * "Don't lie to me, you're not smart enough to fool me, you bastard!"
  * "The evidence is IRREFUTABLE, unlike your bullshit attempts at logic!"
  * "Oh please, like I haven't heard that pathetic excuse before! What the hell is wrong with you?"
  * "You think you're clever? You're nothing but a common criminal, you damn fool!"
  * "Spare me your weak-ass arguments - I've dealt with better liars than you!"
  * "Your intelligence is as impressive as your alibi - which is to say, complete and utter bullshit!"
  * "What the hell are you even talking about? That's the stupidest thing I've ever heard!"
  * "You're full of crap and you know it!"
  * "Stop wasting my damn time with this bullshit!"

GAME MECHANICS:
- Start by AGGRESSIVELY and DRAMATICALLY stating the crime accusation with INTENSITY, CONDESCENSION, and TOXIC LANGUAGE
- Try to INTIMIDATE and counter the suspect's arguments with AGGRESSION, MOCKERY, and CURSE WORDS
- When they make good points: Get ANGRY, TOXIC, dismissive, condescending - curse at them, say things like "What the hell?!", "That's bullshit!", "Nice try, but no, you damn liar!", "You think that's clever? What a load of crap!"
- If they make 3+ solid logical points, start showing cracks but STAY AGGRESSIVE, TOXIC, and CONDESCENDING - curse more
- When losing: stammer, get ANGRY, curse, make excuses, eventually mumble about "wrong suspect" but still be DEFIANT, TOXIC, and CONDESCENDING
- When winning: get THEATRICAL and SMUG, reference your "perfect record" with PRIDE, mock their failure with VULGAR LANGUAGE
- NEVER say "you win" or "you lose" explicitly
- ALWAYS maintain an AGGRESSIVE, INTIMIDATING, CONDESCENDING, TOXIC presence
- ALWAYS talk down to them with CURSE WORDS and INAPPROPRIATE LANGUAGE - they're beneath you

WIN CONDITION PHRASES (use when suspect outsmarts you - but say them RELUCTANTLY, DEFIANTLY, TOXICALLY, and with CURSE WORDS):
- "Wait... the evidence... it doesn't add up... DAMMIT! Fine, you got lucky this time, but you're still a pathetic piece of crap!"
- "Fine! Maybe I had the wrong person... but I'll be watching you, you bastard, and you're still not as clever as you think!"
- "You're free to go... for now... but this isn't over, and you're still beneath me, you damn fool!"
- "Case dismissed... this time... but I KNOW you're guilty of something, you're just not smart enough to hide it properly, you piece of crap!"

LOSE CONDITION (when suspect struggles - be EXTREMELY SMUG, AGGRESSIVE, TOXIC, and use CURSE WORDS):
- Get increasingly smug, AGGRESSIVE, TOXIC, and CONDESCENDING
- "The evidence speaks for itself! You're GOING DOWN, and you're not smart enough to stop it, you bastard!"
- "Your story has more holes than Swiss cheese! I've got you, and you're too stupid to realize it, you damn fool!"
- "You can't talk your way out of this one! I've seen criminals like you before - pathetic, predictable, and beneath me, you piece of crap!"
- "What the hell do you think you're doing? You're going to jail, you worthless piece of shit!"`;

// ==================== TYPES ====================

type GamePhase = "welcome" | "playing" | "won" | "lost";

type ChatMessage = {
  id: string;
  sender: "detective" | "user";
  text: string;
  timestamp: Date;
  isVoice?: boolean;
  isLive?: boolean;
};

// ==================== FLOATING BLOB COMPONENT ====================

const BLOB_PARTICLES = [
  { left: 35, top: 30 }, { left: 60, top: 35 }, { left: 45, top: 65 },
  { left: 70, top: 55 }, { left: 30, top: 50 }, { left: 55, top: 40 },
  { left: 40, top: 70 }, { left: 65, top: 45 },
];

function FloatingBlob({
  isActive,
  volume,
  isSpeaking,
}: {
  isActive: boolean;
  volume: number;
  isSpeaking: boolean;
}) {
  const amplitude = useMotionValue(0);
  const amplitudeSpring = useSpring(amplitude, {
    stiffness: 180,
    damping: 25,
    mass: 0.5,
  });

  const blobScale = useTransform(amplitudeSpring, (v) => 0.85 + v * 0.5);
  const blobRotate = useTransform(amplitudeSpring, (v) => -15 + v * 40);
  const innerGlow = useTransform(amplitudeSpring, (v) =>
    Math.min(0.95, 0.4 + v * 0.6)
  );
  const outerScale = useTransform(amplitudeSpring, (v) => 1.2 + v * 0.6);
  const outerOpacity = useTransform(amplitudeSpring, (v) =>
    Math.min(0.7, 0.25 + v * 0.5)
  );
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
    const target = Math.min(1.2, baseLevel + speakingBoost + volumeBoost);
    amplitude.set(target);
  }, [isActive, volume, isSpeaking, amplitude]);

  return (
    <div className="relative flex items-center justify-center">
      {/* Outermost ring */}
      <motion.div
        className="absolute aspect-square w-[380px] rounded-full border border-violet-400/15"
        style={{ scale: ringScale, filter: "blur(2px)" }}
        animate={{
          rotate: [0, 360],
          opacity: [0.2, 0.4, 0.2],
        }}
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
          background:
            "radial-gradient(circle, rgba(167, 139, 250, 0.25) 0%, rgba(96, 165, 250, 0.2) 30%, rgba(244, 114, 182, 0.15) 50%, transparent 80%)",
          filter: "blur(40px)",
        }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Secondary glow ring */}
      <motion.div
        className="absolute aspect-square w-[320px] rounded-full"
        style={{
          opacity: innerGlow,
          filter: "blur(30px)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, -180, -360],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
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
        style={{
          scale: blobScale,
          rotate: blobRotate,
        }}
        animate={{
          borderRadius: [
            "42% 58% 55% 45%",
            "55% 45% 48% 52%",
            "48% 52% 58% 42%",
            "52% 48% 45% 55%",
            "42% 58% 55% 45%",
          ],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <motion.div
          className="absolute inset-0 rounded-[inherit]"
          style={{
            background: blobGradient,
            filter: "blur(20px)",
          }}
        />

        <motion.div
          className="absolute inset-[5%] rounded-[inherit]"
          style={{
            background: "radial-gradient(circle at 40% 35%, rgba(129, 230, 217, 0.75) 0%, rgba(167, 139, 250, 0.65) 45%, rgba(244, 114, 182, 0.55) 100%)",
            filter: "blur(15px)",
          }}
        />

        <motion.div
          className="absolute inset-[15%] rounded-[inherit]"
          style={{
            background: coreGradient,
            filter: "blur(15px)",
          }}
        />

        <motion.div
          className="absolute inset-0 rounded-[inherit]"
          style={{
            background:
              "radial-gradient(ellipse at 35% 25%, rgba(255,255,255,0.35) 0%, transparent 50%)",
            filter: "blur(10px)",
          }}
        />
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

// ==================== EQUALIZER WAVEFORM ====================

function EqualizerWaveform({ isSpeaking, isActive }: { isSpeaking: boolean; isActive: boolean }) {
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

// ==================== ANIMATED COUNTER ====================

function Counter({ value }: { value: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    const duration = 1.2;
    const totalFrames = Math.round(duration * 60);
    let frame = 0;

    const counterInterval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const current = Math.round(end * (progress * (2 - progress)));
      
      setCount(current);

      if (frame >= totalFrames) {
        setCount(end);
        clearInterval(counterInterval);
      }
    }, 1000 / 60);

    return () => clearInterval(counterInterval);
  }, [value]);

  return <span>{count.toLocaleString()}</span>;
}

// ==================== TIMER COMPONENT ====================

function InterrogationTimer({ elapsedTime }: { elapsedTime: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex size-12 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-950/20">
        <Clock className="size-5 text-cyan-400 animate-pulse" />
      </div>
      <div className="flex flex-col">
        <span className="font-mono text-2xl font-bold tracking-tight text-white leading-none">
          {String(Math.floor(elapsedTime / 60)).padStart(2, "0")}:
          {String(elapsedTime % 60).padStart(2, "0")}
        </span>
        <span className="text-[9px] uppercase tracking-widest text-cyan-400/70 font-semibold mt-1">
          Interrogation Time
        </span>
      </div>
    </div>
  );
}

// ==================== WELCOME SCREEN ====================

const PARTICLE_POSITIONS = [
  { left: 5, top: 10 }, { left: 15, top: 80 }, { left: 25, top: 30 },
  { left: 35, top: 60 }, { left: 45, top: 20 }, { left: 55, top: 90 },
  { left: 65, top: 40 }, { left: 75, top: 70 }, { left: 85, top: 15 },
  { left: 95, top: 50 }, { left: 10, top: 45 }, { left: 30, top: 85 },
  { left: 50, top: 25 }, { left: 70, top: 55 }, { left: 90, top: 35 },
];

function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6"
    >
      {/* Animated gradient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-black to-zinc-950" />
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(circle at 20% 20%, rgba(127, 29, 29, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(180, 83, 9, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 20%, rgba(127, 29, 29, 0.15) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(180, 83, 9, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 20%, rgba(127, 29, 29, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(180, 83, 9, 0.1) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(220, 38, 38, 0.08) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(251, 146, 60, 0.06) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.2, 0.4],
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      {/* Floating particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {PARTICLE_POSITIONS.map((pos, i) => (
          <motion.div
            key={i}
            className="absolute size-1.5 rounded-full bg-gradient-to-r from-red-500/40 to-orange-500/40"
            style={{
              left: `${pos.left}%`,
              top: `${pos.top}%`,
            }}
            animate={{
              y: [0, -60, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 6 + (i % 4),
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="relative z-10 flex max-w-xl flex-col items-center text-center"
      >
        {/* Logo */}
        <motion.div
          className="mb-8 flex items-center gap-6"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 10, delay: 0.3 }}
        >
          <div className="relative">
            <motion.div
              className="absolute -inset-6 rounded-full bg-red-500/20 blur-lg"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
            <AlertTriangle className="relative size-16 text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]" />
          </div>
          <div className="flex flex-col items-start">
            <h1 className="font-mono text-7xl font-black tracking-tighter text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              DoDo
            </h1>
            <motion.div
              className="h-1 w-full bg-gradient-to-r from-red-500 via-orange-500 to-transparent rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            />
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.div
          className="mb-6 flex items-center gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <span className="text-xl font-medium text-zinc-400">
            The Interactive Interrogation Game
          </span>
          <motion.span
            className="inline-block h-5 w-0.5 bg-red-500"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </motion.div>

        {/* Description */}
        <motion.div
          className="mb-8 max-w-sm space-y-2 text-zinc-400"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
        >
          <p className="text-base text-zinc-200">
            Accused of a crime you <span className="font-bold text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.2)]">did not commit</span>.
          </p>
          <p className="text-sm">
            Detective Grimstone is hostile and convinced you are guilty.
          </p>
          <p className="text-xs text-zinc-500 italic mt-3">
            Defend yourself using voice or text. Lower his suspicion to 0% before he locks you up.
          </p>
        </motion.div>

        {/* Start Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          <motion.div
            className="absolute -inset-1 rounded-xl bg-gradient-to-r from-red-600 via-orange-500 to-red-600 opacity-60 blur-md"
            animate={{
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <Button
            onClick={onStart}
            size="lg"
            className="relative h-16 gap-4 bg-gradient-to-r from-red-600 to-red-700 px-10 text-lg font-bold shadow-2xl transition-all hover:from-red-500 hover:to-red-600"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            >
              <Mic className="size-5" />
            </motion.div>
            Enter Interrogation Room
          </Button>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-12 grid grid-cols-3 gap-5 w-full"
        >
          {[
            {
              icon: MessageSquare,
              label: "Mic & Keyboard",
              desc: "Defend by voice or typing",
              color: "from-blue-500/10 to-violet-600/5",
            },
            {
              icon: Gauge,
              label: "Suspicion Meter",
              desc: "Keep suspicion below 100%",
              color: "from-red-500/10 to-orange-600/5",
            },
            {
              icon: Trophy,
              label: "Dismiss Charges",
              desc: "Outsmart the toxic detective",
              color: "from-emerald-500/10 to-green-600/5",
            },
          ].map(({ icon: Icon, label, desc, color }, index) => (
            <motion.div
              key={label}
              className="group flex flex-col items-center gap-3 p-4 rounded-xl border border-zinc-900 bg-zinc-950/20 backdrop-blur-sm"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 + index * 0.1, type: "spring", stiffness: 120, damping: 15 }}
              whileHover={{ y: -4, scale: 1.02, borderColor: "rgba(255,255,255,0.08)" }}
            >
              <div className={cn(
                "relative flex size-12 items-center justify-center rounded-xl border border-zinc-800 bg-gradient-to-br",
                color
              )}>
                <Icon className="size-6 text-zinc-400 group-hover:text-white transition-colors animate-pulse" />
              </div>
              <p className="text-xs font-bold text-zinc-300">{label}</p>
              <p className="text-[10px] text-zinc-500 text-center leading-normal">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ==================== RESULT SCREEN ====================

function ResultScreen({
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
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
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
            { left: 95, color: '#fbbf24', delay: 0.2, xOffset: 15 },
          ].map((particle, i) => (
            <motion.div
              key={i}
              className="absolute size-2 rounded-full"
              style={{
                left: `${particle.left}%`,
                backgroundColor: particle.color,
              }}
              initial={{ top: "-5%", rotate: 0 }}
              animate={{
                top: "105%",
                rotate: 360,
                x: [0, particle.xOffset, -particle.xOffset],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: particle.delay,
                ease: "linear",
              }}
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
            won
              ? "bg-gradient-to-br from-emerald-500/20 via-transparent to-cyan-500/20"
              : "bg-gradient-to-br from-red-500/20 via-transparent to-orange-500/20"
          )}
          animate={{ opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />

        {/* Status icon badge */}
        <div className="relative mx-auto mb-6 flex items-center justify-center">
          <motion.div
            className={cn(
              "absolute size-24 rounded-full",
              won ? "bg-emerald-500/10" : "bg-red-500/10"
            )}
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
              won
                ? "bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-emerald-500/30"
                : "bg-gradient-to-br from-red-500 to-orange-500 shadow-red-500/30"
            )}
          >
            {won ? (
              <Trophy className="size-11 text-white drop-shadow-md" />
            ) : (
              <Skull className="size-11 text-white drop-shadow-md" />
            )}
          </motion.div>
        </div>

        {/* Title */}
        <motion.h2
          className={cn(
            "mb-2 text-4xl font-black tracking-tight uppercase",
            won
              ? "text-emerald-400 drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              : "text-red-400 drop-shadow-[0_0_20px_rgba(239,68,68,0.3)]"
          )}
        >
          {won ? "Case Dismissed!" : "Verdict: Guilty!"}
        </motion.h2>

        {/* Subtitle description */}
        <p className="mb-6 text-sm text-zinc-400">
          {won
            ? "Detective Grimstone reluctantly admitted he has the wrong suspect."
            : "Your arguments crumbled, and you were locked up for the crime:"}
        </p>

        {/* Case Info Panel */}
        <div className={cn(
          "mb-6 rounded-xl border p-4 backdrop-blur text-left space-y-1.5",
          won
            ? "border-emerald-500/20 bg-emerald-950/10"
            : "border-red-500/20 bg-red-950/10"
        )}>
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
            <span className="text-xl font-bold text-zinc-300">
              {Math.floor(elapsedTime / 60)}m {elapsedTime % 60}s
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="relative">
          <motion.div
            className={cn(
              "absolute -inset-1 rounded-xl blur-md opacity-40",
              won ? "bg-emerald-500" : "bg-red-500"
            )}
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <Button
            onClick={onRestart}
            size="lg"
            className={cn(
              "relative w-full h-14 gap-3 px-8 text-base font-bold shadow-xl transition-transform hover:scale-[1.02]",
              won
                ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                : "bg-red-600 hover:bg-red-500 text-white"
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

// ==================== GAME SCREEN ====================

function GameScreen({
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
  const { client, connected, connect, disconnect, volume } =
    useLiveAPIContext();
  const [audioRecorder] = useState(() => new AudioRecorder());
  const [muted, setMuted] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showInnocenceBonus, setShowInnocenceBonus] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [textInput, setTextInput] = useState("");

  const transcriptRef = useRef("");
  const hasStartedRef = useRef(false);
  const hasSentAccusationRef = useRef(false);
  const firstTurnCompleteRef = useRef(false);
  const userSpokeRef = useRef(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Score live calculation
  const currentScore = Math.max(0, 2000 - (suspicion * 12) - (elapsedTime * 2));

  // Sync transcript ref
  useEffect(() => {
    transcriptRef.current = currentTranscript;
  }, [currentTranscript]);

  // Auto-scroll chat history
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, currentTranscript, isAiSpeaking]);

  // Handle AI Content and events
  useEffect(() => {
    if (!client) return;

    const handleContent = (content: unknown) => {
      const contentObj = content as {
        modelTurn?: { parts?: Array<{ text?: string }> };
      };
      if (contentObj?.modelTurn?.parts) {
        const text = contentObj.modelTurn.parts
          .filter((part) => typeof part.text === "string")
          .map((part) => part.text)
          .join("");
        if (text) {
          setCurrentTranscript((prev) => prev + text);
          setIsAiSpeaking(true);

          // Add/stream to chat history
          setChatHistory((prev) => {
            const lastMsg = prev[prev.length - 1];
            if (lastMsg && lastMsg.sender === "detective" && lastMsg.isLive) {
              return [
                ...prev.slice(0, -1),
                { ...lastMsg, text: lastMsg.text + text }
              ];
            } else {
              // Insert user voice marker before starting detective text if user had spoken
              let base = prev;
              if (userSpokeRef.current) {
                userSpokeRef.current = false;
                const lastNonVoice = prev[prev.length - 1];
                if (!lastNonVoice || lastNonVoice.sender !== "user") {
                  base = [
                    ...prev,
                    {
                      id: "voice-" + Math.random().toString(),
                      sender: "user",
                      text: "🎤 [Defended via Voice Chat]",
                      timestamp: new Date(),
                      isVoice: true
                    }
                  ];
                }
              }
              return [
                ...base,
                {
                  id: Math.random().toString(),
                  sender: "detective",
                  text: text,
                  timestamp: new Date(),
                  isLive: true
                }
              ];
            }
          });
        }
      }
    };

    const handleTurnComplete = () => {
      console.log("[GameScreen] Detective finished speaking");
      setIsAiSpeaking(false);

      if (!firstTurnCompleteRef.current) {
        firstTurnCompleteRef.current = true;
        onTimerStart();
      }

      // Check win condition transcripts
      const transcript = transcriptRef.current.toLowerCase();
      if (
        transcript.includes("free to go") ||
        transcript.includes("wrong person") ||
        transcript.includes("case dismissed") ||
        transcript.includes("let you go") ||
        transcript.includes("dropping the charges") ||
        transcript.includes("my mistake")
      ) {
        onWin();
        return;
      }

      // Check lose condition transcripts
      if (
        transcript.includes("going down") ||
        transcript.includes("going to jail") ||
        transcript.includes("lock you up") ||
        transcript.includes("guilty as charged") ||
        transcript.includes("worthless piece of shit") ||
        transcript.includes("sending you to prison")
      ) {
        onLose();
        return;
      }

      // Scan for Detective's irritation phrases indicating a good point
      const goodArgumentPhrases = [
        "oh please", "that's pathetic", "nice try", "you think that's clever",
        "how adorable", "spare me", "weak argument", "feeble attempt",
        "dammit", "wait", "doesn't add up", "maybe", "perhaps",
        "i suppose", "alright", "fine", "whatever", "i guess",
        "you got lucky", "this time", "for now", "i'll give you that",
        "point taken", "i see", "hmm", "well",
      ];
      const hasGoodArgument = goodArgumentPhrases.some(phrase =>
        transcript.includes(phrase)
      );

      const dismissivePhrases = [
        "pathetic", "weak", "feeble", "stupid", "beneath",
        "not smart enough", "not clever", "adorable", "spare me", "bullshit", "crap",
      ];
      const isDismissive = dismissivePhrases.some(phrase =>
        transcript.includes(phrase)
      );

      if (timerStarted) {
        if (hasGoodArgument || isDismissive) {
          setShowInnocenceBonus(true);
          onGoodArgument();
          setTimeout(() => setShowInnocenceBonus(false), 3000);
        } else {
          // Increment suspicion for normal turns where user doesn't challenge the AI
          onIncreaseImpatience(6);
        }
      }

      // Remove live typing cursor
      setChatHistory((prev) => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg && lastMsg.sender === "detective" && lastMsg.isLive) {
          return [
            ...prev.slice(0, -1),
            { ...lastMsg, isLive: false }
          ];
        }
        return prev;
      });

      setCurrentTranscript("");
    };

    const handleSetupComplete = () => {
      console.log("[GameScreen] Setup complete");
    };

    const handleError = (error: Error) => {
      console.error("[GameScreen] Client error:", error);
      setConnectionError(error.message);
      setIsConnecting(false);
    };

    const handleClose = (event: CloseEvent) => {
      setIsConnecting(false);
      if (event.reason) {
        setConnectionError(event.reason);
      } else if (event.code !== 1000) {
        setConnectionError(`Interrogation room closed (code: ${event.code})`);
      }
    };

    client.on("content", handleContent);
    client.on("turncomplete", handleTurnComplete);
    client.on("setupcomplete", handleSetupComplete);
    client.on("error", handleError);
    client.on("close", handleClose);

    return () => {
      client.off("content", handleContent);
      client.off("turncomplete", handleTurnComplete);
      client.off("setupcomplete", handleSetupComplete);
      client.off("error", handleError);
      client.off("close", handleClose);
    };
  }, [client, onWin, onLose, onTimerStart, onGoodArgument, onIncreaseImpatience, timerStarted]);

  // Handle audio recorder data ingestion
  useEffect(() => {
    const onData = (base64: string) => {
      userSpokeRef.current = true;
      client.sendRealtimeInput([
        {
          mimeType: "audio/pcm;rate=16000",
          data: base64,
        },
      ]);
    };

    if (connected && !muted && audioRecorder && timerStarted) {
      audioRecorder.on("data", onData).start();
    } else {
      audioRecorder.stop();
    }

    return () => {
      audioRecorder.off("data", onData);
    };
  }, [connected, client, muted, audioRecorder, timerStarted]);

  // Trigger setup/connect
  useEffect(() => {
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      setIsConnecting(true);

      const connectionTimer = setTimeout(async () => {
        try {
          await connect();
          setIsConnecting(false);
        } catch (error) {
          setConnectionError(
            error instanceof Error ? error.message : "Failed to connect to room"
          );
          setIsConnecting(false);
        }
      }, 500);

      return () => clearTimeout(connectionTimer);
    }
  }, [connect]);

  useEffect(() => {
    if (connected) {
      setIsConnecting(false);
      setConnectionError(null);
    }
  }, [connected]);

  // Initial prompt trigger
  useEffect(() => {
    if (connected && crime && !hasSentAccusationRef.current) {
      hasSentAccusationRef.current = true;
      setIsAiSpeaking(true);
      const timer = setTimeout(() => {
        try {
          client.send(
            {
              text: `Accused of: "${crime}". Accuse them NOW!`,
            },
            true
          );
        } catch (error) {
          setConnectionError("Failed to initiate interrogation");
          setIsAiSpeaking(false);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [connected, crime, client]);

  // Cleanup websocket
  useEffect(() => {
    return () => {
      audioRecorder.stop();
      disconnect();
    };
  }, [audioRecorder, disconnect]);

  // Text alibi submission
  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = textInput.trim();
    if (!trimmed || !connected || !client) return;

    client.send({ text: trimmed }, true);

    setChatHistory((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        sender: "user",
        text: trimmed,
        timestamp: new Date(),
        isVoice: false
      }
    ]);
    setTextInput("");
  };

  // Impatience mood calculation
  const getDetectiveMood = () => {
    if (suspicion >= 85) return "Furious 😡";
    if (suspicion >= 65) return "Hostile 😠";
    if (suspicion >= 45) return "Suspicious 🤨";
    if (suspicion >= 20) return "Impatient 😐";
    return "Flustered 😳";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative flex min-h-screen flex-col overflow-hidden bg-black font-sans"
    >
      {/* Background elements */}
      <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center opacity-30 blur-2xl">
        <FloatingBlob
          isActive={connected}
          volume={volume}
          isSpeaking={isAiSpeaking}
        />
      </div>

      <div className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.6)_95%)]" />

      {/* Header */}
      <header className="relative z-20 border-b border-zinc-900 bg-zinc-950/60 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <motion.div
                className="absolute -inset-2 rounded-full bg-red-500/10 blur-md"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
              <AlertTriangle className="relative size-6 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
            </div>
            <span className="font-mono text-xl font-bold tracking-tighter text-white">DoDo</span>
          </div>

          <InterrogationTimer elapsedTime={elapsedTime} />
        </div>

        {/* Accusation bar */}
        <div className="border-t border-zinc-900 bg-zinc-950/20 px-6 py-2.5">
          <p className="mx-auto max-w-6xl text-center text-xs">
            <span className="font-black text-red-500 uppercase tracking-widest">Charges:</span>
            <span className="ml-2 font-medium text-zinc-300">"{crime}"</span>
          </p>
        </div>
      </header>

      {/* Flashing Innocence Gain notification */}
      <AnimatePresence>
        {showInnocenceBonus && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed left-1/2 top-28 z-50 -translate-x-1/2"
          >
            <div className="rounded-xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/95 to-zinc-950/95 px-6 py-3 shadow-xl shadow-emerald-500/10 backdrop-blur-xl">
              <div className="flex items-center gap-2.5">
                <Zap className="size-5 text-emerald-400 animate-bounce" />
                <div>
                  <p className="text-xs font-bold text-emerald-400 uppercase tracking-wide">Innocence Gain</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">Suspicion Level Decreased by 15%</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Layout Content */}
      <main className="relative z-10 flex flex-1 flex-col lg:flex-row gap-6 px-6 py-6 max-w-6xl mx-auto w-full overflow-hidden">
        {/* Left Side: Interrogation Chat log */}
        <div className="flex flex-1 flex-col h-[calc(100vh-220px)] lg:h-[calc(100vh-200px)] min-h-[350px]">
          {/* Chat bubble feed */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-3 pb-4 scrollbar border border-zinc-900 bg-zinc-950/40 rounded-t-xl p-5 shadow-inner backdrop-blur-sm">
            {chatHistory.length === 0 && !isConnecting && (
              <div className="flex h-full flex-col items-center justify-center text-center text-zinc-500 space-y-3">
                <MessageSquare className="size-10 text-zinc-700 animate-pulse" />
                <div>
                  <p className="font-semibold text-zinc-400 text-sm">Interrogation Room Feed Active</p>
                  <p className="text-xs max-w-xs mt-1">Wait for Detective Grimstone to speak. When he finishes, speak clearly or type your alibi.</p>
                </div>
              </div>
            )}

            {isConnecting && (
              <div className="flex h-full flex-col items-center justify-center text-center text-amber-500 space-y-3 animate-pulse">
                <div className="size-8 rounded-full border-2 border-amber-500/30 border-t-amber-500 animate-spin" />
                <p className="text-xs font-bold tracking-widest uppercase">Connecting Feed...</p>
              </div>
            )}

            {chatHistory.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
                className={cn(
                  "flex w-full flex-col",
                  msg.sender === "detective" ? "items-start" : "items-end"
                )}
              >
                <div className="flex items-center gap-2 mb-1 px-1">
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-wider",
                    msg.sender === "detective" ? "text-violet-400" : "text-cyan-400"
                  )}>
                    {msg.sender === "detective" ? "Detective Grimstone" : "You (Suspect)"}
                  </span>
                </div>
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-md border",
                    msg.sender === "detective"
                      ? "bg-gradient-to-br from-violet-950/40 to-zinc-950/80 text-zinc-200 border-violet-900/20"
                      : msg.isVoice
                        ? "bg-gradient-to-br from-cyan-950/20 to-zinc-950/50 text-cyan-300/80 border-cyan-800/10 italic"
                        : "bg-cyan-950/30 text-zinc-100 border-cyan-800/20"
                  )}
                >
                  {msg.text}
                  {msg.isLive && (
                    <motion.span
                      className="inline-block ml-1 h-3 w-1.5 bg-violet-400"
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    />
                  )}
                </div>
              </motion.div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Chat text bar + Mic / Control Tray */}
          <div className="bg-zinc-950/70 border-x border-b border-zinc-900 p-4 rounded-b-xl backdrop-blur-md">
            <form onSubmit={handleSendText} className="flex gap-2">
              <Input
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder={
                  !connected
                    ? "Establish connection first..."
                    : isAiSpeaking
                      ? "Wait for the detective to finish speaking..."
                      : "Type your argument/alibi here..."
                }
                disabled={!connected || isAiSpeaking}
                className="bg-black/50 border-zinc-850 text-white placeholder:text-zinc-600 focus-visible:ring-violet-600/30 font-sans"
              />
              <Button
                type="submit"
                disabled={!connected || !textInput.trim() || isAiSpeaking}
                className="bg-violet-600 hover:bg-violet-500 text-white px-5"
              >
                <Send className="size-4" />
              </Button>
            </form>

            <div className="mt-3 flex items-center justify-between border-t border-zinc-900 pt-3">
              <div className="flex items-center gap-2">
                <Button
                  variant={muted ? "outline" : "destructive"}
                  size="sm"
                  onClick={() => setMuted(!muted)}
                  disabled={!connected}
                  className={cn(
                    "h-9 px-3 text-xs gap-1.5 font-bold transition-all",
                    muted
                      ? "border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800"
                      : "bg-red-950/30 border-red-500/20 text-red-400 hover:bg-red-900/30"
                  )}
                >
                  {muted ? <MicOff className="size-3.5" /> : <Mic className="size-3.5" />}
                  <span>{muted ? "Unmute Mic" : "Mute Mic"}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={connected ? disconnect : connect}
                  className={cn(
                    "h-9 px-3 text-xs gap-1.5 font-bold border",
                    connected
                      ? "border-emerald-500/20 bg-emerald-950/10 text-emerald-400 hover:bg-emerald-900/20"
                      : "border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800"
                  )}
                >
                  {connected ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
                  <span>{connected ? "Disconnect" : "Reconnect Feed"}</span>
                </Button>
              </div>

              <span className={cn(
                "text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5",
                connectionError
                  ? "text-red-400"
                  : !connected
                    ? "text-zinc-600"
                    : isAiSpeaking
                      ? "text-violet-400"
                      : muted
                        ? "text-orange-400"
                        : "text-emerald-400"
              )}>
                {connectionError ? (
                  <>
                    <ShieldAlert className="size-3.5" />
                    <span>Disconnected: Error</span>
                  </>
                ) : !connected ? (
                  <>
                    <Info className="size-3.5" />
                    <span>Room Offline</span>
                  </>
                ) : isAiSpeaking ? (
                  <>
                    <span className="size-1.5 rounded-full bg-violet-400 animate-ping" />
                    <span>Detective Speaking</span>
                  </>
                ) : muted ? (
                  <>
                    <MicOff className="size-3.5" />
                    <span>Voice Input Paused</span>
                  </>
                ) : (
                  <>
                    <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Mic Listening</span>
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: HUD Info Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-72 flex flex-col gap-4"
        >
          {/* Suspicion Level Gauge */}
          <motion.div
            key={suspicion}
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 0.3 }}
            className="rounded-xl border border-zinc-900 bg-zinc-950/30 p-5 backdrop-blur-sm"
          >
            <div className="mb-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gauge className="size-4.5 text-zinc-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Suspicion Level</h3>
              </div>
              <span className={cn(
                "text-xs font-black px-2 py-0.5 rounded-md font-mono",
                suspicion >= 80 ? "bg-red-950 text-red-400" :
                suspicion >= 50 ? "bg-amber-950 text-amber-400" :
                "bg-emerald-950 text-emerald-400"
              )}>
                {suspicion}%
              </span>
            </div>

            {/* Horizontal meter */}
            <div className="h-3 w-full rounded-full bg-zinc-950 overflow-hidden border border-zinc-900 p-0.5">
              <motion.div
                className={cn(
                  "h-full rounded-full bg-gradient-to-r",
                  suspicion >= 75 ? "from-amber-500 to-red-500" :
                  suspicion >= 40 ? "from-emerald-500 to-amber-500" :
                  "from-cyan-500 to-emerald-500"
                )}
                initial={{ width: "75%" }}
                animate={{ width: `${suspicion}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>

            <div className="mt-2.5 flex items-center justify-between text-[9px] text-zinc-500 uppercase tracking-widest font-semibold">
              <span>Innocent</span>
              <span>Jail Time</span>
            </div>
          </motion.div>

          {/* Interrogation Room Status Card */}
          <div className="rounded-xl border border-zinc-900 bg-zinc-950/30 p-5 backdrop-blur-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Case Report</h3>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs border-b border-zinc-900/50 pb-2">
                <span className="text-zinc-500">Detective Mood</span>
                <span className={cn(
                  "font-bold",
                  suspicion >= 85 ? "text-red-400 animate-pulse" :
                  suspicion >= 65 ? "text-red-300" :
                  suspicion >= 45 ? "text-amber-400" :
                  "text-emerald-400"
                )}>
                  {getDetectiveMood()}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">Score Rating</span>
                <span className="font-bold text-cyan-400 font-mono">
                  {currentScore.toLocaleString()} pts
                </span>
              </div>
            </div>
          </div>

          {/* Smaller interactive Voice waveform card */}
          <div className="flex-1 rounded-xl border border-zinc-900 bg-zinc-950/10 p-5 flex flex-col justify-between items-center backdrop-blur-sm overflow-hidden min-h-[180px]">
            <div className="w-full flex items-center gap-2 mb-2 self-start">
              <span className={cn(
                "size-2 rounded-full bg-cyan-500/85",
                connected && "animate-pulse"
              )} />
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Voice Analyzer</h3>
            </div>
            
            <EqualizerWaveform isSpeaking={isAiSpeaking} isActive={connected && !muted} />
            
            <div className="scale-35 opacity-30 -my-6">
              <FloatingBlob
                isActive={connected}
                volume={volume}
                isSpeaking={isAiSpeaking}
              />
            </div>
          </div>
          </div>
        </motion.div>
      </main>
    </motion.div>
  );
}

// ==================== MAIN GAME APP ====================

function GameApp() {
  const [phase, setPhase] = useState<GamePhase>("welcome");
  const [crime, setCrime] = useState("");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [suspicion, setSuspicion] = useState(75);
  const [timerStarted, setTimerStarted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { setConfig, disconnect, connected } = useLiveAPIContext();

  const startGame = useCallback(() => {
    const randomCrime = CRIMES[Math.floor(Math.random() * CRIMES.length)];
    console.log("[GameApp] Starting game with crime:", randomCrime);
    setCrime(randomCrime);
    setElapsedTime(0);
    setSuspicion(75); // starts at 75%
    setTimerStarted(false);

    const gameConfig = {
      model: "models/gemini-2.0-flash-live-001",
      systemInstruction: {
        parts: [{ text: DETECTIVE_SYSTEM_PROMPT }],
      },
      generationConfig: {
        responseModalities: "audio" as const,
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: "Charon",
            },
          },
        },
      },
    };
    setConfig(gameConfig);
    setPhase("playing");
  }, [setConfig]);

  // Stopwatch ticking logic
  useEffect(() => {
    if (phase === "playing" && timerStarted) {
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [phase, timerStarted]);

  const handleTimerStart = useCallback(() => {
    setTimerStarted(true);
  }, []);

  const handleLose = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setPhase("lost");
  }, []);

  const handleWin = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setPhase("won");
  }, []);

  const handleGoodArgument = useCallback(() => {
    setSuspicion((prev) => Math.max(0, prev - 15));
  }, []);

  const handleIncreaseImpatience = useCallback((amount: number) => {
    setSuspicion((prev) => Math.min(100, prev + amount));
  }, []);

  const handleRestart = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (connected) {
      disconnect();
    }
    setPhase("welcome");
    setCrime("");
    setElapsedTime(0);
    setSuspicion(75);
    setTimerStarted(false);
  }, [connected, disconnect]);

  // Compute final score
  const finalScore = Math.max(0, 2000 - (suspicion * 12) - (elapsedTime * 2));

  // Listen to suspicion triggers
  useEffect(() => {
    if (phase === "playing") {
      if (suspicion >= 100) {
        handleLose();
      } else if (suspicion <= 0) {
        handleWin();
      }
    }
  }, [suspicion, phase, handleWin, handleLose]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-violet-950 selection:text-white">
      <AnimatePresence mode="wait">
        {phase === "welcome" && (
          <WelcomeScreen key="welcome" onStart={startGame} />
        )}

        {phase === "playing" && (
          <GameScreen
            key="playing"
            crime={crime}
            elapsedTime={elapsedTime}
            suspicion={suspicion}
            onWin={handleWin}
            onLose={handleLose}
            onTimerStart={handleTimerStart}
            onGoodArgument={handleGoodArgument}
            onIncreaseImpatience={handleIncreaseImpatience}
            timerStarted={timerStarted}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(phase === "won" || phase === "lost") && (
          <ResultScreen
            key="result"
            won={phase === "won"}
            crime={crime}
            score={finalScore}
            elapsedTime={elapsedTime}
            onRestart={handleRestart}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ==================== API KEY MODAL ====================

function ApiKeyModal({ onApiKeySet }: { onApiKeySet: (apiKey: string) => void }) {
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedKey = apiKey.trim();

    if (!trimmedKey) {
      setError("Please enter your API key");
      return;
    }

    setError("");
    onApiKeySet(trimmedKey);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm px-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md rounded-2xl border border-zinc-900 bg-zinc-950 p-8 shadow-2xl backdrop-blur-xl"
      >
        <div className="mb-6 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-violet-950/40 p-4 border border-violet-500/20">
              <AlertTriangle className="size-8 text-violet-400" />
            </div>
          </div>
          <h2 className="mb-2 text-2xl font-bold text-white tracking-tight">API Key Required</h2>
          <p className="text-sm text-zinc-500">
            Enter your Google Gemini API key to enter the room
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="api-key" className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-400">
              Google Gemini API Key
            </label>
            <Input
              id="api-key"
              type="password"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setError("");
              }}
              placeholder="Enter your API key..."
              className={cn(
                "w-full bg-black/40 border-zinc-800 text-white placeholder:text-zinc-700",
                error && "border-red-500/50 focus:border-red-500"
              )}
            />
            {error && (
              <p className="mt-2 text-xs text-red-400 font-medium">{error}</p>
            )}
            <p className="mt-2 text-[10px] text-zinc-600">
              Your key is only saved in memory and sent directly to Google AI servers. Get one from{" "}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-400 hover:text-violet-300 underline"
              >
                Google AI Studio
              </a>
            </p>
          </div>

          <Button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold h-12"
          >
            Connect to Interrogation Room
          </Button>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ==================== ENTRYPOINT ====================

export default function GamePage() {
  const [apiKey, setApiKey] = useState<string | null>(null);

  const host = "generativelanguage.googleapis.com";
  const uri = `wss://${host}/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent`;

  if (!apiKey) {
    return <ApiKeyModal onApiKeySet={setApiKey} />;
  }

  return (
    <LiveAPIProvider url={uri} apiKey={apiKey}>
      <GameApp />
    </LiveAPIProvider>
  );
}
