import { z } from "zod";

export const moodSchema = z.object({
    id: z.number().int().positive().min(1),
    level: z.string(),
    emoji: z.string().emoji(),
    createdAt: z.string().date(),
    note: z.string().nullable(),
    userID: z.string()
});

export type Mood = z.infer<typeof moodSchema>;

export const createPostSchema = moodSchema.omit({ id: true });

export const fakeMoods: Mood[] = [
    {
        id: 1,
        level: "happy",
        emoji: "😊",
        createdAt: "2023-10-01",
        note: "Had a great day at the park.",
        userID: "1"
    },
    {
        id: 2,
        level: "sad",
        emoji: "😢",
        createdAt: "2023-10-02",
        note: "Lost my wallet.",
        userID: "2"
    },
    {
        id: 3,
        level: "excited",
        emoji: "😃",
        createdAt: "2023-10-03",
        note: "Got a new job!",
        userID: "3"
    },
    {
        id: 4,
        level: "angry",
        emoji: "😡",
        createdAt: "2023-10-04",
        note: "Stuck in traffic for hours.",
        userID: "4"
    },
    {
        id: 5,
        level: "relaxed",
        emoji: "😌",
        createdAt: "2023-10-05",
        note: "Spent the day at the spa.",
        userID: "5"
    },
    {
        id: 6,
        level: "anxious",
        emoji: "😰",
        createdAt: "2023-10-06",
        note: "Had a big presentation at work.",
        userID: "6"
    },
    {
        id: 7,
        level: "bored",
        emoji: "😐",
        createdAt: "2023-10-07",
        note: "Nothing exciting happened today.",
        userID: "7"
    },
    {
        id: 8,
        level: "grateful",
        emoji: "🙏",
        createdAt: "2023-10-08",
        note: "Thankful for my supportive friends.",
        userID: "8"
    },
    {
        id: 9,
        level: "frustrated",
        emoji: "😤",
        createdAt: "2023-10-09",
        note: "Couldn't solve a problem at work.",
        userID: "9"
    },
    {
        id: 10,
        level: "content",
        emoji: "🙂",
        createdAt: "2023-10-10",
        note: "Had a peaceful day at home.",
        userID: "10"
    }
]