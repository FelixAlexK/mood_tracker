<script setup lang="ts">
import HeadlineComponent from "@/components/headline-component.vue";
import AccountStats from "@/components/stats/account-stats-component.vue";
import DistributionComponent from "@/components/stats/distribution-component.vue";
import MonthlyOverviewComponent from "@/components/stats/monthly-overview-component.vue";
import TimeOfDayAnalysisComponent from "@/components/stats/time-of-day-analysis-component.vue";
import WeeklyTrendComponent from "@/components/stats/weekly-trend-component.vue";
import router from "@/router";
import { ArrowLeft } from "lucide-vue-next";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <div class="max-w-6xl mx-auto">
    <HeadlineComponent
      :text="t('general.moodStatistics')"
      :go-back-label="t('general.back')"
      @go-back="() => router.back()"
    >
      <template #icon>
        <ArrowLeft class="max-lg:text-xl text-2xl drop-shadow-lg mr-2" />
      </template>
    </HeadlineComponent>

    <AccountStats />

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <DistributionComponent />
      <WeeklyTrendComponent />
      <TimeOfDayAnalysisComponent />
      <MonthlyOverviewComponent />
    </div>
  </div>
</template>
