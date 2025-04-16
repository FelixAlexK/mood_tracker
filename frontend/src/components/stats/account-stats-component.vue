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
    <div class="bg-mt-600/30 rounded-lg shadow-md p-6">
      <h4 class="max-lg:text-xs text-sm font-medium mb-1 text-mt-600">
        Most Common Mood
      </h4>
      <span v-if="isLoadingMostCommon && (mostCommon?.count ?? 0 > 0)">Loading...</span>
      <div v-else-if="mostCommon?.count ?? 0 > 0" class="flex items-center gap-2">
        <span class="max-lg:text-xl text-2xl drop-shadow-lg">{{ mostCommon?.emoji }}</span>
        <span class="max-lg:text-lg text-xl capitalize font-semibold">{{ mostCommon?.type }}</span>
      </div>
      <span v-else class="max-lg:text-xl text-2xl">-</span>
    </div>

    <div class="bg-mt-600/30 rounded-lg shadow-md p-6">
      <h4 class="max-lg:text-xs text-sm font-medium mb-1 text-mt-600">
        Total Entries
      </h4>
      <span v-if="isLoadingTotal && (mostCommon?.count ?? 0 > 0)">Loading...</span>
      <div v-else class="flex items-center gap-2 ">
        <BookOpen class="max-lg:text-xl text-2xl drop-shadow-lg text-purple-600" />
        <span class="max-lg:text-lg text-xl capitalize font-semibold">{{ totalEntries?.total }} entries</span>
      </div>
    </div>

    <div class="bg-mt-600/30 rounded-lg shadow-md p-6">
      <h4 class="max-lg:text-xs text-sm font-medium mb-1 text-mt-600">
        Latest Streak
      </h4>
      <span v-if="isLoadingStreak && (mostCommon?.count ?? 0 > 0)">Loading...</span>
      <div v-else class="flex items-center gap-2">
        <Flame class="max-lg:text-xl text-2xl drop-shadow-lg text-orange-500" />
        <span class="max-lg:text-lg text-xl capitalize font-semibold">{{ streak ?? 0 }} days</span>
      </div>
    </div>
  </div>
</template>
