<script setup lang="ts">
import { getMonthlyOverView } from "@/lib/api";
import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/vue3";
import { useQuery } from "@tanstack/vue-query";
import { BarChart3, Calendar } from "lucide-vue-next";
import { computed } from "vue";

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
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
      <Calendar class="w-5 h-5" />
      Monthly Overview
    </h2>
    <span v-if="isMonthlyOverviewLoading">Loading...</span>
    <FullCalendar v-else :options="calendarOptions" />
  </div>
</template>
