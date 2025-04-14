import type { MoodEntry, UpdateMood } from "@/types";
import type { ApiRoutes } from "@backend/app";

import { queryOptions } from "@tanstack/vue-query";
import { hc } from "hono/client";

const client = hc<ApiRoutes>("/");

export const api = client.api;

export async function postMood(mood: Omit<MoodEntry, "id" | "created_at" | "user_id">) {
  const result = await api.moods.$post({ json: mood });
  if (!result.ok) {
    throw new Error("Failed to create mood");
  }
  const data = await result.json();
  return data;
}

export async function getMoods({ page = 1, pageSize = 10 }: { page?: number; pageSize?: number }) {
  const result = await api.moods.$get({ query: { page: page.toString(), pageSize: pageSize.toString() } });
  if (!result.ok) {
    throw new Error("Failed to fetch moods");
  }
  const mood = await result.json() as { moods: MoodEntry[]; total: number; page: string; pageSize: string };

  return mood;
}

export async function getMood({ id }: { id: string }) {
  const result = await api.moods[":id{[0-9]+}"].$get({ param: { id } });
  if (!result.ok) {
    throw new Error("Failed to fetch mood");
  }
  const data = await result.json();

  return data;
}

export async function deleteMood({ id }: { id: string }) {
  const result = await api.moods[":id{[0-9]+}"].$delete({ param: { id: id.toString() } });
  if (!result.ok) {
    throw new Error("Failed to delete mood");
  }
}

export async function updateMood({ id, mood }: { id: string; mood: UpdateMood }) {
  const result = await api.moods[":id{[0-9]+}"].$patch({ param: { id }, json: mood });
  if (!result.ok) {
    throw new Error("Failed to update mood");
  }
  const data = await result.json();
  return data;
}

export async function getMostCommonMood() {
  const result = await api.stats["most-common"].$get();
  if (!result.ok) {
    throw new Error("Failed to fetch most common mood");
  }
  const data = await result.json();
  return data;
}

export async function getTotalEntries() {
  const result = await api.stats["total-entries"].$get();
  if (!result.ok) {
    throw new Error("Failed to fetch total entries");
  }
  const data = await result.json();
  return data;
}

export async function getStreak() {
  const result = await api.stats.streak.$get();
  if (!result.ok) {
    throw new Error("Failed to fetch streak");
  }
  const data = await result.json();
  return data;
}

export async function getMoodDistribution() {
  const result = await api.stats["mood-distribution"].$get();
  if (!result.ok) {
    throw new Error("Failed to fetch mood distribution");
  }
  const data = await result.json();
  return data;
}

export async function getWeeklyTrend() {
  const result = await api.stats["weekly-trend"].$get();
  if (!result.ok) {
    throw new Error("Failed to fetch mood distribution count");
  }
  const data = await result.json();
  return data;
}

export async function getMonthlyOverView() {
  const result = await api.stats["monthly-overview"].$get();
  if (!result.ok) {
    throw new Error("Failed to fetch mood distribution count");
  }
  const data = await result.json();
  return data;
}

export const userQueryOptions = queryOptions({
  queryKey: ["get-current-user"],
  queryFn: getCurrentUser,

  staleTime: Infinity,
});

export async function getCurrentUser() {
  const result = await api.me.$get();
  if (!result.ok) {
    throw new Error("Failed to fetch user");
  }
  const data = await result.json();
  return data.user;
}

export const totalEntriesQueryOptions = queryOptions({
  queryKey: ["total-entries"],
  queryFn: getTotalEntries,
});

export const mostCommonQueryOptions = queryOptions({
  queryKey: ["most-common"],
  queryFn: getMostCommonMood,
});

// Fetch mood distribution with pagination
export function moodDistributionQueryOptions() {
  return queryOptions({
    queryKey: ["mood-distribution"],
    queryFn: getMoodDistribution,

  });
}

export const streakQueryOptions = queryOptions({
  queryKey: ["streak"],
  queryFn: getStreak,
});

export const weeklyTrendQueryOptions = queryOptions({
  queryKey: ["weekly-trend"],
  queryFn: getWeeklyTrend,
});

export async function getTimeOfDayAnalysis() {
  const result = await api.stats["time-of-day-analysis"].$get();
  if (!result.ok) {
    throw new Error("Failed to fetch time of day analysis");
  }
  const data = await result.json();
  return data;
}

export const timeOfDayAnalysisQueryOptions = queryOptions({
  queryKey: ["time-of-day-analysis"],
  queryFn: getTimeOfDayAnalysis,
});
