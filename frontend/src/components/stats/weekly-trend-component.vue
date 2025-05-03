<script setup lang="ts">
import { weeklyTrendQueryOptions } from "@/lib/api";
import { getDayName } from "@/lib/utils";
import { useQuery } from "@tanstack/vue-query";
import { TrendingUp } from "lucide-vue-next";

import WrapperCardComponent from "../wrapper-card-component.vue";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { data: weeklyTrend, isLoading: isLoadingWeeklyTrend } = useQuery(weeklyTrendQueryOptions);
</script>

<template>
  <WrapperCardComponent>
    <h2 class=" mb-8 flex items-center max-lg:text-lg text-xl capitalize font-semibold">
      <TrendingUp class="max-lg:text-xl text-2xl drop-shadow-lg mr-2" />
      {{ t('general.weeklyTrend') }}
    </h2>
    <span v-if="isLoadingWeeklyTrend || !weeklyTrend">Loading...</span>
    <div v-else-if="weeklyTrend" class="grid grid-cols-7 gap-4 px-4 lg:px-8">
      <div
        v-for="(day, index) in weeklyTrend.data"
        :key="index"
        class="text-center"
      >
        <div class="max-lg:text-sm  font-medium mb-4 ">
          {{ t(`dayNamesShort.${getDayName(day.date ?? '', true).toLowerCase()}`) }}
        </div>
        <div
          class="aspect-square rounded-lg flex items-center justify-center shadow-lg "
          :class="day.count > 0 ? 'bg-mt-200 ring-2 ring-mt-500' : 'bg-mt-100 hover:bg-mt-100/50'"
        >
          <span v-if="day.count > 0" class="max-lg:text-xl text-2xl drop-shadow-lg">{{ day.emoji }}</span>
          <span v-else class="max-lg:text-xl text-2xl text-mt-600">-</span>
        </div>
      </div>
    </div>
  </WrapperCardComponent>
</template>
