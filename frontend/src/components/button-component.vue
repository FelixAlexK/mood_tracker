<script setup lang="ts">
const { type = "button", disabled = false } = defineProps<{
  type?: "button" | "submit" | "reset" | undefined;
  text: string;
  disabled?: boolean;
}>();

defineEmits(["click"]);
</script>

<template>
  <button
    :type="type"
    class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
    :class="{
      'opacity-50 cursor-not-allowed': disabled,
    }"
    @click="!disabled && $emit('click')"
  >
    <slot name="icon" />
    {{ text }}
  </button>
</template>
