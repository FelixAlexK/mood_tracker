<script setup lang="ts">
import type { UpdateMood } from "@/types";

import HeadlineComponent from "@/components/headline-component.vue";
import MoodFormComponent from "@/components/mood-form-component.vue";
import WrapperCardComponent from "@/components/wrapper-card-component.vue";
import { deleteMood, getMood, updateMood } from "@/lib/api";
import { formattedDate } from "@/lib/utils";
import router from "@/router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { ArrowLeft, Clock, Edit2, Trash2 } from "lucide-vue-next";
import { ref } from "vue";

import { useToast } from "../composables/use-toast";

const { id } = defineProps<{
  id: string;
}>();

const toast = useToast();

const queryClient = useQueryClient();

const isEditing = ref(false);
const selectedType = ref("");
const selectedEmoji = ref("");
const editedNote = ref("");

const { data } = useQuery({
  queryKey: ["get-mood-by-id", { id }],
  queryFn: () => getMood({ id }),
});

const { mutate: patch } = useMutation({
  mutationKey: ["update-mood"],
  mutationFn: (mood: { id: string; mood: UpdateMood }) => updateMood(mood),
  onSuccess: (data) => {
    queryClient.setQueryData(["get-mood-by-id", { id }], data);
    toast.success("Mood updated successfully!");
  },

  onError: (error) => {
    toast.error(`Failed to update mood: ${error.message}`);
  },
  onSettled: () => queryClient.invalidateQueries({ queryKey: ["get-mood-by-id", { id }] }),

});

const { mutate: deleteMutation } = useMutation({
  mutationKey: ["delete-mood"],
  mutationFn: () => deleteMood({ id }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["get-mood-by-id", { id }] });
    router.go(-1);
    toast.success("Mood deleted successfully!");
  },

  onError: (error) => {
    toast.error(`Failed to delete mood: ${error.message}`);
  },
});

function startEditing() {
  if(!isEditing.value) return 
  selectedType.value = data.value?.type || "";
  selectedEmoji.value = data.value?.emoji || "";
  editedNote.value = data.value?.note || "";
}

function cancelEditing() {
  isEditing.value = false;
  selectedType.value = "";
  selectedEmoji.value = "";
  editedNote.value = "";
}

function saveChanges(value: { note: string | null; type: string; emoji: string }) {
  patch({ id, mood: { type: value.type, emoji: value.emoji, note: value.note } });
  isEditing.value = false;
}

function handleDelete() {
  // eslint-disable-next-line no-alert
  if (confirm("Are you sure you want to delete this mood entry?")) {
    deleteMutation();
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto">
    <!-- Headline -->
    <HeadlineComponent
      :text="`Still ${data?.type || 'Unknown'}?`"
      back-text="Back to Tracker"
      back-path="/"
      class="capitalize"
    >
      <template #icon>
        <ArrowLeft class="max-lg:text-xl text-2xl drop-shadow-lg mr-2" />
      </template>
    </HeadlineComponent>

    <WrapperCardComponent>
      <div v-if="!data" class="text-center">
        <!-- Loading State -->
        <p class=" italic">
          Loading mood details...
        </p>
      </div>
      <div v-else>
        <!-- Mood Details Section -->
        <div class="flex items-center justify-between mb-8">
          <div class="flex  ">
            <span class="max-lg:text-3xl text-4xl drop-shadow-lg mr-2">{{ data?.emoji || '❤️' }}</span>
            <div>
              <h2 class="max-lg:text-lg text-xl font-bold text-gray-800 capitalize mb-4">
                {{ data?.type || '-' }}
              </h2>
              <div class="flex items-center text-mt-600 max-lg:text-xs text-sm ">
                <Clock class="aspect-square w-4 h-auto drop-shadow-lg mr-2" />
                <span>{{ formattedDate(data?.created_at || null) }}</span>
              </div>
            </div>
          </div>
          <!-- Action Buttons -->
          <div class="flex gap-4  flex-col lg:flex-row">
            <button
              class="text-blue-500 hover:text-blue-600 transition-colors"
              @click="startEditing; isEditing = !isEditing"
            >
              <Edit2 class="max-lg:text-xl text-2xl drop-shadow-lg " />
            </button>
            <button
              class="text-red-500 hover:text-red-600 transition-colors"
              @click="handleDelete"
            >
              <Trash2 class="max-lg:text-xl text-2xl drop-shadow-lg  " />
            </button>
          </div>
        </div>

        <!-- Note Section -->
        <div class="mb-8">
          <h3 class="max-lg:text-sm font-bold  mb-4">
            Your Note
          </h3>
          <p v-if="data?.note" class="text-mt-600 whitespace-pre-wrap text-lg max-lg:text-base">
            {{ data?.note }}
          </p>
          <p v-else class="text-mt-600 italic text-lg max-lg:text-base">
            No note added
          </p>
        </div>

        <!-- Edit Mode -->

        <MoodFormComponent v-if="isEditing" :mood="data" class="shadow-none hover:shadow-none w-full" @submit="saveChanges" @cancel="cancelEditing" />
      </div>
    </wrappercardcomponent>

    <!-- Mood Details Card -->
  </div>
</template>
