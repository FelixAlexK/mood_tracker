<script setup lang="ts">
import ButtonComponent from "@/components/button-component.vue";
import HeadlineComponent from "@/components/headline-component.vue";
import MoodCardComponent from "@/components/mood-card-component.vue";
import MoodFormComponent from "@/components/mood-form-component.vue";
import { useToast } from "@/composables/use-toast";
import { getMoods, postMood } from "@/lib/api";
import router from "@/router";
import { useAuthStore } from "@/stores/auth-store";
import { useMutation, useMutationState, useQuery, useQueryClient } from "@tanstack/vue-query";

import type { MoodEntry } from "../types";

const authStore = useAuthStore();

const toast = useToast();
const queryClient = useQueryClient();

const PAGE_SIZE = 1;
const PAGE = 1;

const { data } = useQuery({
  queryKey: ["get-moods"],
  queryFn: () => getMoods({ page: PAGE, pageSize: PAGE_SIZE }),

});

const variables = useMutationState<MoodEntry>({
  filters: { mutationKey: ["create-mood"], status: "pending" },
  select: mutation => mutation.state.variables as MoodEntry,
});

const { mutate } = useMutation({
  mutationKey: ["create-mood"],
  mutationFn: postMood,

  onSuccess: (data) => {
    toast.success(`${data.emoji} Mood successfully created!`);
  },

  onError: (error) => {
    toast.error(`${error.message}`);
  },

  onSettled: () => {
    // Refetch the moods after mutation
    queryClient.invalidateQueries({ queryKey: ["get-moods"] });
  },

});

async function handleSubmit(value: { note: string | null; type: string; emoji: string }) {
  mutate({
    type: value.type,
    emoji: value.emoji,
    note: value.note ? value.note.trim() : null,
    newest: false,
  });
}
</script>

<template>
  <div class="max-w-3xl mx-auto">
    <HeadlineComponent
      :text="`Welcome ${authStore.user?.given_name ?? ''}!`"
    />

    <div>
      <MoodFormComponent @submit="handleSubmit" />
    </div>

    <div v-if="authStore.isLoggedIn">
      <h3 class="block text-lg font-medium mb-2 pt-4">
        Latest Entry
      </h3>
      <div class="">
        <MoodCardComponent
          v-for="mood in data?.moods"
          :key="mood.id"
          :mood="mood"
        />

        <MoodCardComponent
          v-for="mood in variables"
          :key="mood.id"
          :mood="mood"
        />
      </div>
      <ButtonComponent :disabled="(data?.total ?? 0) <= 1" class="mt-4" text="See All" @click="router.push({ path: '/moods' })" />
    </div>
  </div>
</template>
