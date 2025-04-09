export type MoodEntry = {
  id: number;
  userID: string;
  type: string;
  emoji: string;
  note: string | null;
  createdAt: string | null;
  newest: boolean;
};

export const MOOD_TYPES = [
  { type: "happy", emoji: "😊" },
  { type: "excited", emoji: "🎉" },
  { type: "relaxed", emoji: "😌" },
  { type: "sad", emoji: "😢" },
  { type: "angry", emoji: "😠" },
  { type: "tired", emoji: "😴" },
] as const;

export type UserType = {
  picture: null | string;
  family_name: string;
  given_name: string;
  email: string;
  id: string;
};

export type UpdateMood = Omit<MoodEntry, "id" | "createdAt" | "userID" | "newest">;
