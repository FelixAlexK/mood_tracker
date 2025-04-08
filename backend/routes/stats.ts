import { zValidator } from "@hono/zod-validator";
import { and, between, count, desc, eq } from "drizzle-orm";
import {
    Hono,
} from "hono";
import { z } from "zod";

import db from "../db";
import { moods as moodsTable } from "../db/schema/moods";
import { getUser } from "../kinde";

export const statsRoute = new Hono()
    .get("/most-common", getUser, async (context) => {
        const user = context.var.user;

        const mostFrequentMood = await db
            .select({
                count: count(),
                type: moodsTable.type,
                emoji: moodsTable.emoji,
            })
            .from(moodsTable)
            .where(eq(moodsTable.userID, user.id))
            .groupBy(moodsTable.type)
            .orderBy(desc(count()))
            .limit(1)
            .then(res => res[0]);

        return context.json(mostFrequentMood);
    })

    .get("/total-entries", getUser, async (context) => {
        const user = context.var.user;

        const totalMoodsCount = await db
            .select({
                total: count(),
            })
            .from(moodsTable)
            .where(eq(moodsTable.userID, user.id))
            .limit(1)
            .then(res => res[0]);

        return context.json(totalMoodsCount);
    })

    .get("/streak", getUser, async (context) => {
        const user = context.var.user;

        // Fetch all mood entries ordered by date (descending)
        const moods = await db
            .select({
                createdAt: moodsTable.createdAt,
            })
            .from(moodsTable)
            .where(eq(moodsTable.userID, user.id))
            .orderBy(desc(moodsTable.createdAt));

        if (!moods || moods.length === 0) {
            return context.notFound();
        }

        // Calculate the streak
        let streakCount = 1; // Start with a streak of 1 (today counts as 1 if there's an entry)
        const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
        let previousDate = moods[0]?.createdAt
            ? new Date(moods[0].createdAt).toISOString().split("T")[0]
            : "";

        if (today !== previousDate) {
            streakCount = 0; // If the latest entry is not today, streak starts at 0
        }

        for (let i = 1; i < moods.length; i++) {
            const currentDate = moods[i].createdAt ? new Date(moods[i].createdAt ?? "").toISOString().split("T")[0] : "";
            const previous = new Date(previousDate);
            const current = new Date(currentDate);

            // Check if the current date is exactly one day before the previous date
            if (current.getTime() === previous.getTime() - 24 * 60 * 60 * 1000) {
                streakCount++;
                previousDate = currentDate; // Update the previous date
            }
            else {
                break; // Stop counting if there's a gap
            }
        }

        return context.json(streakCount);
    })

    .get("/mood-distribution", getUser, async (context) => {
        const user = context.var.user;

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
            .where(eq(moodsTable.userID, user.id))
            .groupBy(moodsTable.type, moodsTable.emoji) // Group by mood type and emoji
            .orderBy(desc(count())) // Order by count in descending order
            .limit(3); // Limit the number of results to 3

        if (distribution.length === 0) {
            context.notFound();
        }

        const totalMoods = total.count;
        const moodDistributionWithPercentages = distribution.map(mood => ({
            ...mood,
            percentage: `${((mood.count / totalMoods) * 100).toFixed(2)}`,
        }));

        return context.json(moodDistributionWithPercentages);
    })

    .get("/weekly-trend", getUser, async (context) => {
        const user = context.var.user;

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
                and(between(moodsTable.createdAt, startOfWeek, today), eq(moodsTable.userID, user.id)), // Filter by date range
            )
            .groupBy(moodsTable.createdAt, moodsTable.type, moodsTable.emoji)
            .orderBy(desc(moodsTable.createdAt));

        // Create an array for the past 7 days
        const sevenDayTrend = Array.from({ length: 7 }, (_, i) => {
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
        const moods = await db
            .select({
                createdAt: moodsTable.createdAt, // Extract year-month
                type: moodsTable.type, // Mood type
                emoji: moodsTable.emoji, // Emoji associated with the mood
                count: count(), // Count the number of moods per type per month
            })
            .from(moodsTable)
            .where(eq(moodsTable.userID, user.id))
            .groupBy(moodsTable.createdAt, moodsTable.type, moodsTable.emoji)
            .orderBy(desc(moodsTable.createdAt));

        // Flatten the data into a single array
        const monthlyMoodStats = moods.map((mood) => {
            const date = new Date(mood.createdAt ?? 0).toISOString().split("T")[0]; // Format the date to YYYY-MM-DD

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

        // Fetch all mood entries for the user
        const moods = await db
            .select({
                createdAt: moodsTable.createdAt,
                type: moodsTable.type,
                emoji: moodsTable.emoji,
            })
            .from(moodsTable)
            .where(eq(moodsTable.userID, user.id));

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
            const hour = new Date(mood.createdAt).getHours();

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
        const totalMoods = moods.length;

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
                percentage: ((data.count / totalMoods) * 100).toFixed(0), // Calculate percentage
                topMoods: sortedMoods, // Include all moods sorted by frequency
            };
        });

        return context.json(timeOfDayMoodReport);
    });
