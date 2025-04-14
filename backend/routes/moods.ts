import { zValidator } from "@hono/zod-validator";
import { and, count, desc, eq } from "drizzle-orm";
import {
  Hono,
} from "hono";
import { z } from "zod";

import db from "../db";
import { insertMoodsSchema, moods as moodsTable } from "../db/schema/moods";
import { getUser } from "../kinde";
import { createPostSchema, updatePostSchema } from "../types";

export const moodsRoute = new Hono()

  .get("/", getUser, zValidator("query", z.object({
    pageSize: z.string().min(1).max(100).default("10"),
    page: z.string().min(1).max(100).default("1"),

  })), async (context) => {
    const query = context.req.valid("query");
    const user = context.var.user;

    const page = Number.parseInt(query.page ?? "1");
    const pageSize = Number.parseInt(query.pageSize ?? "10");

    const moods = await db
      .select()
      .from(moodsTable)
      .orderBy(desc(moodsTable.created_at), desc(moodsTable.id))
      .where(eq(moodsTable.user_id, user.id))
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    if (!moods || moods.length === 0) {
      return context.notFound();
    }

    const moodCount = await db
      .select({
        count: count(),
      })
      .from(moodsTable)
      .then(res => res[0]);

    return context.json({ moods, total: moodCount.count, page: query.page, pageSize: query.pageSize });
  })

  .post("/", getUser, zValidator("json", createPostSchema), async (context) => {
    const mood = context.req.valid("json");
    const user = context.var.user;

    const validatedMood = insertMoodsSchema.parse({
      ...mood,
      user_id: user.id,
      newest: true,
    });

    const operations = Promise.allSettled([
      db
        .update(moodsTable)
        .set({ newest: false })
        .where(and(eq(moodsTable.user_id, user.id), eq(moodsTable.newest, true)))
        .returning()
        .then(res => res[0]),

      db
        .insert(moodsTable)
        .values(validatedMood)
        .returning()
        .then(res => res[0]),
    ]);

    const promiseResult = await operations;

    // Filter fulfilled promises and extract the insert result
    const insertResult = promiseResult
      .filter(op => op.status === "fulfilled")
      .map(op => op.value)
      .find(result => result?.user_id === user.id); // Ensure it's the inserted mood

    if (!insertResult) {
      return context.json({ error: "Failed to insert mood" }, 500);
    }

    return context.json(insertResult);
  })

  .get("/:id{[0-9]+}", getUser, async (context) => {
    const id = Number.parseInt(context.req.param("id"));

    const user = context.var.user;

    const mood = await db
      .select()
      .from(moodsTable)
      .where(and(eq(moodsTable.user_id, user.id), eq(moodsTable.id, id)))
      .then(res => res[0]);

    if (!mood) {
      context.notFound();
    }

    return context.json(mood);
  })

  .delete("/:id{[0-9]+}", getUser, async (context) => {
    const id = Number.parseInt(context.req.param("id"));
    const user = context.var.user;

    const mood = await db
      .delete(moodsTable)
      .where(and(eq(moodsTable.user_id, user.id), eq(moodsTable.id, id)))
      .returning()
      .then(res => res[0]);

    if (!mood) {
      context.notFound();
    }

    return context.json(mood);
  })

  .patch("/:id{[0-9]+}", getUser, zValidator("json", updatePostSchema), async (context) => {
    const id = Number.parseInt(context.req.param("id"));
    const mood = context.req.valid("json");

    const user = context.var.user;

    const validatedMood = updatePostSchema.parse({
      ...mood,
    });

    const updatedMood = await db
      .update(moodsTable)
      .set(validatedMood)
      .where(and(eq(moodsTable.user_id, user.id), eq(moodsTable.id, id)))
      .returning()
      .then(res => res[0]);

    if (!updatedMood) {
      context.notFound();
    }

    return context.json(updatedMood);
  });
