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
        <ArrowLeft class="max-lg:text-xl text-2xl drop-shadow-lg mr-2" />
      </template>
    </HeadlineComponent>
    <WrapperCardComponent>
      <div v-if="data" class="flex items-center mb-8 ">
        <img
          :src="data.data?.picture || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces'"
          alt="Profile picture"
          class="w-32 h-auto aspect-auto rounded-full drop-shadow-lg mr-8   object-cover  shadow-lg shadow-mt-600/90 "
        >

        <div>
          <h2 class="max-lg:text-lg text-xl capitalize font-semibold">
            {{ data.data?.given_name }}
            {{ data.data?.family_name }}
          </h2>
        </div>
      </div>

      <div class="pt-8 border-t">
        <AccountStats class="" />
      </div>
    </wrappercardcomponent>
  </div>
</template>
