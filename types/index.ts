import { z } from "zod";

export const moodSchema = z.object({
    id: z.number().int().positive().min(1),
    type: z.string(),
    emoji: z.string().emoji(),
    createdAt: z.optional(z.number().int()),
    note: z.string().nullable(),
    userID: z.string()
});

export type Mood = z.infer<typeof moodSchema>;

export const createPostSchema = moodSchema.omit({ id: true });

export const fakeMoods: Mood[] = [
    {
        id: 1,
        type: "happy",
        emoji: "😊",
        note: "Had a great day at the park.",
        userID: "1"
    },
    {
        id: 2,
        type: "sad",
        emoji: "😢",

        note: "Lost my wallet.",
        userID: "2"
    },
    {
        id: 3,
        type: "excited",
        emoji: "😃",

        note: "Got a new job!",
        userID: "3"
    },
    {
        id: 4,
        type: "angry",
        emoji: "😡",

        note: "Stuck in traffic for hours.",
        userID: "4"
    },
    {
        id: 5,
        type: "relaxed",
        emoji: "😌",

        note: "Spent the day at the spa.",
        userID: "5"
    },
    {
        id: 6,
        type: "anxious",
        emoji: "😰",

        note: "Had a big presentation at work.",
        userID: "6"
    },
    {
        id: 7,
        type: "bored",
        emoji: "😐",

        note: "Nothing exciting happened today.",
        userID: "7"
    },
    {
        id: 8,
        type: "grateful",
        emoji: "🙏",

        note: "Thankful for my supportive friends.",
        userID: "8"
    },
    {
        id: 9,
        type: "frustrated",
        emoji: "😤",

        note: "Couldn't solve a problem at work.",
        userID: "9"
    },
    {
        id: 10,
        type: "content",
        emoji: "🙂",

        note: "Had a peaceful day at home.",
        userID: "10"
    }
]