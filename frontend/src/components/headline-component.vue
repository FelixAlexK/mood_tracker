<script setup lang="ts">
const { text } = defineProps<{
  text: string;
}>();
</script>

<template>
  <section class="pt-24 pb-12 mx-auto">
    <div class="mx-auto">
      <div>
        <h2 class="text-dark mb-2 text-2xl font-semibold ">
          {{ text }}
        </h2>
      </div>
    </div>
  </section>
</template>
