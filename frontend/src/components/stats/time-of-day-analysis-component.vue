<script setup lang="ts">
import { getTimeOfDayAnalysis, timeOfDayAnalysisQueryOptions } from "@/lib/api";
import { useQuery } from "@tanstack/vue-query";
import { Clock } from "lucide-vue-next";

const { data: timeAnalysis, isLoading: isLoadingTimeAnalysis } = useQuery(timeOfDayAnalysisQueryOptions);
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
      <Clock class="w-5 h-5" />
      Time of Day Analysis
    </h2>
    <span v-if="isLoadingTimeAnalysis">Loading...</span>
    <div v-else-if="timeAnalysis" class="space-y-4">
      <div
        v-for="period in timeAnalysis"
        :key="period.timeOfDay"
        class="bg-gray-50 rounded-lg p-4"
      >
        <div class="flex items-center justify-between mb-2">
          <span class="font-medium">{{ period.timeOfDay }}</span>
          <span class="text-sm text-gray-600">{{ period.percentage }}%</span>
        </div>
        <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div class="flex-grow h-2 bg-blue-200 rounded-full">
            <div
              class="h-full bg-blue-500 rounded-full transition-all duration-500"
              :style="{ width: `${period.percentage}%` }"
            />
          </div>
        </div>
        <div class="mt-3 flex gap-2">
          <span
            v-for="mood in period.topMoods"
            :key="mood.type"
            class="text-lg"
            :title="mood.type"
          >
            {{ mood.emoji }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
