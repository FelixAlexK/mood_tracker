<script setup lang="ts">
import { moodDistributionQueryOptions } from "@/lib/api";
import { useQuery } from "@tanstack/vue-query";
import { PieChart } from "lucide-vue-next";
import { useI18n } from "vue-i18n";

import WrapperCardComponent from "../wrapper-card-component.vue";

const { t } = useI18n();

const { data: distribution, isLoading: isLoadingDist } = useQuery(moodDistributionQueryOptions());
</script>

<template>
  <WrapperCardComponent>
    <h2 class="max-lg:text-lg text-xl capitalize font-semibold mb-8 flex items-center ">
      <PieChart class="max-lg:text-xl text-2xl drop-shadow-lg mr-2" />
      {{ t("general.moodDistribution") }}
    </h2>
    <span v-if="isLoadingDist || !distribution">Loading...</span>
    <div v-else-if="distribution" class="grid grid-cols-1 gap-4">
      <div
        v-for="(mood, index) in distribution.data"
        :key="index"
        class="bg-mt-600/30 shadow-lg rounded-lg p-4 lg:p-8"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <span class="max-lg:text-xl text-2xl drop-shadow-lg mr-2">{{ mood.emoji }}</span>
            <span class="capitalize max-lg:text-lg text-xl font-semibold">{{ t(`types.${mood.type}`) }}</span>
          </div>
          <span class="max-lg:text-sm text-mt-600">{{ mood.percentage.toFixed(0) }}%</span>
        </div>
        <div class="h-2 bg-mt-100 rounded-full overflow-hidden">
          <div
            class="h-full bg-mt-500 rounded-full transition-all duration-500"
            :style="{ width: `${mood.percentage}%` }"
          />
        </div>
      </div>
    </div>
  </WrapperCardComponent>
</template>
