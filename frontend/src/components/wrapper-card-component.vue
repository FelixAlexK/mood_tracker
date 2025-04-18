<script setup lang="ts">
defineEmits(["click"]);
</script>

<template>
  <div class="bg-mt-200/50 rounded-lg shadow-md p-4  lg:p-8 hover:shadow-lg transition-shadow cursor-pointer flex flex-col h-full relative" @click="$emit('click')">
    <slot />
  </div>
</template>
