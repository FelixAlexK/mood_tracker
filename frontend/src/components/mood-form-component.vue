<script setup lang="ts">
import type { MoodEntry } from "@/types";

import { useToast } from "@/composables/use-toast"; // Import toast for warnings
import { MOOD_TYPES } from "@/types";
import { useForm } from "@tanstack/vue-form";
import {
  Ellipsis,
  Send,
  X,

} from "lucide-vue-next";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

import ButtonComponent from "./button-component.vue";
import WrapperCardComponent from "./wrapper-card-component.vue";

const { mood = {} as MoodEntry, cancellable = false } = defineProps<{ mood?: MoodEntry; cancellable?: boolean }>();

const emit = defineEmits<{
  (e: "submit", value: { note: string | null; type: string; emoji: string }): void;
  (e: "cancel"): void;
}>();

const { t } = useI18n();

const toast = useToast(); // Initialize toast
const selectedType = ref<typeof MOOD_TYPES[number]["type"] | undefined>(undefined);
const showAllMoods = ref(false);
const MAX = 200;

const form = useForm({
  defaultValues: {
    note: mood.note || "",
  },

  onSubmit: async ({ value }) => {
    // Check if a mood type is selected
    if (!selectedType.value) {
      toast.warning("Please select a mood before submitting."); // Show warning
      return; // Cancel submission
    }

    emit("submit", {
      type: selectedType.value,
      emoji: MOOD_TYPES.find(m => m.type === selectedType.value)?.emoji || "",
      note: value.note.trim() || null,
    });

    // Reset form fields after submission
    selectedType.value = undefined; // Reset to the first mood type
    showAllMoods.value = false; // Reset to show only the first 6 moods
    form.reset(); // Reset the form state
  },
});
</script>

<template>
  <WrapperCardComponent>
    <form class="" @submit.prevent.stop="form.handleSubmit">
      <div class="">
        <label class="block max-lg:text-lg text-xl font-medium mb-2">
          {{ t('general.howAreYouFeeling') }}
        </label>
        <div>
          <div class="grid grid-cols-3 gap-4">
            <button
              v-for="{ type, emoji } in MOOD_TYPES.slice(0, 6)"
              :key="type"
              type="button"
              class="p-2 lg:p-4 rounded-lg text-center transition-all cursor-pointer"
              :class="[
                selectedType === type
                  ? 'bg-mt-600/30 ring-2 ring-mt-500'
                  : 'bg-mt-100 hover:bg-mt-100/50',
              ]"
              @click="selectedType = type"
            >
              <span class="max-lg:text-3xl text-4xl mb-4 block drop-shadow-lg">{{ emoji }}</span>
              <span class="capitalize max-lg:text-sm font-semibold">{{ t(`types.${type}`) }}</span>
            </button>
          </div>
          <!-- Zeige die ersten 6 Stimmungen -->

          <!-- Button zum Umschalten der restlichen Stimmungen -->
          <button
            type="button"
            class=" cursor-pointer lg:mb-2 hover:text-mt-600 lg:px-1 max-lg:p-8 transition-all"
            @click="showAllMoods = !showAllMoods"
          >
            <Ellipsis class="max-lg:text-3xl text-4xl" />
          </button>

          <div class="grid grid-cols-3 gap-4">
            <button
              v-for="{ type, emoji } in MOOD_TYPES.slice(6)"
              v-show="showAllMoods"
              :key="type"
              type="button"
              class="p-2 lg:p-4 rounded-lg text-center transition-all cursor-pointer"
              :class="[
                selectedType === type
                  ? 'bg-mt-600/30 ring-2 ring-mt-500'
                  : 'bg-mt-100 hover:bg-mt-100/50',
              ]"
              @click="selectedType = type"
            >
              <span class="max-lg:text-3xl text-4xl mb-4 block drop-shadow-lg">{{ emoji }}</span>
              <span class="capitalize max-lg:text-sm font-semibold">{{ t(`types.${type}`) }}</span>
            </button>
          </div>
          <!-- Zeige die restlichen Stimmungen, wenn showAllMoods true ist -->
        </div>
      </div>
      <form.Field
        name="note"
        :validators="{
          onChange: ({ value }) =>
            value.length > MAX ? toast.warning(t('general.maxCharactersReached')) : undefined,
        }"
      >
        <template #default="{ field }">
          <div class="mt-8 mb-4">
            <label for="note" class="block max-lg:text-base text-lg mb-4">
              {{ t('general.addANote') }}
            </label>
            <textarea
              :name="field.name"
              :value="field.state.value"
              class="w-full p-4 bg-mt-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mt-600"
              rows="3"
              :maxlength="MAX"
              @input="(e) => {
                const value = (e.target as HTMLTextAreaElement)?.value || '';

                field.handleChange(value);
              }"
            />
            <div class="text-sm text-gray-500 mt-2">
              {{ field.state.value.length }}/{{ MAX }} <!-- Display character count -->
            </div>
            <em role="alert" class="text-red-500">{{
              field.state.meta.errors.join(', ')
            }}</em>
          </div>
        </template>
      </form.Field>
      <div class="flex gap-4">
        <ButtonComponent primary class="" :text="t('general.save')" type="submit">
          <template #icon>
            <Send class="max-lg:text-xl text-2xl drop-shadow-lg mr-2" />
          </template>
        </ButtonComponent>
        <ButtonComponent v-if="cancellable" class="" :text="t('general.cancel')" @click="emit('cancel')">
          <template #icon>
            <X class="max-lg:text-xl text-2xl drop-shadow-lg mr-2" />
          </template>
        </ButtonComponent>
      </div>
    </form>
  </WrapperCardComponent>
</template>
