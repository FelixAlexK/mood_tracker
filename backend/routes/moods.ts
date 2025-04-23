import { zValidator } from "@hono/zod-validator";
import { and, desc, eq } from "drizzle-orm";
import {
  Hono,
} from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

import db, { preparedCountOfMoods, preparedDeleteMood, preparedSelectMoodById } from "../db";
import { insertMoodsSchema, moods as moodsTable } from "../db/schema/moods";
import { getUser } from "../kinde";
import { moodPostUpdateSchema, moodPostValidationSchema } from "../types";

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
      .select({
        id: moodsTable.id,
        type: moodsTable.type,
        emoji: moodsTable.emoji,
        created_at: moodsTable.created_at,
        user_id: moodsTable.user_id,
        note: moodsTable.note,
        newest: moodsTable.newest,

      })
      .from(moodsTable)
      .orderBy(desc(moodsTable.created_at), desc(moodsTable.id))
      .where(eq(moodsTable.user_id, user.id))
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    if (!moods || moods.length === 0) {
      throw new HTTPException(404, { message: "No moods found" });
    }

    const count = await preparedCountOfMoods.execute({ user_id: user.id });

    return context.json({ moods, total: count[0], page: query.page, pageSize: query.pageSize }, 200);
  })

  .post("/", getUser, zValidator("json", moodPostValidationSchema), async (context) => {
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
      throw new HTTPException(500, { message: "Unable to insert mood" });
    }

    return context.json(insertResult, 201);
  })

  .get("/:id{[0-9]+}", getUser, async (context) => {
    const id = Number.parseInt(context.req.param("id"));

    const user = context.var.user;

    const moods = await preparedSelectMoodById.execute({ user_id: user.id, id });

    if (!moods || moods.length === 0) {
      throw new HTTPException(404, { message: "No moods found" });
    }

    return context.json(moods[0], 200);
  })

  .delete("/:id{[0-9]+}", getUser, async (context) => {
    const id = Number.parseInt(context.req.param("id"));
    const user = context.var.user;

    const moods = await preparedDeleteMood.execute({ user_id: user.id, id });

    if (!moods || moods.length === 0) {
      throw new HTTPException(404, { message: "No moods found" });
    }

    return context.json(moods[0], 200);
  })

  .patch("/:id{[0-9]+}", getUser, zValidator("json", moodPostUpdateSchema), async (context) => {
    const id = Number.parseInt(context.req.param("id"));
    const mood = context.req.valid("json");

    const user = context.var.user;

    const validatedMood = moodPostUpdateSchema.parse({
      ...mood,
    });

    const updatedMood = await db
      .update(moodsTable)
      .set(validatedMood)
      .where(and(eq(moodsTable.user_id, user.id), eq(moodsTable.id, id)))
      .returning()
      .then(res => res[0]);

    if (!updatedMood) {
      throw new HTTPException(500, { message: "Unable to update mood" });
    }

    return context.json(updatedMood, 200);
  });
