<script setup lang="ts">
import ButtonComponent from "@/components/button-component.vue";
import HeadlineComponent from "@/components/headline-component.vue";
import MoodCardComponent from "@/components/mood-card-component.vue";
import MoodFormComponent from "@/components/mood-form-component.vue";
import { getMoods, getMoodsCount } from "@/lib/api";
import { useMutationState, useQuery } from "@tanstack/vue-query";

import type { MoodEntry } from "../types";

const { data } = useQuery({
  queryKey: ["get-moods"],
  queryFn: () => getMoods("6"),
});

const { data: moodCount } = useQuery({
  queryKey: ["get-moods-count"],
  queryFn: getMoodsCount,
});

const variables = useMutationState<MoodEntry>({
  filters: { mutationKey: ["create-mood"], status: "pending" },
  select: mutation => mutation.state.variables as MoodEntry,
});
</script>

<template>
  <div>
    <HeadlineComponent text="Mood Tracker" />
    <section>
      <MoodFormComponent />
    </section>
    <section>
      <h3 class="block text-gray-700 text-sm font-bold mb-2 pt-4">
        Latest Moods
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MoodCardComponent
          v-for="mood in data?.moods"
          :key="mood.id"
          :mood="mood"
          :variables="variables"
        />

        <MoodCardComponent
          v-for="mood in variables"
          v-show="variables"
          :key="mood.id"
          :mood="mood"
        />
      </div>
      <ButtonComponent :disabled="(moodCount?.count ?? 0) <= 6" class="mt-4" text="See All" />
    </section>
  </div>
</template>
