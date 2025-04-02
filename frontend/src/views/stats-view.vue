<script setup lang="ts">
import HeadlineComponent from "@/components/headline-component.vue";
import { BarChart3, BookOpen, Flame } from "lucide-vue-next";

// import type { MoodEntry } from "../types";

// const props = defineProps<{
//   moods: MoodEntry[];
// }>();

// const totalEntries = computed(() => props.moods.length);

// const moodDistribution = computed(() => {
//   const distribution = props.moods.reduce((acc, mood) => {
//     acc[mood.type] = (acc[mood.type] || 0) + 1;
//     return acc;
//   }, {} as Record<string, number>);

//     return Object.entries(distribution).map(([type, count]) => {
//       const percentage = Math.round((count / props.moods.length) * 100);
//       const emoji = props.moods.find(m => m.type === type)?.emoji || "";
//       return { type, count, percentage, emoji };
//     }).sort((a, b) => b.count - a.count);

// });

// const mostCommonMood = computed(() => {
//   return moodDistribution.value[0] || { type: "none", emoji: "😐" };
// });

// const currentStreak = computed(() => {
//   if (props.moods.length === 0)
//     return 0;

//   const sortedMoods = [...props.moods].sort((a, b) =>
//     new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime(),
//   );

//   let streak = 1;
//   let currentDate = new Date(sortedMoods[0].createdAt!);

//   for (let i = 1; i < sortedMoods.length; i++) {
//     const moodDate = new Date(sortedMoods[i].createdAt!);
//     const diffDays = Math.floor(
//       (currentDate.getTime() - moodDate.getTime()) / (1000 * 60 * 60 * 24),
//     );

//     if (diffDays === 1) {
//       streak++;
//       currentDate = moodDate;
//     }
//     else {
//       break;
//     }
//   }

//   return streak;
// });

// const weeklyTrend = computed(() => {
//   const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
//   const today = new Date();
//   const lastWeek = Array.from({ length: 7 }, (_, i) => {
//     const date = new Date(today);
//     date.setDate(date.getDate() - i);
//     return {
//       date: date.toISOString().split("T")[0],
//       dayName: days[date.getDay()],
//       mood: props.moods.find(m =>
//         new Date(m.createdAt!).toISOString().split("T")[0] === date.toISOString().split("T")[0],
//       ),
//     };
//   }).reverse();

//   return lastWeek;
// });
</script>

<template>
  <HeadlineComponent text="Stats" />
  <div class="bg-white rounded-lg shadow-md p-6 mb-6">
    <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
      <BarChart3 class="w-5 h-5" />
      Mood Insights
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-blue-50 rounded-lg p-4">
        <h3 class="text-sm font-semibold text-gray-600 mb-1">
          Most Common Mood
        </h3>
        <div class="flex items-center gap-2">
          <span class="text-2xl">{{ '❤️' }}</span>
          <span class="text-lg font-medium capitalize">{{ 'Love' }}</span>
        </div>
      </div>

      <div class="bg-purple-50 rounded-lg p-4">
        <h3 class="text-sm font-semibold text-gray-600 mb-1">
          Total Entries
        </h3>
        <div class="flex items-center gap-2">
          <BookOpen class="w-5 h-5 text-purple-600" />
          <span class="text-lg font-medium">{{ 10 }} entries</span>
        </div>
      </div>

      <div class="bg-green-50 rounded-lg p-4">
        <h3 class="text-sm font-semibold text-gray-600 mb-1">
          Latest Streak
        </h3>
        <div class="flex items-center gap-2">
          <Flame class="w-5 h-5 text-orange-500" />
          <span class="text-lg font-medium">{{ 1 }} days</span>
        </div>
      </div>
    </div>

    <div class="space-y-4">
      <div>
        <h3 class="text-sm font-semibold text-gray-600 mb-2">
          Mood Distribution
        </h3>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
          <div
            v-for="(mood, index) in 10"
            :key="index"
            class="bg-gray-50 rounded-lg p-3"
          >
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xl">{{ '❤️' }}</span>
              <span class="capitalize">{{ 'Love' }}</span>
            </div>
            <div class="flex items-center gap-2">
              <div
                class="h-2 rounded-full bg-blue-200 flex-grow"
                :style="{ width: `${33}%` }"
              >
                <div
                  class="h-full rounded-full bg-blue-500"
                  :style="{ width: `${33}%` }"
                />
              </div>
              <span class="text-sm text-gray-600">{{ 33 }}%</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="true">
        <h3 class="text-sm font-semibold text-gray-600 mb-2">
          Weekly Trend
        </h3>
        <div class="grid grid-cols-7 gap-1">
          <div
            v-for="(day, index) in 10"
            :key="index"
            class="text-center"
          >
            <div class="text-xs text-gray-500 mb-1">
              {{ 'Monday' }}
            </div>
            <div
              class="w-10 h-10 mx-auto rounded-full flex items-center justify-center"
              :class="true ? 'bg-blue-50' : 'bg-gray-50'"
            >
              <span v-if="true" class="text-lg">{{ '❤️' }}</span>
              <span v-else class="text-xs text-gray-400">-</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
