<!-- eslint-disable antfu/no-import-node-modules-by-path -->
<!-- eslint-disable antfu/no-import-dist -->
<script setup lang="ts">
import HeadlineComponent from "@/components/headline-component.vue";
import MonthlyOverviewComponent from "@/components/stats/monthly-overview-component.vue";
import { getMonthlyOverView, getMoodDistribution, getMostCommonMood, getStreak, getTotalEntries, getWeeklyTrend } from "@/lib/api";
import { getDayName } from "@/lib/utils";
import { useQuery } from "@tanstack/vue-query";
import { BarChart3, BookOpen, Flame } from "lucide-vue-next";

const page = 0;
const limit = 3; // Number of items per page

const { data: totalEntries, isLoading: isLoadingTotal } = useQuery({
  queryKey: ["total-entries"],
  queryFn: getTotalEntries,
});

const { data: mostCommon, isLoading: isLoadingMostCommon } = useQuery({
  queryKey: ["most-common"],
  queryFn: getMostCommonMood,
});

// Fetch mood distribution with pagination
const { data: distribution, isLoading: isLoadingDist } = useQuery({
  queryKey: ["mood-distribution", page],
  queryFn: () => getMoodDistribution({ page, limit }),

});
const { data: streak, isLoading: isLoadingStreak } = useQuery({
  queryKey: ["streak"],
  queryFn: getStreak,
});

const { data: weeklyTrend, isLoading: isLoadingWeeklyTrend } = useQuery({
  queryKey: ["weekly-trend"],
  queryFn: getWeeklyTrend,
});
</script>

<template>
  <HeadlineComponent text="Stats" />

  <div class="bg-white rounded-lg shadow-md p-6 mb-6">
    <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
      <BarChart3 class="w-5 h-5" />
      Mood Insights
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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

    <div class="space-y-4">
      <div>
        <h3 class="text-sm font-semibold text-gray-600 mb-2">
          Mood Distribution
        </h3>
        <span v-if="isLoadingDist">Loading...</span>
        <div v-else-if="totalEntries?.total ?? 0 > 0" class="grid grid-cols-2 md:grid-cols-3 gap-2">
          <div
            v-for="(mood, index) in distribution"
            :key="index"
            class="bg-gray-50 rounded-lg p-3"
          >
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xl">{{ mood.emoji }}</span>
              <span class="capitalize">{{ mood.type }}</span>
            </div>
            <div class="flex items-center gap-2">
              <div
                class="h-2 rounded-full bg-blue-200 flex-grow"
                :style="{ width: `${mood.percentage}%` }"
              >
                <div
                  class="h-full rounded-full bg-blue-500"
                  :style="{ width: `${mood.percentage}%` }"
                />
              </div>
              <span class="text-sm text-gray-600">{{ mood.percentage }}%</span>
            </div>
          </div>
        </div>
        <span v-else class="text-2xl">-</span>
      </div>

      <div>
        <h3 class="text-sm font-semibold text-gray-600 mb-2">
          Weekly Trend
        </h3>
        <span v-if="isLoadingWeeklyTrend">Loading...</span>
        <div v-else-if="totalEntries?.total ?? 0 > 0" class="grid grid-cols-7 gap-1">
          <div
            v-for="(day, index) in weeklyTrend"
            :key="index"
            class="text-center"
          >
            <div class="text-xs text-gray-500 mb-1">
              {{ getDayName(day.date) }}
            </div>
            <div
              class="w-10 h-10 mx-auto rounded-full flex items-center justify-center"
              :class="day.count > 0 ? 'bg-blue-50' : 'bg-gray-50'"
            >
              <span v-if="day.count > 0" class="text-lg">{{ day.emoji }}</span>
              <span v-else class="text-xs text-gray-400">-</span>
            </div>
          </div>
        </div>
        <span v-else class="text-2xl">-</span>
      </div>
    </div>
  </div>
  <MonthlyOverviewComponent />
</template>
