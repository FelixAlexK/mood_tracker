<script setup lang="ts">
const { text, backText, backPath } = defineProps<{
  text: string;
  backText?: string;
  backPath?: string;
}>();
</script>

<template>
  <section class="pt-24 pb-12 mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold text-gray-800">
        {{ text }}
      </h1>
      <router-link
        v-if="backPath && backText"
        :to="backPath"
        class="text-blue-500 hover:text-blue-600 transition-colors flex items-center gap-2"
      >
        <slot v-if="$slots.icon" name="icon" />
        {{ backText }}
      </router-link>
    </div>
  </section>
</template>
