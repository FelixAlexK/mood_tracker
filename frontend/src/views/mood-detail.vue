<script setup lang="ts">
import type { UpdateMood } from "@/types";

import HeadlineComponent from "@/components/headline-component.vue";
import { deleteMood, getMood, updateMood } from "@/lib/api";
import { formattedDate } from "@/lib/utils";
import router from "@/router";
import { MOOD_TYPES } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { Clock, Edit2, Save, Trash2, X } from "lucide-vue-next";
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
  isEditing.value = true;
  selectedType.value = data.value?.mood.type || "";
  selectedEmoji.value = data.value?.mood.emoji || "";
  editedNote.value = data.value?.mood.note || "";
}

function selectMood(type: string, emoji: string) {
  selectedType.value = type;
  selectedEmoji.value = emoji;
}

function saveChanges() {
  patch({ id, mood: { type: selectedType.value, emoji: selectedEmoji.value, note: editedNote.value.trim() || null } });
  isEditing.value = false;
}

function cancelEditing() {
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
  <HeadlineComponent text="Mood" />
  <div class="bg-white rounded-lg shadow-md p-6">
    <div v-if="!data">
      <!-- Show a loading state while data is being fetched -->
      <p class="text-gray-500 italic">
        Loading mood details...
      </p>
    </div>
    <div v-else class="flex justify-between items-start mb-6">
      <div>
        <div class="flex items-center gap-3 mb-2">
          <span class="text-4xl">{{ isEditing ? selectedEmoji : data?.mood?.emoji || '❤️' }}</span>
          <h2 class="text-2xl font-bold text-gray-800 capitalize">
            {{ isEditing ? selectedType : data?.mood?.type || '-' }}
          </h2>
        </div>
        <div class="flex items-center text-gray-500 text-sm">
          <Clock class="w-4 h-4 mr-1" />
          <span>{{ formattedDate(data?.mood?.createdAt || null) }}</span>
        </div>
      </div>
      <div class="flex gap-2">
        <button
          v-if="!isEditing"
          class="text-blue-500 hover:text-blue-600 transition-colors"
          @click="startEditing"
        >
          <Edit2 class="w-5 h-5" />
        </button>
        <button
          v-if="!isEditing"
          class="text-red-500 hover:text-red-600 transition-colors"
          @click="handleDelete"
        >
          <Trash2 class="w-5 h-5" />
        </button>
      </div>
    </div>

    <div v-if="isEditing">
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">
          How were you feeling?
        </label>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="{ type, emoji } in MOOD_TYPES"
            :key="type"
            type="button"
            class="p-3 rounded-lg text-center transition-all" :class="[
              selectedType === type
                ? 'bg-blue-100 ring-2 ring-blue-500'
                : 'bg-gray-50 hover:bg-gray-100',
            ]"
            @click="selectMood(type, emoji)"
          >
            <span class="text-2xl mb-1 block">{{ emoji }}</span>
            <span class="text-sm capitalize">{{ type }}</span>
          </button>
        </div>
      </div>

      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2">
          Note
        </label>
        <textarea
          v-model="editedNote"
          class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
          placeholder="How were you feeling?"
        />
      </div>

      <div class="flex gap-3">
        <button
          class="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          @click="saveChanges"
        >
          <Save class="w-4 h-4" />
          Save Changes
        </button>
        <button
          class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          @click="cancelEditing"
        >
          <X class="w-4 h-4" />
          Cancel
        </button>
      </div>
    </div>

    <div v-else>
      <p v-if="data?.mood?.note" class="text-gray-700 mt-4 whitespace-pre-wrap">
        {{ data?.mood?.note || '-' }}
      </p>
      <p v-else class="text-gray-500 italic mt-4">
        No note added
      </p>
    </div>
  </div>
</template>
