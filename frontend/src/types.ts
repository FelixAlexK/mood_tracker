export type MoodEntry = {
  id: number;
  user_id: string;
  type: string;
  emoji: string;
  note: string | null;
  created_at: string | null;
  newest: boolean;
};

export const MOOD_TYPES = [
  { type: "happy", emoji: "😊" },
  { type: "excited", emoji: "🎉" },
  { type: "relaxed", emoji: "😌" },
  { type: "sad", emoji: "😢" },
  { type: "angry", emoji: "😠" },
  { type: "tired", emoji: "😴" },
  { type: "stressed", emoji: "😫" },
  { type: "confident", emoji: "😎" },
  { type: "grateful", emoji: "🙏" },
  { type: "anxious", emoji: "😟" },
  { type: "lonely", emoji: "🥺" },
  { type: "hopeful", emoji: "🤞" },
  { type: "curious", emoji: "🤔" },
  { type: "proud", emoji: "🥰" },
  { type: "bored", emoji: "😐" },
  { type: "surprised", emoji: "😲" },
  { type: "in-love", emoji: "😍" },
  { type: "fearful", emoji: "😨" },
  { type: "determined", emoji: "💪" },
  { type: "embarrassed", emoji: "😳" },
] as const;

export type UserType = {
  picture: null | string;
  family_name: string;
  given_name: string;
  email: string;
  id: string;
};

export type UpdateMood = Omit<MoodEntry, "id" | "created_at" | "user_id" | "newest">;
