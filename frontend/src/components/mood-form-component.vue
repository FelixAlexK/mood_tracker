<script setup lang="ts">
import { postMood } from "@/lib/api";
import { MOOD_TYPES } from "@/types";
import { useForm } from "@tanstack/vue-form";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { format } from "date-fns";
import { Send } from "lucide-vue-next";
import { ref } from "vue";

import { useToast } from "../composables/use-toast";

const toast = useToast();
const queryClient = useQueryClient();

const selectedType = ref<typeof MOOD_TYPES[number]["type"]>(MOOD_TYPES[0].type);
const note = ref("");

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

const form = useForm({
  defaultValues: {
    note: "",
  },
  onSubmit: async ({ value }) => {
    mutate({
      // In a real app, this would come from auth
      type: selectedType.value,
      emoji: MOOD_TYPES.find(m => m.type === selectedType.value)?.emoji || "😊",
      note: value.note.trim() || null,
    });
    note.value = "";
  },
});
</script>

<template>
  <form class="bg-white rounded-lg shadow-md p-6 mb-6" @submit.prevent.stop="form.handleSubmit">
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2">
        How are you feeling?
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
          @click="selectedType = type"
        >
          <span class="text-2xl mb-1 block">{{ emoji }}</span>
          <span class="text-sm capitalize">{{ type }}</span>
        </button>
      </div>
    </div>

    <form.Field
      name="note"
    >
      <template #default="{ field }">
        <div class="mb-4">
          <label for="note" class="block text-gray-700 text-sm font-bold mb-2">
            Add a note (optional)
          </label>
          <textarea
            :name="field.name"
            :value="field.state.value"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            placeholder="How are you feeling today?"
            @input="(e) => field.handleChange((e.target as HTMLTextAreaElement)?.value || '')"
          />
        </div>
      </template>
    </form.Field>

    <button
      type="submit"
      class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
    >
      <Send class="w-4 h-4" />
      Save Mood
    </button>
  </form>
</template>
