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
    class="w-full max-lg:text-base drop-shadow-lg  text-nowrap text-lg text-mt-100 py-2 font-bold  rounded-lg transition-colors flex items-center justify-center gap-2 "
    :class="{

      'bg-mt-600 hover:bg-mt-600/95': primary,
      'bg-mt-400 hover:bg-mt-400/95': !primary,
      'cursor-not-allowed opacity-50 drop-shadow-none': disabled,
      'cursor-pointer': !disabled,

    }"
    @click="!disabled && $emit('click')"
  >
    <slot name="icon" />
    {{ text }}
  </button>
</template>
