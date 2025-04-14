<script setup lang="ts">
import HeadlineComponent from "@/components/headline-component.vue";
import AccountStats from "@/components/stats/account-stats-component.vue";
import WrapperCardComponent from "@/components/wrapper-card-component.vue";
import { userQueryOptions } from "@/lib/api";
import { useQuery } from "@tanstack/vue-query";
import { ArrowLeft } from "lucide-vue-next";

const { data } = useQuery(userQueryOptions);
</script>

<template>
  <div class="max-w-3xl mx-auto">
    <HeadlineComponent
      text="Profile"
      back-text="Back to Tracker"
      back-path="/"
    >
      <template #icon>
        <ArrowLeft class="w-5 lg:w-6 aspect-square h-auto" />
      </template>
    </HeadlineComponent>
    <WrapperCardComponent>
      <div v-if="data" class="flex items-center gap-6 mb-8">
        <img
          :src="data.picture || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces'"
          alt="Profile picture"
          class="w-24 h-24 rounded-full object-cover"
        >

        <div>
          <h2 class="text-xl max-lg:text-lg font-semibold capitalize">
            {{ data.given_name }}
          </h2>
        </div>
      </div>

      <div class="mt-8 pt-6 border-t">
        <AccountStats class="" />
      </div>
    </wrappercardcomponent>
  </div>
</template>
