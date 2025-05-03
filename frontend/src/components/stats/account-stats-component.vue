<script setup lang="ts">
import { mostCommonQueryOptions, streakQueryOptions, totalEntriesQueryOptions } from "@/lib/api";
import { useQuery } from "@tanstack/vue-query";
import { BookOpen, Flame } from "lucide-vue-next";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { data: totalEntries, isLoading: isLoadingTotal } = useQuery(totalEntriesQueryOptions);
const { data: mostCommon, isLoading: isLoadingMostCommon } = useQuery(mostCommonQueryOptions);
const { data: streak, isLoading: isLoadingStreak } = useQuery(streakQueryOptions);
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
    <div class="bg-mt-600/30 rounded-lg shadow-md p-4 lg:p-8">
      <h4 class="max-lg:text-xs text-sm font-medium mb-4 text-mt-600">
        {{ t('general.mostCommonMood') }}
      </h4>
      <span v-if="isLoadingMostCommon && (mostCommon?.data?.count ?? 0 > 0)">Loading...</span>
      <div v-else-if="mostCommon?.data?.count ?? 0 > 0" class="flex items-center">
        <span class="max-lg:text-xl text-2xl drop-shadow-lg mr-2">{{ mostCommon?.data?.emoji }}</span>
        <span class="max-lg:text-lg text-xl capitalize font-semibold">{{ mostCommon?.data?.type }}</span>
      </div>
      <span v-else class="max-lg:text-xl text-2xl">-</span>
    </div>

    <div class="bg-mt-600/30 rounded-lg shadow-md p-4 lg:p-8">
      <h4 class="max-lg:text-xs text-sm font-medium mb-4 text-mt-600">
        {{ t('general.totalEntries') }}
      </h4>
      <span v-if="isLoadingTotal && (mostCommon?.data?.count ?? 0 > 0)">Loading...</span>
      <div v-else class="flex items-center ">
        <BookOpen class="max-lg:text-xl text-2xl drop-shadow-lg text-purple-600 mr-2" />
        <span class="max-lg:text-lg text-xl capitalize font-semibold">{{ totalEntries?.data?.count }} {{ t('general.entry', { count: totalEntries?.data?.count}) }}</span>
      </div>
    </div>

    <div class="bg-mt-600/30 rounded-lg shadow-md p-4 lg:p-8">
      <h4 class="max-lg:text-xs text-sm font-medium mb-4 text-mt-600">
        {{ t('general.latestStreak') }}
      </h4>
      <span v-if="isLoadingStreak && (mostCommon?.data?.count ?? 0 > 0)">Loading...</span>
      <div v-else class="flex items-center ">
        <Flame class="max-lg:text-xl text-2xl drop-shadow-lg text-orange-500 mr-2" />
        <span class="max-lg:text-lg text-xl capitalize font-semibold">{{streak?.data?.streak_count || 0}} {{ t('general.day', { count: streak?.data?.streak_count || 0 }) }}</span>
      </div>
    </div>
  </div>
</template>
