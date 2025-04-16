<script setup lang="ts">
import { MOOD_TYPES } from "@/types";
import { useForm } from "@tanstack/vue-form";
import { Send, X } from "lucide-vue-next";
import { ref } from "vue";

import ButtonComponent from "./button-component.vue";
import WrapperCardComponent from "./wrapper-card-component.vue";

const emit = defineEmits<{
  (e: "submit", value: { note: string | null; type: string; emoji: string }): void;
  (e: "cancel"): void;
}>();

const selectedType = ref<typeof MOOD_TYPES[number]["type"]>(MOOD_TYPES[0].type);
const note = ref("");

const form = useForm({
  defaultValues: {
    note: "",

  },
  onSubmit: async ({ value }) => {
    emit("submit", {
      type: selectedType.value,
      emoji: MOOD_TYPES.find(m => m.type === selectedType.value)?.emoji || "😊",
      note: value.note.trim() || null,
    });

    // Reset form fields after submission
    selectedType.value = MOOD_TYPES[0].type; // Reset to the first mood type
    note.value = ""; // Clear the note field
    form.reset(); // Reset the form state
  },
});
</script>

<template>
  <WrapperCardComponent>
    <form class="" @submit.prevent.stop="form.handleSubmit">
      <div class="mb-4">
        <label class="block max-lg:text-lg text-xl font-medium mb-2">
          How are you feeling?
        </label>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="{ type, emoji } in MOOD_TYPES"
            :key="type"
            type="button"
            class="p-3 rounded-lg text-center transition-all cursor-pointer" :class="[
              selectedType === type
                ? 'bg-mt-600/30 ring-2 ring-mt-500'
                : 'bg-mt-100 hover:bg-mt-100/50',
            ]"
            @click="selectedType = type"
          >
            <span class="max-lg:text-3xl text-4xl mb-1 block drop-shadow-lg">{{ emoji }}</span>
            <span class="capitalize max-lg:text-sm font-semibold">{{ type }}</span>
          </button>
        </div>
      </div>

      <form.Field
        name="note"
      >
        <template #default="{ field }">
          <div class="mb-4 mt-8">
            <label for="note" class="block max-lg:text-base  text-lg mb-2">
              Add a note (optional)
            </label>
            <textarea
              :name="field.name"
              :value="field.state.value"
              class="w-full px-3 py-2 bg-mt-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mt-600"
              rows="3"
              @input="(e) => field.handleChange((e.target as HTMLTextAreaElement)?.value || '')"
            />
          </div>
        </template>
      </form.Field>
      <div class="flex gap-3">
        <ButtonComponent primary class="mt-4" text="Save Mood" type="submit">
          <template #icon>
            <Send class="w-4 h-4" />
          </template>
        </ButtonComponent>
        <ButtonComponent class="mt-4" text="Cancel" @click="emit('cancel')">
          <template #icon>
            <X class="w-4 h-4" />
          </template>
        </ButtonComponent>
      </div>
    </form>
  </WrapperCardComponent>
</template>
