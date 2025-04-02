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

export async function getMoods(limit: string | undefined) {
  const result = await api.moods.$get({ query: { itemlimit: limit } });
  if (!result.ok) {
    throw new Error("Failed to fetch moods");
  }
  const data = await result.json();
  return data;
}

export async function getMoodsCount() {
  const result = await api.moods.count.$get();
  if (!result.ok) {
    throw new Error("Failed to fetch moods");
  }
  const data = await result.json();
  return data.countMoods[0];
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
