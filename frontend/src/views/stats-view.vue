<script setup lang="ts">
import AccountStats from "@/components/stats/account-stats-component.vue";
import MonthlyOverviewComponent from "@/components/stats/monthly-overview-component.vue";
import { moodDistributionQueryOptions, mostCommonQueryOptions, streakQueryOptions, totalEntriesQueryOptions, weeklyTrendQueryOptions } from "@/lib/api";
import { getDayName } from "@/lib/utils";
import { useQuery } from "@tanstack/vue-query";
import { BarChart3, BookOpen, Flame } from "lucide-vue-next";

const page = 0;
const limit = 3; // Number of items per page

const { data: weeklyTrend, isLoading: isLoadingWeeklyTrend } = useQuery(weeklyTrendQueryOptions);
const { data: distribution, isLoading: isLoadingDist } = useQuery(moodDistributionQueryOptions(page, limit));
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6 mb-6">
    <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
      <BarChart3 class="w-5 h-5" />
      Mood Insights
    </h2>

    <AccountStats />

    <div class="space-y-4 mt-6">
      <div>
        <h3 class="text-sm font-semibold text-gray-600 mb-2">
          Mood Distribution
        </h3>
        <span v-if="isLoadingDist">Loading...</span>
        <div v-else-if="distribution" class="grid grid-cols-2 md:grid-cols-3 gap-2">
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
        <div v-else-if="weeklyTrend" class="grid grid-cols-7 gap-1">
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
