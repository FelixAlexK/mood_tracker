import type { MoodEntry, UpdateMood } from "@/types";
import type { ApiRoutes } from "@backend/app";

import { hc } from "hono/client";

const client = hc<ApiRoutes>("/");

export const api = client.api;

export async function postMood(mood: Omit<MoodEntry, "id" | "createdAt">) {
  const result = await api.moods.$post({ json: mood });
  if (!result.ok) {
    throw new Error("Failed to create new mood");
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
  const data = await result.json() as { mood: MoodEntry };

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
  const data = await result.json() as { mood: MoodEntry };
  return data;
}

export async function getMostCommonMood() {
  const result = await api.moods.stats["most-common"].$get();
  if (!result.ok) {
    throw new Error("Failed to fetch most common mood");
  }
  const data = await result.json();
  return data.stats;
}

export async function getTotalEntries() {
  const result = await api.moods.stats["total-entries"].$get();
  if (!result.ok) {
    throw new Error("Failed to fetch total entries");
  }
  const data = await result.json();
  return data.stats;
}

export async function getStreak() {
  const result = await api.moods.stats.streak.$get();
  if (!result.ok) {
    throw new Error("Failed to fetch streak");
  }
  const data = await result.json();
  return data.streak;
}

export async function getMoodDistribution({ page, limit }: { page?: number; limit?: number }) {
  const result = await api.moods.stats["mood-distribution"].$get({ query: { page: page?.toString(), limit: limit?.toString() } });
  if (!result.ok) {
    throw new Error("Failed to fetch mood distribution");
  }
  const data = await result.json();
  return data.distribution;
}

export async function getWeeklyTrend() {
  const result = await api.moods.stats["weekly-trend"].$get();
  if (!result.ok) {
    throw new Error("Failed to fetch mood distribution count");
  }
  const data = await result.json();
  return data.weeklyTrend;
}

export async function getMonthlyOverView() {
  const result = await api.moods.stats["monthly-overview"].$get();
  if (!result.ok) {
    throw new Error("Failed to fetch mood distribution count");
  }
  const data = await result.json();
  return data.monthlyOverview;
}
