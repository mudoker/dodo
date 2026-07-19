# DoDo 🕵️‍♂️ — The Interactive Interrogation Game

DoDo is an immersive, noir-themed interrogation game powered by the **Google Gemini Multimodal Live API** over WebSockets. You play as a suspect accused of an absurd, chaotic office or tech crime that you did not commit. Your goal is to face off against the toxic and relentless **Detective Grimstone** and convince him of your innocence.

---

## 🎮 Game Features

- **No Hard Session Time Limits**: The arbitrary 2-minute countdown timer is gone. Interrogations are now fully interactive, open-ended, and tracked by an active stopwatch.
- **Suspicion Level Meter**: Grimstone's suspicion level starts at **75%**. 
  - **Standard Responses**: Slowly raise the detective's suspicion (+6% per turn) as he grows impatient.
  - **Good Points / Alibis**: Challenging him or making solid points reduces his suspicion (-15% per point).
  - **Win Condition**: Reduce his suspicion to **0%** to have the case dismissed!
  - **Lose Condition**: Let suspicion reach **100%** and you go straight to jail.
- **Dynamic Interrogation Log**: A scrollable messaging feed that maintains a history of the entire dialogue. Keep track of what Detective Grimstone said, and see your own voice/text defenses in context.
- **Voice & Text Integration**: Speak directly into your microphone to defend yourself, or type your alibis in the interactive chat box.
- **Impatience Mood HUD**: Watch Grimstone's mood update live between *Flustered 😳*, *Impatient 😐*, *Suspicious 🤨*, *Hostile 😠*, and *Furious 😡* based on his suspicion.
- **Competitive Rating System**: Earn high scores by resolving the case quickly and keeping final suspicion levels low.

---

## 🛠️ Technical Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19, TypeScript)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/) for fluid ambient animations
- **AI Core**: Google Gemini Multimodal Live API (`wss://generativelanguage.googleapis.com`) using the `gemini-2.0-flash-live-001` model
- **Audio pipeline**: Bidirectional audio streaming over WebSockets:
  - **Input**: PCM 16-bit, 16kHz audio captured from the player's microphone
  - **Output**: Real-time voice response streamed via Web Audio API using the deep, dramatic prebuilt "Charon" voice
  - **VU Meter**: A custom Audio Worklet tracking and animating ambient glowing particles in real-time

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have [Bun](https://bun.sh/) installed.

### 2. Installation
Install project dependencies:
```bash
bun install
```

### 3. Run the Development Server
Start the Next.js development server:
```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to start playing.

### 4. API Key Setup
When the application launches, enter your Google Gemini API key (starting with `AIza`) in the secure entry modal. You can obtain a free API key at [Google AI Studio](https://aistudio.google.com/app/apikey).

---

## 👮‍♂️ Interrogation Rules
1. **Be Assertive**: Grimstone will mock you and shout at you. Stand your ground!
2. **Expose Flaws**: The crimes are ridiculous. Use logical flaws in the accusation to challenge his theories.
3. **Mute if Needed**: You can mute your microphone at any time using the control bar to gather your thoughts or switch to typing text.
