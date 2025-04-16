<script setup lang="ts">
import type { MoodEntry } from "@/types";

import { formattedDate } from "@/lib/utils";
import router from "@/router";
import { Clock } from "lucide-vue-next";

import WrapperCardComponent from "./wrapper-card-component.vue";

const { mood } = defineProps<{
  mood: MoodEntry;
}>();

function handleRouterPush() {
  router.push(`/mood/${mood.id}`);
}
</script>

<template>
  <WrapperCardComponent @click="handleRouterPush">
    <div class="flex items-center justify-between  mb-8">
      <span class=" block max-lg:text-3xl text-4xl drop-shadow-lg">{{ mood.emoji }}</span>
      <span class="max-lg:text-sm font-semibold capitalize ">{{ mood.type }}</span>
    </div>
    <div v-if="mood.newest" class="bg-mt-600 font-bold text-mt-100  rounded-b-xl shadow-md max-lg:text-sm  absolute top-0 left-1/2  transform -translate-x-1/2   py-0.5 px-4">
      NEW
    </div>

    <p class="max-lg:text-lg text-xl mb-4 line-clamp-2 ">
      {{ mood.note ?? 'asds' }}
    </p>

    <div class="flex items-center mt-auto  text-mt-600">
      <Clock class="aspect-square w-4 h-auto drop-shadow-lg mr-2" />
      <time class="max-lg:text-xs text-sm" :datetime="mood.created_at ?? ''">{{ formattedDate(mood.created_at) }}</time>
    </div>
  </WrapperCardComponent>
</template>
