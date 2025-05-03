<script setup lang="ts">
import { timeOfDayAnalysisQueryOptions } from "@/lib/api";
import { useQuery } from "@tanstack/vue-query";
import { Clock } from "lucide-vue-next";

import WrapperCardComponent from "../wrapper-card-component.vue";

const { data: timeAnalysis, isLoading: isLoadingTimeAnalysis } = useQuery(timeOfDayAnalysisQueryOptions);
</script>

<template>
  <WrapperCardComponent>
    <h2 class=" mb-8 flex items-center  max-lg:text-lg text-xl capitalize font-semibold">
      <Clock class="max-lg:text-xl text-2xl drop-shadow-lg mr-2" />
      Time of Day Analysis
    </h2>
    <span v-if="isLoadingTimeAnalysis || !timeAnalysis">Loading...</span>
    <div v-else-if="timeAnalysis" class="grid grid-cols-1 gap-4">
      <div
        v-for="period in timeAnalysis.data"
        :key="period.timeOfDay"
        class="bg-mt-600/30 shadow-lg rounded-lg p-4 lg:p-8"
      >
        <div class="flex items-center justify-between mb-4">
          <span class=" capitalize max-lg:text-lg text-xl font-semibold">{{ period.timeOfDay }}</span>
          <span class="max-lg:text-sm text-mt-600">{{ Number.isNaN(period.percentage) ? 0 : Number(period.percentage).toFixed(0) }}%</span>
        </div>
        <div class="h-2 bg-mt-100 rounded-full overflow-hidden flex-grow ">
          <div
            class="h-full bg-mt-500 rounded-full transition-all duration-500"
            :style="{ width: `${Number.isNaN(period.percentage) ? 0 : period.percentage}%` }"
          />
        </div>
        <div class="flex  mt-4">
          <span
            v-for="mood in period.topMoods"
            :key="mood.type"
            class="max-lg:text-xl text-2xl drop-shadow-lg mr-2"
            :title="mood.type"
          >
            {{ mood.emoji }}
          </span>
        </div>
      </div>
    </div>
  </WrapperCardComponent>
</template>
