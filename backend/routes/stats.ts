import { and, between, count, desc, eq } from "drizzle-orm";
import {
  Hono,
} from "hono";
import { HTTPException } from "hono/http-exception";
import { DateTime } from "luxon";

import db, { preparedCountOfMoods, preparedMostFrequentMood, preparedSelectDistribution, preparedSelectLatestMoodEntry, preparedSelectMonthOverview, preparedSelectStreak, preparedSelectTimeOfDay } from "../db";
import { moods as moodsTable } from "../db/schema/moods";
import { streaks as streakTable } from "../db/schema/streaks";
import { getUser } from "../kinde";
import { streakPostUpdateSchema } from "../types";

export const statsRoute = new Hono()
  .get("/most-common", getUser, async (context) => {
    const user = context.var.user;

    const mostFrequentMood = await preparedMostFrequentMood.execute({
      user_id: user.id,
    });

    if (!mostFrequentMood) {
      throw new HTTPException(404, { message: "No entries found" });
    }

    return context.json(mostFrequentMood[0]);
  })

  .get("/total-entries", getUser, async (context) => {
    const user = context.var.user;

    const total = await preparedCountOfMoods.execute({ user_id: user.id });

    if (!total) {
      throw new HTTPException(404, { message: "No entries found" });
    }

    return context.json(total[0]);
  })

  .get("/streak", getUser, async (context) => {
    const user = context.var.user;
    const userTimeZone = context.req.header("x-user-timezone") || "UTC"; // Get user's time zone from headers

    const now = DateTime.now().setZone(userTimeZone);

    const startOfToday = now.startOf("day"); // Get start of today in user's time zone

    const streaks = await preparedSelectStreak.execute({
      user_id: user.id,
    });

    const latestMoodEntries = await preparedSelectLatestMoodEntry.execute({
      user_id: user.id,
    });

    if (!latestMoodEntries || latestMoodEntries.length === 0) {
      throw new HTTPException(404, { message: "No moods found" });
    }

    const latestMoodEntry = latestMoodEntries[0];

    let streak = streaks[0];

    if (!streak) {
      streak = await db
        .insert(streakTable)
        .values({ user_id: user.id })
        .onConflictDoNothing()
        .returning({
          updated_at: streakTable.updated_at,
          streak_count: streakTable.streak_count,
          longest_streak: streakTable.longest_streak,
          streak_status: streakTable.streak_status,
        })
        .then(res => res[0]);
    }

    const zonedLastMoodDate = DateTime.fromJSDate(latestMoodEntry.created_at, { zone: "utc" });
    const zonedStreakDate = DateTime.fromJSDate(streak.updated_at, { zone: "utc" });

    const canUpdateStreakToday = zonedLastMoodDate.diff(zonedStreakDate, "days").as("days") > 0;

    if (streak.streak_status && !canUpdateStreakToday) {
      return context.json(streak, 200);
    }

    const lastUpdateStart = zonedLastMoodDate.startOf("day");

    const isBroken
      = lastUpdateStart.diff(startOfToday, "days").as("days") > 1;

    const currentStreak = streak.streak_count;

    const newCount = isBroken ? 1 : currentStreak + 1;
    const newLongest = Math.max(newCount, streak.longest_streak);

    const validStreak = streakPostUpdateSchema.parse({
      ...streak,
      streak_count: newCount,
      longest_streak: newLongest,
      streak_status: true,
      updated_at: now.toJSDate(),
    });

    const updatedStreak = await db
      .update(streakTable)
      .set(validStreak)
      .where(eq(streakTable.user_id, user.id))
      .returning()
      .then(res => res[0]);

    return context.json(updatedStreak, 200);
  })

  .get("/mood-distribution", getUser, async (context) => {
    const user = context.var.user;

    const total = await preparedCountOfMoods.execute({
      user_id: user.id,
    });

    // Fetch the mood distribution with offset
    const distribution = await preparedSelectDistribution.execute({
      user_id: user.id,
    });

    if (!distribution || distribution.length === 0) {
      throw new HTTPException(404, { message: "No entries found" });
    }

    const totalMoods = total[0].count;
    const moodDistributionWithPercentages = distribution.map(mood => ({
      ...mood,
      percentage: ((mood.count / totalMoods) * 100),
    }));

    return context.json(moodDistributionWithPercentages);
  })

  .get("/weekly-trend", getUser, async (context) => {
    const user = context.var.user;
    const userTimeZone = context.req.header("x-user-timezone") || "UTC"; // Get user's time zone from headers

    const now = DateTime.now().setZone(userTimeZone); // Convert UTC to user's time zone

    const weekStart = now.startOf("week"); // Monday as the start of the week

    // Fetch mood entries from the past 7 days, grouped by day and mood type
    const moods = await db
      .select({
        date: moodsTable.created_at, // Group by date
        type: moodsTable.type, // Mood type
        emoji: moodsTable.emoji, // Emoji associated with the mood
        count: count(), // Count the number of moods per type per day
      })
      .from(moodsTable)
      .where(
        and(between(moodsTable.created_at, weekStart.toJSDate(), now.toJSDate()), eq(moodsTable.user_id, user.id)), // Filter by date range
      )
      .groupBy(moodsTable.created_at, moodsTable.type, moodsTable.emoji)
      .orderBy(desc(moodsTable.created_at));

    // Create an array for the past 7 days
    const sevenDayTrend = Array.from({ length: 7 }, (_, i) => {
      const date = now.minus({ days: i }); // Get the date for each day of the week
      return {
        date: date.toISODate(), // Format the date to YYYY-MM-DD
        type: "", // Default type is null
        emoji: "", // Default emoji is null
        count: 0, // Default count is 0
      };
    }).reverse(); // Reverse to start with the earliest day

    // Map the fetched moods to the weekly trend array
    moods.forEach((mood) => {
      const trendDay = sevenDayTrend.find(day => day.date === (mood.date ? DateTime.fromJSDate(mood.date).toISODate() : ""));
      if (!trendDay)
        return;
      // If the current mood has a higher count, update the trend day
      if (!trendDay.type || mood.count > trendDay.count) {
        trendDay.type = mood.type;
        trendDay.emoji = mood.emoji;
        trendDay.count = mood.count;
      }
    });

    return context.json(sevenDayTrend, 200);
  })

  .get("/monthly-overview", getUser, async (context) => {
    const user = context.var.user;

    // Fetch mood entries grouped by month and mood type
    const moods = await preparedSelectMonthOverview.execute({
      user_id: user.id,
    });

    if (!moods || moods.length === 0) {
      throw new HTTPException(404, { message: "No entries found" });
    }

    // Flatten the data into a single array
    const monthlyMoodStats = moods.map((mood) => {
      const date = new Date(mood.created_at ?? 0).toISOString().split("T")[0]; // Format the date to YYYY-MM-DD

      return {
        date,
        type: mood.type,
        emoji: mood.emoji,
        count: mood.count,
      };
    });

    return context.json(monthlyMoodStats, 200);
  })

  .get("/time-of-day-analysis", getUser, async (context) => {
    const user = context.var.user;
    const userTimeZone = context.req.header("x-user-timezone") || "UTC"; // Get user's time zone from headers

    // Fetch all mood entries for the user
    const moods = await preparedSelectTimeOfDay.execute({
      user_id: user.id,
    });

    if (!moods || moods.length === 0) {
      throw new HTTPException(404, { message: "No entries found" });
    }

    // Define time ranges
    const timeRanges = {
      morning: { start: 6, end: 12, label: "Morning" },
      afternoon: { start: 12, end: 18, label: "Afternoon" },
      evening: { start: 18, end: 24, label: "Evening" },
      night: { start: 0, end: 6, label: "Night" },
    };

    // Initialize counts and mood tracking for each time range
    const timeOfDayCounts: Record<string, { count: number; moods: Record<string, { count: number; emoji: string }> }> = {
      Morning: { count: 0, moods: {} },
      Afternoon: { count: 0, moods: {} },
      Evening: { count: 0, moods: {} },
      Night: { count: 0, moods: {} },
    };

    // Categorize moods by time of day and track mood counts
    moods.forEach((mood) => {
      const zonedTime = DateTime.fromJSDate(mood.created_at, { zone: userTimeZone });
      const hour = zonedTime.hour;

      let timeOfDay: keyof typeof timeOfDayCounts | null = null;
      if (hour >= timeRanges.morning.start && hour < timeRanges.morning.end) {
        timeOfDay = "Morning";
      }
      else if (hour >= timeRanges.afternoon.start && hour < timeRanges.afternoon.end) {
        timeOfDay = "Afternoon";
      }
      else if (hour >= timeRanges.evening.start && hour < timeRanges.evening.end) {
        timeOfDay = "Evening";
      }
      else if (hour >= timeRanges.night.start || hour < timeRanges.night.end) {
        timeOfDay = "Night";
      }

      if (timeOfDay) {
        timeOfDayCounts[timeOfDay].count++;
        if (!timeOfDayCounts[timeOfDay].moods[mood.type]) {
          timeOfDayCounts[timeOfDay].moods[mood.type] = { count: 0, emoji: mood.emoji };
        }
        timeOfDayCounts[timeOfDay].moods[mood.type].count++;
      }
    });

    // Calculate total moods
    const totalMoods = await preparedCountOfMoods.execute({
      user_id: user.id,
    });

    if (!totalMoods || totalMoods.length === 0) {
      throw new HTTPException(404, { message: "No total found" });
    }

    const total = totalMoods[0].count;

    // Format the response
    const timeOfDayMoodReport = Object.entries(timeOfDayCounts).map(([timeOfDay, data]) => {
      // Get all moods sorted by count for the time of day
      const sortedMoods = Object.entries(data.moods)
        .map(([type, moodData]) => ({
          type,
          count: moodData.count,
          emoji: moodData.emoji,
        }))
        .sort((a, b) => b.count - a.count); // Sort by count in descending order

      return {
        timeOfDay,
        percentage: ((data.count / total) * 100), // Calculate percentage
        topMoods: sortedMoods, // Include all moods sorted by frequency
      };
    });

    return context.json(timeOfDayMoodReport, 200);
  });
