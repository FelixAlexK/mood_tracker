<script setup lang="ts">
import { mostCommonQueryOptions, streakQueryOptions, totalEntriesQueryOptions } from "@/lib/api";
import { useQuery } from "@tanstack/vue-query";
import { BookOpen, Flame } from "lucide-vue-next";

const { data: totalEntries, isLoading: isLoadingTotal } = useQuery(totalEntriesQueryOptions);
const { data: mostCommon, isLoading: isLoadingMostCommon } = useQuery(mostCommonQueryOptions);
const { data: streak, isLoading: isLoadingStreak } = useQuery(streakQueryOptions);
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    <div class="bg-gray-100 rounded-lg shadow-md p-6">
      <h4 class="text-sm font-medium mb-1 text-gray-700">
        Most Common Mood
      </h4>
      <span v-if="isLoadingMostCommon">Loading...</span>
      <div v-else-if="mostCommon?.count ?? 0 > 0" class="flex items-center gap-2">
        <span class="text-xl ">{{ mostCommon?.emoji }}</span>
        <span class="text-xl capitalize font-semibold">{{ mostCommon?.type }}</span>
      </div>
      <span v-else class="text-2xl">-</span>
    </div>

    <div class="bg-gray-200 rounded-lg shadow-md p-6">
      <h4 class="text-sm font-medium mb-1 text-gray-700">
        Total Entries
      </h4>
      <span v-if="isLoadingTotal">Loading...</span>
      <div v-else class="flex items-center gap-2">
        <BookOpen class="text-xl text-purple-600" />
        <span class="text-xl capitalize font-semibold">{{ totalEntries?.total }} entries</span>
      </div>
    </div>

    <div class="bg-gray-300 rounded-lg shadow-md p-6">
      <h4 class="text-sm font-medium mb-1 text-gray-700">
        Latest Streak
      </h4>
      <span v-if="isLoadingStreak">Loading...</span>
      <div v-else class="flex items-center gap-2">
        <Flame class="text-xl text-orange-500" />
        <span class="text-xl capitalize font-semibold">{{ streak }} days</span>
      </div>
    </div>
  </div>
</template>
