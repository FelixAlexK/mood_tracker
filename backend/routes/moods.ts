import { zValidator } from "@hono/zod-validator";
import { between, count, desc, eq } from "drizzle-orm";
import {
  Hono,
} from "hono";
import { z } from "zod";

import db from "../db";
import { insertMoodsSchema, moods as moodsTable } from "../db/schema/moods";
import { createPostSchema, updatePostSchema } from "../types";

export const moodsRoute = new Hono()

  .get("/", zValidator("query", z.object({
    itemlimit: z.string().optional(),

  })), async (context) => {
    const query = context.req.valid("query");
    const moods = await db.select().from(moodsTable).orderBy(desc(moodsTable.createdAt)).limit(Number.parseInt(query.itemlimit ?? "100"));

    const moodCount = await db
      .select({
        count: count(),
      })
      .from(moodsTable)
      .then(res => res[0]);

    return context.json({ moods, count: moodCount.count });
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
  })

  .patch("/:id{[0-9]+}", zValidator("json", updatePostSchema), async (context) => {
    const id = Number.parseInt(context.req.param("id"));
    const mood = context.req.valid("json");
    const validatedMood = updatePostSchema.parse({
      ...mood,
    });

    const updatedMood = await db
      .update(moodsTable)
      .set(validatedMood)
      .where(eq(moodsTable.id, id))
      .returning()
      .then(res => res[0]);

    if (!updatedMood) {
      return context.notFound();
    }

    return context.json({ updatedMood });
  })

  .get("/stats/most-common", async (context) => {
    const stats = await db
      .select({
        count: count(),
        type: moodsTable.type,
        emoji: moodsTable.emoji,
      })
      .from(moodsTable)
      .groupBy(moodsTable.type)
      .orderBy(desc(count()))
      .limit(1)
      .then(res => res[0]);

    return context.json({ stats });
  })

  .get("/stats/total-entries", async (context) => {
    const stats = await db
      .select({
        total: count(),
      })
      .from(moodsTable)
      .limit(1)
      .then(res => res[0]);

    return context.json({ stats });
  })

  .get("/stats/streak", async (context) => {
    // Fetch all mood entries ordered by date (descending)
    const moods = await db
      .select({
        createdAt: moodsTable.createdAt,
      })
      .from(moodsTable)
      .orderBy(desc(moodsTable.createdAt));

    if (!moods || moods.length === 0) {
      return context.json({ streak: 0 });
    }

    // Calculate the streak
    let streak = 1; // Start with a streak of 1 (today counts as 1 if there's an entry)
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    let previousDate = moods[0]?.createdAt
      ? new Date(moods[0].createdAt).toISOString().split("T")[0]
      : "";

    if (today !== previousDate) {
      streak = 0; // If the latest entry is not today, streak starts at 0
    }

    for (let i = 1; i < moods.length; i++) {
      const currentDate = moods[i].createdAt ? new Date(moods[i].createdAt ?? "").toISOString().split("T")[0] : "";
      const previous = new Date(previousDate);
      const current = new Date(currentDate);

      // Check if the current date is exactly one day before the previous date
      if (current.getTime() === previous.getTime() - 24 * 60 * 60 * 1000) {
        streak++;
        previousDate = currentDate; // Update the previous date
      }
      else {
        break; // Stop counting if there's a gap
      }
    }

    return context.json({ streak });
  })

  .get("/stats/mood-distribution", zValidator("query", z.object({
    page: z.string().optional(),
    limit: z.string().optional(), // Optional offset query parameter
  })), async (context) => {
    const query = context.req.valid("query");
    const page = Number.parseInt(query.page ?? "0"); // Default offset to 0 if not provided
    const limit = Number.parseInt(query.limit ?? "3");

    const total = await db
      .select({
        count: count(), // Count of occurrences
      })
      .from(moodsTable)
      .then(res => res[0]);

    // Fetch the mood distribution with offset
    const distribution = await db
      .select({
        type: moodsTable.type, // Mood type
        emoji: moodsTable.emoji, // Emoji associated with the mood
        count: count(), // Count of occurrences
      })
      .from(moodsTable)
      .groupBy(moodsTable.type, moodsTable.emoji) // Group by mood type and emoji
      .orderBy(desc(count())) // Order by count in descending order
      .offset(page) // Apply the offset
      .limit(limit); // Limit the number of results to 3 (or any desired value)

    if (distribution.length === 0) {
      return context.json({ message: "No moods found", distribution: [] });
    }

    const totalMoods = total.count;
    const distributionWithPercentages = distribution.map(mood => ({
      ...mood,
      percentage: `${((mood.count / totalMoods) * 100).toFixed(2)}`,
    }));

    return context.json({ distribution: distributionWithPercentages });
  })

  .get("/stats/weekly-trend", async (context) => {
    // Get today's date and calculate the start of the week (7 days ago)
    const today = new Date();
    const startOfWeek = new Date();
    startOfWeek.setDate(today.getDate() - 6); // 7 days including today

    // Fetch mood entries from the past 7 days, grouped by day and mood type
    const moods = await db
      .select({
        date: moodsTable.createdAt, // Group by date
        type: moodsTable.type, // Mood type
        emoji: moodsTable.emoji, // Emoji associated with the mood
        count: count(), // Count the number of moods per type per day
      })
      .from(moodsTable)
      .where(
        between(moodsTable.createdAt, startOfWeek.getTime(), today.getTime()), // Filter by date range
      )
      .groupBy(moodsTable.createdAt, moodsTable.type, moodsTable.emoji)
      .orderBy(desc(moodsTable.createdAt));

    // Create an array for the past 7 days
    const weeklyTrend = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() - i);
      return {
        date: date.toISOString().split("T")[0],
        type: "", // Default type is null
        emoji: "", // Default emoji is null
        count: 0, // Default count is 0
      };
    }).reverse(); // Reverse to start with the earliest day

    // Map the fetched moods to the weekly trend array
    moods.forEach((mood) => {
      const trendDay = weeklyTrend.find(day => day.date === (mood.date ? new Date(mood.date).toISOString().split("T")[0] : ""));
      if (!trendDay)
        return;
      // If the current mood has a higher count, update the trend day
      if (!trendDay.type || mood.count > trendDay.count) {
        trendDay.type = mood.type;
        trendDay.emoji = mood.emoji;
        trendDay.count = mood.count;
      }
    });

    return context.json({ weeklyTrend });
  })

  .get("/stats/monthly-overview", async (context) => {
    // Get the current date and calculate the start of the year
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1); // January 1st of the current year

    // Fetch mood entries grouped by month and mood type
    const moods = await db
      .select({
        createdAt: moodsTable.createdAt, // Extract year-month
        type: moodsTable.type, // Mood type
        emoji: moodsTable.emoji, // Emoji associated with the mood
        count: count(), // Count the number of moods per type per month
      })
      .from(moodsTable)
      .where(
        between(moodsTable.createdAt, startOfYear.getTime(), today.getTime()), // Filter by date range (current year)
      )
      .groupBy(moodsTable.createdAt, moodsTable.type, moodsTable.emoji)
      .orderBy(desc(moodsTable.createdAt));

    // Organize the data into a structured format
    const monthlyOverview: Record<string, Array<{ type: string; emoji: string; count: number }>> = {};

    moods.forEach((mood) => {
      const date = new Date(mood.createdAt ?? 0);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`; // Format as YYYY-MM

      const { type, emoji, count } = mood;
      if (!monthlyOverview[month]) {
        monthlyOverview[month] = [];
      }
      monthlyOverview[month].push({ type, emoji, count });
    });

    return context.json({ monthlyOverview });
  });
