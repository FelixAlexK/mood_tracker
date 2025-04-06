<script setup lang="ts">
import { userQueryOptions } from "@/lib/api";
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
        <h3 class="text-lg font-bold text-gray-800 mb-4">
          Account Statistics
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="text-sm text-gray-600 mb-1">
              Total Entries
            </div>
            <div class="text-2xl font-bold text-gray-800">
              {{ 10 }}
            </div>
          </div>
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="text-sm text-gray-600 mb-1">
              Current Streak
            </div>
            <div class="text-2xl font-bold text-gray-800">
              {{ 1 }} days
            </div>
          </div>
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="text-sm text-gray-600 mb-1">
              Most Common Mood
            </div>
            <div class="text-2xl font-bold text-gray-800 flex items-center gap-2">
              {{ '❤️' }}
              <span class="capitalize">{{ 'Love' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
