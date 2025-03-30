export type MoodEntry = {
  id: number;
  userID: string;
  type: string;
  emoji: string;
  note: string | null;
  createdAt: string | null;
};

export const MOOD_TYPES = [
  { type: "happy", emoji: "😊" },
  { type: "excited", emoji: "🎉" },
  { type: "relaxed", emoji: "😌" },
  { type: "sad", emoji: "😢" },
  { type: "angry", emoji: "😠" },
  { type: "tired", emoji: "😴" },
] as const;
