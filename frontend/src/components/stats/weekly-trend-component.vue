<script setup lang="ts">
import { weeklyTrendQueryOptions } from "@/lib/api";
import { getDayName } from "@/lib/utils";
import { useQuery } from "@tanstack/vue-query";
import { ArrowLeft, TrendingUp } from "lucide-vue-next";

const { data: weeklyTrend, isLoading: isLoadingWeeklyTrend } = useQuery(weeklyTrendQueryOptions);
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
      <TrendingUp class="w-5 h-5" />
      Weekly Trend
    </h2>
    <span v-if="isLoadingWeeklyTrend">Loading...</span>
    <div v-else-if="weeklyTrend" class="grid grid-cols-7 gap-2">
      <div
        v-for="(day, index) in weeklyTrend"
        :key="index"
        class="text-center"
      >
        <div class="text-xs text-gray-500 mb-2">
          {{ getDayName(day.date) }}
        </div>
        <div
          class="aspect-square rounded-lg flex items-center justify-center"
          :class="day.count > 0 ? 'bg-blue-50 ring-2 ring-blue-500' : 'bg-gray-50'"
        >
          <span v-if="day.count > 0" class="text-xl">{{ day.emoji }}</span>
          <span v-else class="text-xs text-gray-400">-</span>
        </div>
      </div>
    </div>
  </div>
</template>
