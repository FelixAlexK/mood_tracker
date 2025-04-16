<script setup lang="ts">
import { getMonthlyOverView } from "@/lib/api";
import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/vue3";
import { useQuery } from "@tanstack/vue-query";
import { Calendar } from "lucide-vue-next";
import { computed } from "vue";

import WrapperCardComponent from "../wrapper-card-component.vue";

const { data: monthlyOverview, isLoading: isMonthlyOverviewLoading } = useQuery({
  queryKey: ["monthly-overview"],
  queryFn: getMonthlyOverView,

});

const events = computed(() => {
  const uniqueEvents = new Map(); // Use a Map to ensure unique dates
  (monthlyOverview.value ?? []).forEach((event) => {
    if (!uniqueEvents.has(event.date)) {
      uniqueEvents.set(event.date, {
        title: event.emoji, // Start with the first emoji
        date: event.date,
        emojis: new Set([event.emoji]), // Track emojis using a Set
      });
    }
    else {
      // Merge emojis for the same date, ensuring no duplicates
      const existingEvent = uniqueEvents.get(event.date);
      existingEvent.emojis.add(event.emoji); // Add emoji to the Set
      existingEvent.title = Array.from(existingEvent.emojis).join(" "); // Update title with unique emojis
      uniqueEvents.set(event.date, existingEvent);
    }
  });
  // Convert Map values to an array and remove the `emojis` field
  return Array.from(uniqueEvents.values()).map(({ emojis, ...event }) => event);
});

const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin],
  initialView: "dayGridMonth",
  events: events.value,
}));
</script>

<template>
  <WrapperCardComponent>
    <h2 class=" mb-8 flex items-center  max-lg:text-lg text-xl capitalize font-semibold">
      <Calendar class="max-lg:text-xl text-2xl drop-shadow-lg mr-2" />
      Monthly Overview
    </h2>
    <span v-if="isMonthlyOverviewLoading">Loading...</span>
    <FullCalendar v-else class="h-fit max-lg:text-sm" :options="calendarOptions" />
  </WrapperCardComponent>
</template>
