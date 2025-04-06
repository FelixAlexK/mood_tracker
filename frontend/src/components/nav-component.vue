<script setup lang="ts">
import { useAuthStore } from "@/stores/auth-store";
import { BarChart3, Home, LogIn, LogOut, User } from "lucide-vue-next";
import { onMounted, onUnmounted, ref } from "vue";

const authStore = useAuthStore();

const open = ref(false);
const dropdownButtonRef = ref<HTMLButtonElement | null>(null);

// Custom composition function to handle click outside
function handleClickOutside(event: MouseEvent) {
  if (dropdownButtonRef.value && !dropdownButtonRef.value.contains(event.target as Node)) {
    open.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <nav class="bg-white shadow-sm ">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <router-link
            to="/"
            class="flex items-center px-2 py-2 text-gray-700 hover:text-blue-500 transition-colors"
          >
            <Home class="w-5 h-5 mr-1" />
            Home
          </router-link>
          <router-link
            to="/stats"
            class="flex items-center px-2 py-2 ml-4 text-gray-700 hover:text-blue-500 transition-colors"
          >
            <BarChart3 class="w-5 h-5 mr-1" />
            Stats
          </router-link>
        </div>
        <div class="flex items-center gap-4">
          <router-link
            to="/profile"
            class="flex items-center px-2 py-2 text-gray-700 hover:text-blue-500 transition-colors"
          >
            <User class="w-5 h-5 mr-1" />
            Profile
          </router-link>
          <a
            v-if="authStore.isLoggedIn"
            class="flex items-center px-2 py-2 text-red-500 hover:text-red-600 transition-colors"
            href="/api/logout"
          >
            <LogOut class="w-5 h-5 mr-1" />
            Logout
          </a>
          <a
            v-else
            class="flex items-center px-2 py-2 text-green-500 hover:text-green-600 transition-colors"
            href="/api/login"
          >
            <LogIn class="w-5 h-5 mr-1" />
            Login
          </a>
        </div>
      </div>
    </div>
  </nav>
</template>
