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
    <div class="flex items-center justify-between mb-2 ">
      <span class=" block text-4xl">{{ mood.emoji }}</span>
      <span class=" text-2xl capitalize font-semibold">{{ mood.type }}</span>
    </div>
    <div v-if="mood.newest" class="bg-gray-700 font-bold text-gray-200  rounded-b-xl shadow-md  absolute top-0 left-1/2  transform -translate-x-1/2   py-0.5 px-4">
      NEW
    </div>

    <p class="text-xl mb-8 mt-4 line-clamp-2 ">
      {{ mood.note ?? '' }}
    </p>

    <div class="flex items-center mt-auto text-sm text-gray-500">
      <Clock class="w-4 h-4 mr-1 " />
      <time :datetime="mood.createdAt ?? ''">{{ formattedDate(mood.createdAt) }}</time>
    </div>
  </WrapperCardComponent>
</template>
