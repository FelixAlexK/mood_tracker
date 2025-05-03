<script setup lang="ts">
import HeadlineComponent from "@/components/headline-component.vue";
import AccountStats from "@/components/stats/account-stats-component.vue";
import WrapperCardComponent from "@/components/wrapper-card-component.vue";
import { userQueryOptions } from "@/lib/api";
import router from "@/router";
import { useQuery } from "@tanstack/vue-query";
import { ArrowLeft } from "lucide-vue-next";
import { onMounted } from "vue";

import { useI18n } from "vue-i18n";

const { t, locale } = useI18n(); // Access i18n functions

const { data } = useQuery(userQueryOptions);

function changeLocale(newLocale: string) {
  locale.value = newLocale; // Update the locale dynamically
  localStorage.setItem("user-locale", newLocale); // Save the selected locale
}


</script>

<template>
  <div class="max-w-3xl mx-auto">
    <HeadlineComponent :text="t('general.profile')" :go-back-label="t('general.back')" @go-back="() => router.back()">
      <template #icon>
        <ArrowLeft class="max-lg:text-xl text-2xl drop-shadow-lg mr-2" />
      </template>
    </HeadlineComponent>
    <WrapperCardComponent>
      <div v-if="data" class="flex flex-col mb-8 ">
        <div class="flex items-center flex-row">
          <img
            :src="data?.data?.picture || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces'"
            alt="Profile picture"
            class="w-32 h-auto aspect-auto rounded-full drop-shadow-lg mr-8   object-cover  shadow-lg shadow-mt-600/90 ">

          <div>
            <h2 class="max-lg:text-lg text-xl capitalize font-semibold">
              {{ data.data?.given_name }}
              {{ data.data?.family_name }}
            </h2>
          </div>
        </div>


        <div class="mt-8 flex justify-start items-center w-full">
          <select v-model="$i18n.locale" @change="changeLocale($i18n.locale)" class="bg-mt-600/10 text-mt-600/90 border border-mt-600/20 rounded-md px-4 py-2 focus:outline-none focus:ring focus:ring-mt-600/50">
            <option v-for="locale in $i18n.availableLocales" :key="`locale-${locale}`" :value="locale">{{ t(`locales.${locale}`) }}
            </option>
          </select>
        </div>
      </div>

      <div class="  border-t">
        <AccountStats class="mt-8" />
      </div>
    </WrapperCardComponent>

  </div>
</template>
