import type { MoodEntry, UpdateMood } from "@/types";
import type { ApiRoutes } from "@backend/app";
import type { ClientResponse } from "hono/client";
import type { Ref } from "vue";

import { keepPreviousData, queryOptions } from "@tanstack/vue-query";
import { hc } from "hono/client";
import { ref } from "vue";

const client = hc<ApiRoutes>("/");

export const api = client.api;

export async function callRpc<T>(rpc: Promise<ClientResponse<T>>): Promise<{ data: T; error: null } | { data: null; error: { message: string; status: number } }> {
  try {
    const data = await rpc;

    if (!data.ok) {
      const res = await data.text();
      return { data: null, error: { message: res, status: data.status } };
    }

    const res = await data.json();
    return { data: res as T, error: null };
  }
  catch (error) {
    return { data: null, error: { message: (error as Error).message, status: 500 } };
  }
}

export async function postMood(mood: Omit<MoodEntry, "id" | "created_at" | "user_id">) {
  return await callRpc(api.moods.$post({ json: mood }));
}

export async function getMoods({ page = ref(1), page_size = ref(10) }: { page?: Ref<number>; page_size?: Ref<number> }) {
  return await callRpc(api.moods.$get({ query: { page: page.value.toString(), pageSize: page_size.value.toString() } }));
}

export async function getMood({ id }: { id: Ref<string> }) {
  return await callRpc(api.moods[":id{[0-9]+}"].$get({ param: { id: id.value } }));
}

export async function deleteMood({ id }: { id: Ref<string> }) {
  return await callRpc(api.moods[":id{[0-9]+}"].$delete({ param: { id: id.value } }));
}

export async function updateMood({ id, mood }: { id: string; mood: UpdateMood }) {
  return await callRpc(api.moods[":id{[0-9]+}"].$patch({ param: { id }, json: mood }));
}

export async function getMostCommonMood() {
  return await callRpc(api.stats["most-common"].$get());
}

export async function getTotalEntries() {
  return await callRpc(api.stats["total-entries"].$get());
}

export async function getStreak() {
  return await callRpc(api.stats.streak.$get({}, {
    headers: {
      "x-user-timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  }));
}

export async function getMoodDistribution() {
  return await callRpc(api.stats["mood-distribution"].$get());
}

export async function getWeeklyTrend() {
  return await callRpc(api.stats["weekly-trend"].$get({}, {
    headers: {
      "x-user-timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  }));
}

export async function getMonthlyOverView() {
  return await callRpc(api.stats["monthly-overview"].$get());
}

export const userQueryOptions = queryOptions({
  queryKey: ["get-current-user"],
  queryFn: getCurrentUser,

  staleTime: Infinity,
});

export function getMoodsQueryOptions(page?: Ref<number>, page_size?: Ref<number>) {
  return queryOptions({
    queryKey: ["get-moods", page],
    queryFn: () => getMoods({ page, page_size }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });
}

export async function getCurrentUser() {
  return await callRpc(api.me.$get());
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
  return await callRpc(api.stats["time-of-day-analysis"].$get({}, {
    headers: {
      "x-user-timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  }));
}

export const timeOfDayAnalysisQueryOptions = queryOptions({
  queryKey: ["time-of-day-analysis"],
  queryFn: getTimeOfDayAnalysis,
});
