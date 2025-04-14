<script setup lang="ts">
const { type = "button", disabled = false, primary = false } = defineProps<{
  type?: "button" | "submit" | "reset" | undefined;
  text: string;
  disabled?: boolean;
  primary?: boolean;
}>();

defineEmits(["click"]);
</script>

<template>
  <button
    :type="type"
    class="w-full max-lg:text-base  text-nowrap text-lg text-gray-100 py-2 font-bold px-4 rounded-lg transition-colors flex items-center justify-center gap-2 "
    :class="{

      'bg-gray-600 hover:bg-gray-500/70': primary,
      'bg-gray-400 hover:bg-gray-400/70': !primary,
      'cursor-not-allowed opacity-50': disabled,
      'cursor-pointer': !disabled,

    }"
    @click="!disabled && $emit('click')"
  >
    <slot name="icon" />
    {{ text }}
  </button>
</template>
