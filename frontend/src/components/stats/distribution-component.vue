<script setup lang="ts">
import { moodDistributionQueryOptions } from "@/lib/api";
import { useQuery } from "@tanstack/vue-query";
import { ArrowLeft, PieChart } from "lucide-vue-next";

const { data: distribution, isLoading: isLoadingDist } = useQuery(moodDistributionQueryOptions());
</script>

<template>
  <div class="bg-white shadow-md rounded-lg p-4 mb-6">
    <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
      <PieChart class="w-5 h-5" />
      Mood Distribution
    </h2>
    <span v-if="isLoadingDist">Loading...</span>
    <div v-else-if="distribution" class="space-y-4">
      <div
        v-for="(mood, index) in distribution"
        :key="index"
        class="bg-gray-50 rounded-lg p-4"
      >
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="text-2xl">{{ mood.emoji }}</span>
            <span class="font-medium capitalize">{{ mood.type }}</span>
          </div>
          <span class="text-sm text-gray-600">{{ mood.percentage }}%</span>
        </div>
        <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            class="h-full bg-blue-500 rounded-full transition-all duration-500"
            :style="{ width: `${mood.percentage}%` }"
          />
        </div>
      </div>
    </div>
    <span v-else class="text-2xl">-</span>
  </div>
</template>
