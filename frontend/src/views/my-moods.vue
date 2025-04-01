<script setup lang="ts">
import type { MoodEntry } from "@/types";

import HeadlineComponent from "@/components/headline-component.vue";
import MoodCardComponent from "@/components/mood-card-component.vue";
import { getMoods } from "@/lib/api";
import { useMutationState, useQuery } from "@tanstack/vue-query";

const { data } = useQuery({
  queryKey: ["get-moods"],
  queryFn: () => getMoods(undefined),
});

const variables = useMutationState<MoodEntry>({
  filters: { mutationKey: ["create-mood"], status: "pending" },
  select: mutation => mutation.state.variables as MoodEntry,
});
</script>

<template>
  <HeadlineComponent text="My Moods" />
  <section>
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
</template>
