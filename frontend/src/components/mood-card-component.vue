<script setup lang="ts">
import type { MoodEntry } from "@/types";

import router from "@/router";
import { Clock } from "lucide-vue-next";

const { mood } = defineProps<{
  mood: MoodEntry;
}>();

function formattedDate(createdAt: string | null) {
  if (!createdAt)
    return "No date";

  const date = new Date(createdAt);

  // Format the date for Germany (CET/CEST) using the `timeZone` option
  return new Intl.DateTimeFormat("de-DE", {
    timeZone: "Europe/Berlin", // Automatically handles CET/CEST
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
</script>

<template>
  <div class="relative bg-white rounded-lg shadow-md w-full h-32 p-4 hover:shadow-lg transition-shadow" @click="router.push(`/mood/${mood.id}`)">
    <div class="flex items-center justify-between mb-2">
      <span class="text-2xl">{{ mood.emoji }}</span>
      <span class="text-sm text-gray-600 capitalize">{{ mood.type }}</span>
    </div>
    <p v-if="mood.note" class="text-gray-700 mb-3 line-clamp-2">
      {{ mood.note }}
    </p>
    <div class="absolute bottom-2 left-4 flex items-center text-gray-500 text-sm ">
      <Clock class="w-4 h-4 mr-1" />
      <span>{{ formattedDate(mood.createdAt) }}</span>
    </div>
  </div>
</template>
