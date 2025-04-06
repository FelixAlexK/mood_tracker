<script setup lang="ts">
import { mostCommonQueryOptions, streakQueryOptions, totalEntriesQueryOptions } from "@/lib/api";
import { useQuery } from "@tanstack/vue-query";
import { BookOpen, Flame } from "lucide-vue-next";

const { data: totalEntries, isLoading: isLoadingTotal } = useQuery(totalEntriesQueryOptions);
const { data: mostCommon, isLoading: isLoadingMostCommon } = useQuery(mostCommonQueryOptions);
const { data: streak, isLoading: isLoadingStreak } = useQuery(streakQueryOptions);
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 ">
    <div class="bg-blue-50 rounded-lg p-4">
      <h3 class="text-sm font-semibold text-gray-600 mb-1">
        Most Common Mood
      </h3>
      <span v-if="isLoadingMostCommon">Loading...</span>
      <div v-else-if="mostCommon?.count ?? 0 > 0" class="flex items-center gap-2">
        <span class="text-2xl">{{ mostCommon?.emoji }}</span>
        <span class="text-lg font-medium capitalize">{{ mostCommon?.type }}</span>
      </div>
      <span v-else class="text-2xl">-</span>
    </div>

    <div class="bg-purple-50 rounded-lg p-4">
      <h3 class="text-sm font-semibold text-gray-600 mb-1">
        Total Entries
      </h3>
      <span v-if="isLoadingTotal">Loading...</span>
      <div v-else class="flex items-center gap-2">
        <BookOpen class="w-5 h-5 text-purple-600" />
        <span class="text-lg font-medium">{{ totalEntries?.total }} entries</span>
      </div>
    </div>

    <div class="bg-green-50 rounded-lg p-4">
      <h3 class="text-sm font-semibold text-gray-600 mb-1">
        Latest Streak
      </h3>
      <span v-if="isLoadingStreak">Loading...</span>
      <div v-else class="flex items-center gap-2">
        <Flame class="w-5 h-5 text-orange-500" />
        <span class="text-lg font-medium">{{ streak }} days</span>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
