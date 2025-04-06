<script setup lang="ts">
import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-vue-next";
import { onMounted, ref } from "vue";

const { message, type = "info", duration = 3000 } = defineProps<{
  message: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
}>();

const show = ref(false);

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const typeClasses = {
  success: "border-l-4 border-green-500",
  error: "border-l-4 border-red-500",
  warning: "border-l-4 border-yellow-500",
  info: "border-l-4 border-blue-500",
};

const iconClasses = {
  success: "text-green-500",
  error: "text-red-500",
  warning: "text-yellow-500",
  info: "text-blue-500",
};

onMounted(() => {
  show.value = true;
  setTimeout(() => {
    show.value = false;
  }, duration);
});
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform translate-y-2 opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform translate-y-2 opacity-0"
  >
    <div
      v-if="show"
      class="fixed top-4 right-4 bg-white shadow-lg rounded-lg p-4 max-w-sm flex items-center gap-3"
      :class="typeClasses[type]"
    >
      <component
        :is="icons[type]"
        class="w-5 h-5 flex-shrink-0"
        :class="iconClasses[type]"
      />
      <p class="text-gray-700">
        {{ message }}
      </p>
    </div>
  </Transition>
</template>
