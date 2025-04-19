import { differenceInDays, startOfDay } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { and, between, count, desc, eq } from "drizzle-orm";
import {
  Hono,
} from "hono";

import db, { preparedCountOfMoods, preparedMostFrequentMood, preparedSelectDistribution, preparedSelectMonthOverview, preparedSelectStreak, preparedSelectTimeOfDay } from "../db";
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

    return context.json(mostFrequentMood[0]);
  })

  .get("/total-entries", getUser, async (context) => {
    const user = context.var.user;

    const total = await preparedCountOfMoods.execute({ user_id: user.id });

    return context.json(total[0]);
  })

  .get("/streak", getUser, async (context) => {
    const user = context.var.user;
    const userTimeZone = context.req.header("x-user-timezone") || "UTC"; // Get user's time zone from headers

    const now = toZonedTime(new Date(), userTimeZone);
    const nowUTC = fromZonedTime(now, userTimeZone);
    const startOfToday = startOfDay(now);

    const streaks = await preparedSelectStreak.execute({
      user_id: user.id,
    });

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

    if (!streak.updated_at) {
      return context.json("Streak not found", 404);
    }

    const zonedLastStreakDate = toZonedTime(new Date(streak.updated_at), userTimeZone);

    const canUpdateStreakToday = differenceInDays(startOfToday, zonedLastStreakDate) > 0;

    if (streak.streak_status && !canUpdateStreakToday) {
      return context.json(streak, 200);
    }

    const lastUpdateStart = startOfDay(zonedLastStreakDate);

    const isBroken = differenceInDays(startOfToday, lastUpdateStart) > 1;

    const currentStreak = streak.streak_count;

    const newCount = isBroken ? 1 : currentStreak + 1;
    const newLongest = Math.max(newCount, streak.longest_streak);

    const validStreak = streakPostUpdateSchema.parse({
      ...streak,
      streak_count: newCount,
      longest_streak: newLongest,
      streak_status: true,
      updated_at: nowUTC,
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

    if (distribution.length === 0) {
      context.notFound();
    }

    const totalMoods = total[0].count;
    const moodDistributionWithPercentages = distribution.map(mood => ({
      ...mood,
      percentage: `${((mood.count / totalMoods) * 100).toFixed(2)}`,
    }));

    return context.json(moodDistributionWithPercentages);
  })

  .get("/weekly-trend", getUser, async (context) => {
    const user = context.var.user;
    const userTimeZone = context.req.header("x-user-timezone") || "UTC"; // Get user's time zone from headers

    // Get today's date and calculate the start of the week (7 days ago)
    const today = toZonedTime(new Date(), userTimeZone);
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - 6); // 7 days including today

    const startOfWeekUTC = fromZonedTime(startOfWeek, userTimeZone);
    const todayUTC = fromZonedTime(today, userTimeZone);

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
        and(between(moodsTable.created_at, startOfWeekUTC, todayUTC), eq(moodsTable.user_id, user.id)), // Filter by date range
      )
      .groupBy(moodsTable.created_at, moodsTable.type, moodsTable.emoji)
      .orderBy(desc(moodsTable.created_at));

    // Create an array for the past 7 days
    const sevenDayTrend = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
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
      const trendDay = sevenDayTrend.find(day => day.date === (mood.date ? new Date(mood.date).toISOString().split("T")[0] : ""));
      if (!trendDay)
        return;
      // If the current mood has a higher count, update the trend day
      if (!trendDay.type || mood.count > trendDay.count) {
        trendDay.type = mood.type;
        trendDay.emoji = mood.emoji;
        trendDay.count = mood.count;
      }
    });

    return context.json(sevenDayTrend);
  })

  .get("/monthly-overview", getUser, async (context) => {
    const user = context.var.user;

    // Fetch mood entries grouped by month and mood type
    const moods = await preparedSelectMonthOverview.execute({
      user_id: user.id,
    });

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

    return context.json(monthlyMoodStats);
  })

  .get("/time-of-day-analysis", getUser, async (context) => {
    const user = context.var.user;
    const userTimeZone = context.req.header("x-user-timezone") || "UTC"; // Get user's time zone from headers

    // Fetch all mood entries for the user
    const moods = await preparedSelectTimeOfDay.execute({
      user_id: user.id,
    });

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
      const zonedTime = toZonedTime(new Date(mood.created_at), userTimeZone);
      const hour = zonedTime.getHours();

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
        percentage: ((data.count / total) * 100).toFixed(0), // Calculate percentage
        topMoods: sortedMoods, // Include all moods sorted by frequency
      };
    });

    return context.json(timeOfDayMoodReport);
  });
