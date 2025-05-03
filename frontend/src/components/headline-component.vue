<script setup lang="ts">
const { text, goBackLabel: backText } = defineProps<{
  text: string;
  goBackLabel?: string;
}>();

defineEmits<{
  (e: "goBack"): void;
}>();
</script>

<template>
  <section class="pt-32 pb-16 mx-auto  ">
    <div class="flex max-lg:flex-col-reverse  lg:items-center lg:justify-between">
      <h1 class=" font-bold max-lg:text-3xl text-wrap text-4xl">
        {{ text }}
      </h1>
      <button class="hover:text-mt-600 cursor-pointer text-nowrap transition-colors flex items-center max-lg:text-xl text-2xl font-semibold" @click="$emit('goBack')">
        <slot v-if="$slots.icon" name="icon" />
        {{ backText }}
      </button>
    </div>
  </section>
</template>
