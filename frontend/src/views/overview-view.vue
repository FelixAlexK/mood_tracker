<script setup lang="ts">
import type { MoodEntry } from "@/types";

import HeadlineComponent from "@/components/headline-component.vue";
import MoodCardComponent from "@/components/mood-card-component.vue";
import PaginationComponent from "@/components/pagination-component.vue";
import { getMoodsQueryOptions } from "@/lib/api";
import router from "@/router";
import { useQuery } from "@tanstack/vue-query";
import { ArrowLeft } from "lucide-vue-next";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n(); // Access i18n functions

const PAGE_SIZE = ref(25);
const page = ref(1);

const { data, isPlaceholderData, isPending, isError, error } = useQuery(getMoodsQueryOptions(page, PAGE_SIZE));

function prevPage() {
  page.value = Math.max(page.value - 1, 1);
}
function nextPage() {
  if (!isPlaceholderData.value) {
    page.value = page.value + 1;
  }
}

function goToPage(p: number) {
  page.value = p;
}

const totalPages = computed(() => Math.ceil((data.value?.data?.total.count || 0) / PAGE_SIZE.value));

// Group moods by creation date
const groupedMoods = computed(() => {
  if (!data.value?.data?.moods)
    return {};

  return data.value.data?.moods.reduce((groups: Record<string, MoodEntry[]>, mood: any) => {
    const date = mood.created_at ? new Date(mood.created_at).toLocaleDateString() : "Unknown Date";
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(mood);
    return groups;
  }, {});
});
</script>

<template>
  <div class="max-w-3xl mx-auto">
    <HeadlineComponent
      :text="t('general.overview')"
      :go-back-label="t('general.back')"
      @go-back="() => router.back()"
    >
      <template #icon>
        <ArrowLeft class="max-lg:text-xl text-2xl drop-shadow-lg mr-2" />
      </template>
    </HeadlineComponent>
    <PaginationComponent
      :page="page"
      :total-pages="totalPages"
      @prev-page="prevPage"
      @next-page="nextPage"
      @go-to-page="goToPage"
    />
    <div v-if="isPending">
      Loading...
    </div>
    <div v-else-if="isError">
      An error has occurred: {{ error }}
    </div>

    <div v-else-if="data">
      <div v-for="(moods, date) in groupedMoods" :key="date" class="mb-8">
        <h2 class="max-lg:text-lg text-xl font-bold mb-4">
          {{ date }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MoodCardComponent
            v-for="mood in moods"
            :key="mood.id"
            :mood="mood"
          />
        </div>
      </div>
    </div>

    <PaginationComponent
      :page="page"
      :total-pages="totalPages"
      @prev-page="prevPage"
      @next-page="nextPage"
      @go-to-page="goToPage"
    />
  </div>
</template>
