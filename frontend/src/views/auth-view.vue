<script setup lang="ts">
import { useToast } from "@/composables/use-toast";
import { LogIn, UserPlus } from "lucide-vue-next";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const toast = useToast();

const isLoading = ref(false);

async function handleLogin() {
  try {
    isLoading.value = true;

    toast.success("Logged in successfully");
    router.push("/api/login");
  }
  catch {
    toast.error("Invalid email or password");
  }
  finally {
    isLoading.value = false;
  }
}
async function handleRegister() {
  try {
    isLoading.value = true;
    toast.success("Logged in successfully");
    router.push("/api/register");
  }
  catch {
    toast.error("Invalid email or password");
  }
  finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="min-h-[calc(100vh-5rem)] flex items-center justify-center p-6">
    <button

      class="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      @click="handleLogin"
    >
      <LogIn class="w-5 h-5 mr-1" />
      Login
    </button>

    <button
      class="flex items-center px-4 py-2 bg-white text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-50 transition-colors"
      @click="handleRegister"
    >
      <UserPlus class="w-5 h-5 mr-1" />
      Register
    </button>
  </div>
</template>
