<script setup lang="ts">
import { moodDistributionQueryOptions } from "@/lib/api";
import { useQuery } from "@tanstack/vue-query";
import { PieChart } from "lucide-vue-next";

import WrapperCardComponent from "../wrapper-card-component.vue";

const { data: distribution, isLoading: isLoadingDist } = useQuery(moodDistributionQueryOptions());
</script>

<template>
  <WrapperCardComponent>
    <h2 class="max-lg:text-lg text-xl capitalize font-semibold mb-4 flex items-center gap-2">
      <PieChart class="w-5 lg:w-6 aspect-square h-auto" />
      Mood Distribution
    </h2>
    <span v-if="isLoadingDist || !distribution">Loading...</span>
    <div v-else-if="distribution" class="space-y-4">
      <div
        v-for="(mood, index) in distribution"
        :key="index"
        class="bg-gray-200 rounded-lg p-4"
      >
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="max-lg:text-lg text-xl">{{ mood.emoji }}</span>
            <span class="capitalize max-lg:text-lg text-xl font-semibold">{{ mood.type }}</span>
          </div>
          <span class="max-lg:text-sm">{{ mood.percentage }}%</span>
        </div>
        <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            class="h-full bg-gray-500 rounded-full transition-all duration-500"
            :style="{ width: `${mood.percentage}%` }"
          />
        </div>
      </div>
    </div>
  </WrapperCardComponent>
</template>
