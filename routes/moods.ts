import {
    Hono
} from "hono";

import { zValidator } from '@hono/zod-validator'

import db from '../db'
import { insertMoodsSchema, moods as moodsTable } from '../db/schema/moods'
import { desc, eq } from "drizzle-orm";
import { createPostSchema } from "../types";

export const moodsRoute = new Hono()

moodsRoute.get("/", async context => {

    const moods = await db.select().from(moodsTable).orderBy(desc(moodsTable.createdAt)).limit(100);

    return context.json({ moods: moods });
})

moodsRoute.post("/", zValidator("json", createPostSchema), async context => {

    const mood = context.req.valid("json");
    const validatedMood = insertMoodsSchema.parse({
        ...mood,
    });

    const result = await db
        .insert(moodsTable)
        .values(validatedMood)
        .returning()
        .then((res) => res[0]);


    context.status(201);
    return context.json(result);
})

moodsRoute.get("/:id{[0-9]+}", async context => {
    const id = Number.parseInt(context.req.param("id"));
    const mood = await db
        .select()
        .from(moodsTable)
        .where(eq(moodsTable.id, id))
        .then((res) => res[0]);

    if (!mood) {
        return context.notFound();
    }

    return context.json({ mood });
}
)

moodsRoute.delete("/:id{[0-9]+}", async context => {
    const id = Number.parseInt(context.req.param("id"));
    //const user = context.var.user;

    const mood = await db
        .delete(moodsTable)
        .where(eq(moodsTable.id, id))
        .returning()
        .then((res) => res[0]);

    if (!mood) {
        return context.notFound();
    }

    return context.json({ mood: mood });
}
)

