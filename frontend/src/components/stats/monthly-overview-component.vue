<script setup lang="ts">
import { getMonthlyOverView } from "@/lib/api";
import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/vue3";
import { useQuery } from "@tanstack/vue-query";
import { computed } from "vue";

const { data: monthlyOverview, isLoading: isMonthlyOverviewLoading } = useQuery({
  queryKey: ["monthly-overview"],
  queryFn: getMonthlyOverView,

});

const events = computed(() => {
  return (monthlyOverview.value ?? []).map(event => ({
    title: event.emoji,
    date: event.date,
  }));
});

const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin],
  initialView: "dayGridMonth",
  events: events.value,
}));
</script>

<template>
  <div class="mt-8">
    <span v-if="isMonthlyOverviewLoading">Loading...</span>
    <FullCalendar v-else :options="calendarOptions" />
  </div>
</template>
