import { Hono
} from "hono";

import { z } from "zod";
import { zValidator } from '@hono/zod-validator'


const moodSchema = z.object({   
    id: z.number().int().positive().min(1),
    level: z.string(),
    emoji: z.string().emoji(),
    date: z.string(),
    notes: z.string().optional()
});

type Mood = z.infer<typeof moodSchema>;

const createPostSchema = moodSchema.omit({id: true});

const fakeMoods: Mood[] = [
    {
        id: 1,
        level: "happy",
        emoji: "😊",
        date: "2023-10-01",
        notes: "Had a great day at the park."
    },
    {
        id: 2,
        level: "sad",
        emoji: "😢",
        date: "2023-10-02",
        notes: "Lost my wallet."
    },
    {
        id: 3,
        level: "excited",
        emoji: "😃",
        date: "2023-10-03",
        notes: "Got a new job!"
    },
    {
        id: 4,
        level: "angry",
        emoji: "😡",
        date: "2023-10-04",
        notes: "Stuck in traffic for hours."
    }
]


 
export const moodsRoute = new Hono()
    .get("/", context => {
        return context.json({moods: fakeMoods});
    })
    .post("/", zValidator("json", createPostSchema), async context => {

        const mood = await context.req.valid("json");
        fakeMoods.push({...mood, id: fakeMoods.length + 1});
        context.status(201);
        return context.json(mood);
    })
    .get("/:id{[0-9]+}", context => {
        const id = Number.parseInt(context.req.param("id"));
        const mood = fakeMoods.find(mood => mood.id === id);
        if (!mood) {
            return context.notFound();
        }
        return context.json({mood});
    }   
    )
