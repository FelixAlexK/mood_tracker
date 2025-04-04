<script setup lang="ts">
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import { computed } from "vue";

const { page, totalPages } = defineProps({
  page: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },

});

const emit = defineEmits(["prevPage", "nextPage", "goToPage"]);

const displayedPages = computed(() => {
  const pages: number[] = [];
  const maxVisiblePages = 10;

  if (totalPages <= maxVisiblePages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // Always show first page
  pages.push(1);

  let startPage = Math.max(2, page - 1);
  let endPage = Math.min(totalPages - 1, page + 1);

  // Adjust if we're near the start
  if (page <= 3) {
    endPage = 4;
  }

  // Adjust if we're near the end
  if (page >= totalPages - 2) {
    startPage = totalPages - 3;
  }

  // Add ellipsis if needed
  if (startPage > 2) {
    pages.push(-1); // -1 represents ellipsis
  }

  // Add middle pages
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  // Add ellipsis if needed
  if (endPage < totalPages - 1) {
    pages.push(-1);
  }

  // Always show last page
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
});
</script>

<template>
  <div class="flex justify-center items-center gap-2 my-8">
    <button
      :disabled="page === 1"
      class="p-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      @click="emit('prevPage')"
    >
      <ChevronLeft class="w-5 h-5" />
    </button>

    <div class="flex gap-1">
      <button
        v-for="(p, index) in displayedPages"
        :key="index"
        class="min-w-[2.5rem] h-10 rounded-lg transition-colors flex items-center justify-center"
        :class="p === page ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'"
        @click="emit('goToPage', p)"
      >
        {{ p === -1 ? '...' : p }}
      </button>
    </div>

    <button
      :disabled="page === totalPages"
      class="p-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      @click="emit('nextPage')"
    >
      <ChevronRight class="w-5 h-5" />
    </button>
  </div>
</template>
