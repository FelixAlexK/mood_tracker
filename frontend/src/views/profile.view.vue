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
        <ArrowLeft class="max-lg:text-xl text-2xl drop-shadow-lg" />
      </template>
    </HeadlineComponent>
    <WrapperCardComponent>
      <div v-if="data" class="flex items-center gap-6 mb-8 ">
        <img
          :src="data.picture || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces'"
          alt="Profile picture"
          class="w-32 h-auto aspect-auto rounded-full drop-shadow-lg   object-cover  shadow-lg shadow-mt-600/90 "
        >

        <div>
          <h2 class="max-lg:text-lg text-xl capitalize font-semibold">
            {{ data.given_name }}
            {{ data.family_name }}
          </h2>
        </div>
      </div>

      <div class="mt-8 pt-6 border-t">
        <AccountStats class="" />
      </div>
    </wrappercardcomponent>
  </div>
</template>
