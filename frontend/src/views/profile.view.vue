<script setup lang="ts">
import AccountStats from "@/components/stats/account-stats-component.vue";
import { mostCommonQueryOptions, streakQueryOptions, totalEntriesQueryOptions, userQueryOptions } from "@/lib/api";
import { useQuery } from "@tanstack/vue-query";
import { ArrowLeft, Camera, RefreshCw, Save } from "lucide-vue-next";

const { data } = useQuery(userQueryOptions);
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold text-gray-800">
        Profile
      </h1>
      <router-link
        to="/"
        class="text-blue-500 hover:text-blue-600 transition-colors flex items-center gap-2"
      >
        <ArrowLeft class="w-5 h-5" />
        Back to Tracker
      </router-link>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6">
      <div v-if="data" class="flex items-center gap-6 mb-8">
        <img
          :src="data.picture || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces'"
          alt="Profile picture"
          class="w-24 h-24 rounded-full object-cover"
        >

        <div>
          <h2 class="text-2xl font-bold text-gray-800">
            {{ data.given_name }}
          </h2>
        </div>
      </div>

      <div class="mt-8 pt-6 border-t">
        <AccountStats />
      </div>
    </div>
  </div>
</template>
