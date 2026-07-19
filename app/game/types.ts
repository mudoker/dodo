export type GamePhase = "welcome" | "playing" | "won" | "lost";

export type ChatMessage = {
  id: string;
  sender: "detective" | "user";
  text: string;
  timestamp: Date;
  isVoice?: boolean;
  isLive?: boolean;
};
