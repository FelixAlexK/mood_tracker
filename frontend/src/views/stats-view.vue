<script setup lang="ts">
import HeadlineComponent from "@/components/headline-component.vue";
import AccountStats from "@/components/stats/account-stats-component.vue";
import DistributionComponent from "@/components/stats/distribution-component.vue";
import MonthlyOverviewComponent from "@/components/stats/monthly-overview-component.vue";
import TimeOfDayAnalysisComponent from "@/components/stats/time-of-day-analysis-component.vue";
import WeeklyTrendComponent from "@/components/stats/weekly-trend-component.vue";
import { ArrowLeft } from "lucide-vue-next";
</script>

<template>
  <div class="max-w-6xl mx-auto">
    <HeadlineComponent
      text="Mood Statistics"
      back-text="Back to Tracker"
      back-path="/"
    >
      <template #icon>
        <ArrowLeft class="w-5 h-5" />
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
