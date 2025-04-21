import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { and, count, desc, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";

import { moods as moodsTable } from "./schema/moods";
import { streaks as streakTable } from "./schema/streaks";

import "dotenv/config";

const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env.development";
config({ path: envFile });

const neonSQL = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: neonSQL, logger: true, casing: "snake_case" });

export const preparedCountOfMoods = db
  .select({
    count: count(),
  })
  .from(moodsTable)
  .where(eq(moodsTable.user_id, sql.placeholder("user_id")))
  .limit(1)
  .prepare("COUNT_MOODS");

export const preparedSelectMoodById = db
  .select()
  .from(moodsTable)
  .where(and(eq(moodsTable.user_id, sql.placeholder("user_id")), eq(moodsTable.id, sql.placeholder("id"))))
  .limit(1)
  .prepare("SELECT_MOOD_BY_ID");

export const preparedDeleteMood = db
  .delete(moodsTable)
  .where(and(eq(moodsTable.user_id, sql.placeholder("user_id")), eq(moodsTable.id, sql.placeholder("id"))))
  .returning()
  .prepare("DELETE_MOOD");

export const preparedMostFrequentMood = db
  .select({
    count: count(),
    type: moodsTable.type,
    emoji: moodsTable.emoji,
  })
  .from(moodsTable)
  .where(eq(moodsTable.user_id, sql.placeholder("user_id")))
  .groupBy(moodsTable.type, moodsTable.emoji)
  .orderBy(desc(count()))
  .limit(1)
  .prepare("MOST_FREQUENT_MOOD");

export const preparedSelectStreak = db
  .select({
    updated_at: streakTable.updated_at,
    streak_count: streakTable.streak_count,
    longest_streak: streakTable.longest_streak,
    streak_status: streakTable.streak_status,
  })
  .from(streakTable)
  .where(eq(streakTable.user_id, sql.placeholder("user_id")))
  .limit(1)
  .prepare("SELECT_STREAK");

export const preparedSelectDistribution = db
  .select({
    type: moodsTable.type, // Mood type
    emoji: moodsTable.emoji, // Emoji associated with the mood
    count: count(), // Count of occurrences
  })
  .from(moodsTable)
  .where(eq(moodsTable.user_id, sql.placeholder("user_id")))
  .groupBy(moodsTable.type, moodsTable.emoji) // Group by mood type and emoji
  .orderBy(desc(count())) // Order by count in descending order
  .limit(3)
  .prepare("SELECT_DISTRIBUTION"); // Limit the number of results to 3

export const preparedSelectMonthOverview = db
  .select({
    created_at: moodsTable.created_at, // Extract year-month
    type: moodsTable.type, // Mood type
    emoji: moodsTable.emoji, // Emoji associated with the mood
    count: count(), // Count the number of moods per type per month
  })
  .from(moodsTable)
  .where(eq(moodsTable.user_id, sql.placeholder("user_id")))
  .groupBy(moodsTable.created_at, moodsTable.type, moodsTable.emoji)
  .orderBy(desc(moodsTable.created_at))
  .prepare("SELECT_MONTH_OVERVIEW");

export const preparedSelectTimeOfDay = db
  .select({
    created_at: moodsTable.created_at,
    type: moodsTable.type,
    emoji: moodsTable.emoji,
  })
  .from(moodsTable)
  .where(eq(moodsTable.user_id, sql.placeholder("user_id")))
  .prepare("SELECT_TIME_OF_DAY");

export const preparedSelectLatestMoodEntry = db
  .select({
    created_at: moodsTable.created_at,
  })
  .from(moodsTable)
  .where(
    eq(moodsTable.user_id, sql.placeholder("user_id")),
  )
  .orderBy(desc(moodsTable.created_at))
  .limit(1)
  .prepare("SELECT_LATEST_MOOD_ENTRY");

export default db;
