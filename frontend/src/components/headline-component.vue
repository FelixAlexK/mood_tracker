<script setup lang="ts">
const { text, backText, backPath } = defineProps<{
  text: string;
  backText?: string;
  backPath?: string;
}>();
</script>

<template>
  <section class="pt-32 pb-16 mx-auto  ">
    <div class="flex max-lg:flex-col-reverse  lg:items-center lg:justify-between">
      <h1 class=" font-bold max-lg:text-3xl text-wrap text-4xl">
        {{ text }}
      </h1>
      <router-link
        v-if="backPath && backText"
        :to="backPath"
        class="hover:text-mt-600 cursor-pointer text-nowrap transition-colors flex items-center max-lg:text-xl text-2xl font-semibold"
      >
        <slot v-if="$slots.icon" name="icon" />
        {{ backText }}
      </router-link>
    </div>
  </section>
</template>
