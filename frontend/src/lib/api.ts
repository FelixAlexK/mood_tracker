import type { MoodEntry } from "@/types";
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

export async function getMoods() {
  const result = await api.moods.$get();
  if (!result.ok) {
    throw new Error("Failed to fetch moods");
  }
  const data = await result.json();
  return data;
}
