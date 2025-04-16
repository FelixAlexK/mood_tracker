<script setup lang="ts">
defineEmits(["click"]);
</script>

<template>
  <div class="bg-mt-200/50 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer flex flex-col h-full relative" @click="$emit('click')">
    <slot />
  </div>
</template>
