<script setup lang="ts">
import type { MoodEntry } from "@/types";

import HeadlineComponent from "@/components/headline-component.vue";
import MoodCardComponent from "@/components/mood-card-component.vue";
import PaginationComponent from "@/components/pagination-component.vue";
import { getMoods } from "@/lib/api";
import { keepPreviousData, useMutationState, useQuery } from "@tanstack/vue-query";
import { computed, ref } from "vue";

const PAGE_SIZE = 25;
const page = ref(1);

const { data, isPlaceholderData, isPending, isError, error } = useQuery({
  queryKey: ["get-moods", page],
  queryFn: () => getMoods({ page: page.value, pageSize: PAGE_SIZE }),
  placeholderData: keepPreviousData,
});

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

const variables = useMutationState<MoodEntry>({
  filters: { mutationKey: ["create-mood"], status: "pending" },
  select: mutation => mutation.state.variables as MoodEntry,
});

const totalPages = computed(() => Math.ceil((data.value?.total || 0) / PAGE_SIZE));

// Group moods by creation date
const groupedMoods = computed(() => {
  if (!data.value?.moods)
    return {};

  return data.value.moods.reduce((groups: Record<string, MoodEntry[]>, mood: MoodEntry) => {
    const date = mood.createdAt ? new Date(mood.createdAt).toLocaleDateString() : "Unknown Date"; // Format date as "MM/DD/YYYY"
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(mood);
    return groups;
  }, {});
});
</script>

<template>
  <section>
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
      <div v-for="(moods, date) in groupedMoods" :key="date" class="mb-6">
        <h2 class="text-xl font-bold mb-4">
          {{ date }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MoodCardComponent
            v-for="mood in moods"
            :key="mood.id"
            :mood="mood"
          />

          <MoodCardComponent
            v-for="mood in variables"
            v-show="variables"
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
  </section>
</template>
