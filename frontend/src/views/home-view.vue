<script setup lang="ts">
import ButtonComponent from "@/components/button-component.vue";
import HeadlineComponent from "@/components/headline-component.vue";
import MoodCardComponent from "@/components/mood-card-component.vue";
import MoodFormComponent from "@/components/mood-form-component.vue";
import { useToast } from "@/composables/use-toast";
import { getMoods, postMood } from "@/lib/api";
import router from "@/router";
import { useAuthStore } from "@/stores/auth-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { ref } from "vue";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const authStore = useAuthStore();

const toast = useToast();
const queryClient = useQueryClient();

const PAGE_SIZE = ref(1);
const PAGE = ref(1);

const { data } = useQuery({
  queryKey: ["get-moods"],
  queryFn: () => getMoods({ page: PAGE, page_size: PAGE_SIZE }),
});

const { mutate } = useMutation({
  mutationKey: ["create-mood"],
  mutationFn: postMood,

  onSuccess: async (data) => {
    if (data.error && data.error?.status === 401) {
      toast.error("Please login to create a mood");
      return;
    }

    if (data.error) {
      toast.error(`Failed to create mood: ${data.error.message}`);
      return;
    }

    toast.success(`${data.data?.emoji} Mood successfully created!`);
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
      :text="t('general.welcomeMessage', { msg: authStore.user?.given_name ?? '' })"
    />

    <div>
      <MoodFormComponent @submit="handleSubmit" />
    </div>

    <div v-if="authStore.isLoggedIn">
      <h3 class="block max-lg:text-base text-lg font-medium mb-2 pt-8">
        {{ t('general.lastEntry') }}
      </h3>
      <div class="">
        <MoodCardComponent
          v-for="mood in data?.data?.moods"
          :key="mood.id"
          :mood="mood"
        />
      </div>
      <ButtonComponent :disabled="(data?.data?.total.count ?? 0) <= 1" class="mt-4" :text="t('general.seeAll')" @click="router.push({ path: '/moods' })" />
    </div>
  </div>
</template>
