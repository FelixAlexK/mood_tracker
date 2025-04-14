<script setup lang="ts">
import { weeklyTrendQueryOptions } from "@/lib/api";
import { getDayName } from "@/lib/utils";
import { useQuery } from "@tanstack/vue-query";
import { TrendingUp } from "lucide-vue-next";

import WrapperCardComponent from "../wrapper-card-component.vue";

const { data: weeklyTrend, isLoading: isLoadingWeeklyTrend } = useQuery(weeklyTrendQueryOptions);
</script>

<template>
  <WrapperCardComponent>
    <h2 class=" mb-4 flex items-center gap-2 max-lg:text-lg text-xl capitalize font-semibold">
      <TrendingUp class="w-5 lg:w-6 aspect-square h-auto" />
      Weekly Trend
    </h2>
    <span v-if="isLoadingWeeklyTrend">Loading...</span>
    <div v-else-if="weeklyTrend" class="grid grid-cols-7 gap-2">
      <div
        v-for="(day, index) in weeklyTrend"
        :key="index"
        class="text-center"
      >
        <div class="max-lg:text-sm  font-medium mb-1 text-gray-700">
          {{ getDayName(day.date, true) }}
        </div>
        <div
          class="aspect-square rounded-lg flex items-center justify-center"
          :class="day.count > 0 ? 'bg-gray-200 ring-2 ring-gray-500' : 'bg-gray-200 hover:bg-gray-200/50'"
        >
          <span v-if="day.count > 0" class="max-lg:text-lg text-xl">{{ day.emoji }}</span>
          <span v-else class="max-lg:text-lg text-xl">-</span>
        </div>
      </div>
    </div>
  </WrapperCardComponent>
</template>
