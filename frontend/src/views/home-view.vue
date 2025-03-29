<script setup lang="ts">
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/vue-query";

async function getMoods() {
  const result = await api.moods.$get();
  if (!result.ok) {
    throw new Error("Failed to fetch moods");
  }
  const data = await result.json();
  return data;
}

const { isPending, isError, data, error } = useQuery({
  queryKey: ["get-moods"],
  queryFn: getMoods,
});

function formattedDate(createdAt: string | null) {
  return createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "No date";
}
</script>

<template>
  <div class=" grid grid-cols-1 md:grid-cols-2 gap-4">
    <div v-for="mood in data?.moods" :key="mood.id" class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow ">
      <div class="flex items-center justify-between mb-2">
        <span class="text-2xl">{{ mood.emoji }}</span>
        <span class="text-sm text-gray-600 capitalize">{{ mood.type }}</span>
      </div>

      <p v-if="mood.note" class="text-gray-700 mb-3 line-clamp-2">
        {{ mood.note }}
      </p>

      <div class="flex items-center text-gray-500 text-sm">
        <!-- <Clock class-name="w-4 h-4 mr-1" /> -->
        <span>{{ formattedDate(mood.createdAt) }}</span>
      </div>
    </div>
  </div>
</template>
