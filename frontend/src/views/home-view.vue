<script setup lang="ts">
import ButtonComponent from "@/components/button-component.vue";
import HeadlineComponent from "@/components/headline-component.vue";
import MoodCardComponent from "@/components/mood-card-component.vue";
import MoodFormComponent from "@/components/mood-form-component.vue";
import { useToast } from "@/composables/use-toast";
import { getMoods, getTotalEntries, postMood } from "@/lib/api";
import router from "@/router";
import { useAuthStore } from "@/stores/auth-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";

import type { MoodEntry } from "../types";
import { moods } from "@backend/db/schema/moods";


const authStore = useAuthStore();

const toast = useToast();
const queryClient = useQueryClient();

const PAGE_SIZE = 1;
const PAGE = 1;

const { data } = useQuery({
  queryKey: ["get-moods"],
  queryFn: () => getMoods({ page: PAGE, page_size: PAGE_SIZE }),
});


const { mutate } = useMutation({
  mutationKey: ["create-mood"],
  mutationFn: postMood,

  

  onSuccess: async (data) => {

    if(data.error && data.error?.status === 401) {
      toast.error("Please login to create a mood");
      return;
    }

    queryClient.setQueryData(["get-moods"], data.data)


    toast.success(`${data.data?.emoji} Mood successfully created!`);
  },

  onError: (error, newMood, context) => {
    
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
      <h3 class="block max-lg:text-base text-lg font-medium mb-2 pt-8">
        Latest Entry
      </h3>
      <div class="">
        <MoodCardComponent
          v-for="mood in data?.data?.moods"
          :key="mood.id"
          :mood="mood"
        />
      </div>
      <ButtonComponent :disabled="(data?.data?.total.count ?? 0) <= 1" class="mt-4" text="See All" @click="router.push({ path: '/moods' })" />
    </div>
  </div>
</template>
