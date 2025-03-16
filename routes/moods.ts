import {
    Hono
} from "hono";

import { zValidator } from '@hono/zod-validator'

import db from '../db'
import { moods as moodsTable } from '../db/schema/moods'
import { desc, eq } from "drizzle-orm";
import { createPostSchema, fakeMoods } from "../types";

export const moodsRoute = new Hono()

moodsRoute.get("/", context => {

    const moods = db.select().from(moodsTable).orderBy(desc(moodsTable.createdAt)).limit(100);

    return context.json({ moods: moods });
})

moodsRoute.post("/", zValidator("json", createPostSchema), async context => {

    const mood = await context.req.valid("json");
    fakeMoods.push({ ...mood, id: fakeMoods.length + 1 });
    context.status(201);
    return context.json(mood);
})

moodsRoute.get("/:id{[0-9]+}", context => {
    const id = Number.parseInt(context.req.param("id"));
    const mood = fakeMoods.find(mood => mood.id === id);
    if (!mood) {
        return context.notFound();
    }
    return context.json({ mood });
}
)