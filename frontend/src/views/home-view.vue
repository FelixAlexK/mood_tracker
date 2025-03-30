<script setup lang="ts">
import MoodCardComponent from "@/components/mood-card-component.vue";
import MoodFormComponent from "@/components/mood-form-component.vue";
import { getMoods } from "@/lib/api";
import { useMutationState, useQuery } from "@tanstack/vue-query";

import type { MoodEntry } from "../types";

const { data } = useQuery({
  queryKey: ["get-moods"],
  queryFn: () => getMoods("6"),
});

const variables = useMutationState<MoodEntry>({
  filters: { mutationKey: ["create-mood"], status: "pending" },
  select: mutation => mutation.state.variables as MoodEntry,
});
</script>

<template>
  <div>
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
    </section>
  </div>
</template>
