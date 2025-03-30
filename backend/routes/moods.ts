import { zValidator } from "@hono/zod-validator";
import { desc, eq } from "drizzle-orm";
import {
  Hono,
} from "hono";
import { z } from "zod";

import db from "../db";
import { insertMoodsSchema, moods as moodsTable } from "../db/schema/moods";
import { createPostSchema } from "../types";

export const moodsRoute = new Hono()

  .get("/", zValidator("query", z.object({
    itemlimit: z.string().optional(),
  })), async (context) => {
    const query = context.req.valid("query");
    const moods = await db.select().from(moodsTable).orderBy(desc(moodsTable.createdAt)).limit(Number.parseInt(query.itemlimit ?? "100"));

    return context.json({ moods });
  })

  .post("/", zValidator("json", createPostSchema), async (context) => {
    const mood = context.req.valid("json");
    const validatedMood = insertMoodsSchema.parse({
      ...mood,
    });

    const result = await db
      .insert(moodsTable)
      .values(validatedMood)
      .returning()
      .then(res => res[0]);

    context.status(201);
    return context.json(result);
  })

  .get("/:id{[0-9]+}", async (context) => {
    const id = Number.parseInt(context.req.param("id"));
    const mood = await db
      .select()
      .from(moodsTable)
      .where(eq(moodsTable.id, id))
      .then(res => res[0]);

    if (!mood) {
      return context.notFound();
    }

    return context.json({ mood });
  })

  .delete("/:id{[0-9]+}", async (context) => {
    const id = Number.parseInt(context.req.param("id"));
    // const user = context.var.user;

    const mood = await db
      .delete(moodsTable)
      .where(eq(moodsTable.id, id))
      .returning()
      .then(res => res[0]);

    if (!mood) {
      return context.notFound();
    }

    return context.json({ mood });
  });
