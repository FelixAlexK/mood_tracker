<script setup lang="ts">
import type { MoodEntry } from "@/types";

import { formattedDate } from "@/lib/utils";
import router from "@/router";
import { Clock } from "lucide-vue-next";

const { mood } = defineProps<{
  mood: MoodEntry;
}>();

function handleRouterPush() {
  router.push(`/mood/${mood.id}`);
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer flex flex-col h-full relative" @click="handleRouterPush">
    <div class="flex items-center justify-between mb-2 ">
      <span class="text-2xl block">{{ mood.emoji }}</span>
      <span class="text-sm capitalize">{{ mood.type }}</span>
    </div>
    <div v-if="mood.newest" class="bg-pink-400  rounded-b-xl shadow-md shadow-pink-600/50   absolute top-0 left-1/2  transform -translate-x-1/2  text-white font-bold text-sm py-0.5 px-4">
      NEW
    </div>

    <p class="text-gray-700 my-2 line-clamp-2 ">
      {{ mood.note ?? '-' }}
    </p>

    <div class="flex items-center text-gray-500 text-sm mt-auto ">
      <Clock class="w-4 h-4 mr-1 " />
      <time :datetime="mood.createdAt ?? ''">{{ formattedDate(mood.createdAt) }}</time>
    </div>
  </div>
</template>
