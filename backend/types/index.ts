import { z } from "zod";

export const moodSchema = z.object({
  id: z.number().int().positive().min(1),
  type: z.string(),
  emoji: z.string().emoji(),
  createdAt: z.optional(z.number().int()),
  note: z.string().nullable(),
  userID: z.string(),
});

export type Mood = z.infer<typeof moodSchema>;

export const createPostSchema = moodSchema.omit({ id: true });

export const fakeMoods: Mood[] = [
  {
    id: 1,
    type: "happy",
    emoji: "😊",
    createdAt: undefined,
    note: "Had a great day at the park.",
    userID: "1",
  },
  {
    id: 2,
    type: "sad",
    emoji: "😢",
    createdAt: undefined,
    note: "Lost my wallet.",
    userID: "2",
  },
  {
    id: 3,
    type: "excited",
    createdAt: undefined,
    emoji: "😃",
    note: "Got a new job!",
    userID: "3",
  },
  {
    id: 4,
    type: "angry",
    createdAt: undefined,
    emoji: "😡",
    note: "Stuck in traffic for hours.",
    userID: "4",
  },
  {
    id: 5,
    type: "relaxed",
    emoji: "😌",
    createdAt: undefined,
    note: "Spent the day at the spa.",
    userID: "5",
  },
  {
    id: 6,
    type: "anxious",
    emoji: "😰",
    createdAt: undefined,
    note: "Had a big presentation at work.",
    userID: "6",
  },
  {
    id: 7,
    type: "bored",
    emoji: "😐",
    createdAt: undefined,
    note: "Nothing exciting happened today.",
    userID: "7",
  },
  {
    id: 8,
    type: "grateful",
    emoji: "🙏",
    createdAt: undefined,
    note: "Thankful for my supportive friends.",
    userID: "8",
  },
  {
    id: 9,
    type: "frustrated",
    emoji: "😤",
    createdAt: undefined,
    note: "Couldn't solve a problem at work.",
    userID: "9",
  },
  {
    id: 10,
    type: "content",
    emoji: "🙂",
    createdAt: undefined,
    note: "Had a peaceful day at home.",
    userID: "10",
  },
];
