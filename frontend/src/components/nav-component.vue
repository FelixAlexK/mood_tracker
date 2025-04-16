<script setup lang="ts">
import router from "@/router";
import { useAuthStore } from "@/stores/auth-store";
import { BarChart3, Home, LogIn, LogOut, Menu, User, X } from "lucide-vue-next";
import { onMounted, onUnmounted, ref, watch } from "vue";

const authStore = useAuthStore();

const open = ref(false);
const dropdownButtonRef = ref<HTMLButtonElement | null>(null);

// Custom composition function to handle click outside
function handleClickOutside(event: MouseEvent) {
  if (dropdownButtonRef.value && !dropdownButtonRef.value.contains(event.target as Node)) {
    open.value = false;
  }
}

watch(router.currentRoute, (newValue, oldValue) => {
  if (newValue.path !== oldValue.path) {
    open.value = false;
  }
});

watch(open, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = "hidden"; // Disable scrolling
  }
  else {
    document.body.style.overflow = ""; // Re-enable scrolling
  }
});

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <nav class="bg-transparent backdrop-blur-lg shadow-sm fixed top-0 right-0 left-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
      <div class="flex justify-between h-16 max-lg:hidden">
        <div class="flex gap-4">
          <router-link
            to="/"
            class="flex items-center px-2 py-2  hover:text-mt-600 transition-colors"
            exact-active-class="border-b-2 border-mt-600 text-mt-600"
          >
            <Home class="max-lg:text-xl text-2xl drop-shadow-lg mr-2" />
            Home
          </router-link>
          <router-link
            v-if="authStore.isLoggedIn"
            to="/stats"
            class="flex items-center px-2 py-2   hover:text-mt-600 transition-colors"
            exact-active-class="border-b-2 border-mt-600 text-mt-600"
          >
            <BarChart3 class="max-lg:text-xl text-2xl drop-shadow-lg mr-2" />
            Stats
          </router-link>
          <span
            v-else
            class="flex items-center px-2 py-2 text-gray-400 cursor-not-allowed"
          >
            <BarChart3 class="max-lg:text-xl text-2xl drop-shadow-lg mr-2" />
            Stats
          </span>
        </div>
        <div class="flex gap-4">
          <router-link
            v-if="authStore.isLoggedIn"
            to="/profile"
            class="flex items-center px-2 py-2  hover:text-mt-600 transition-colors"
            exact-active-class="border-b-2 border-mt-600 text-mt-600"
          >
            <User class="max-lg:text-xl text-2xl drop-shadow-lg mr-2" />
            Profile
          </router-link>
          <span
            v-else
            class="flex items-center px-2 py-2  text-gray-400 cursor-not-allowed"
          >
            <User class="max-lg:text-xl text-2xl drop-shadow-lg" />
            Profile
          </span>
          <a
            v-if="authStore.isLoggedIn"
            class="flex items-center px-2 py-2 text-red-500 hover:text-red-600 transition-colors"
            href="/api/logout"
          >
            <LogOut class="max-lg:text-xl text-2xl drop-shadow-lg mr-2" />
            Logout
          </a>
          <a
            v-else
            class="flex items-center px-2 py-2 text-green-500 hover:text-green-600 transition-colors"
            href="/api/login"
          >
            <LogIn class="max-lg:text-xl text-2xl drop-shadow-lg mr-2" />
            Login
          </a>
        </div>
      </div>
      <div class="h-16 flex items-center justify-end lg:hidden cursor-pointer">
        <Menu class="max-lg:text-xl text-2xl drop-shadow-lg" @click="open = true" />
      </div>
    </div>
  </nav>

  <Teleport to="#app">
    <div v-if="open" class="fixed z-50 top-0 left-0 w-full h-full flex flex-col items-center justify-center backdrop-blur-lg ">
      <div class="relative w-full h-full">
        <button class="absolute top-12 right-12" @click="open = false">
          <X class="w-5 h-5" />
        </button>
        <nav class="flex flex-col items-start justify-center h-full gap-4 p-16">
          <router-link
            to="/"
            class="flex items-center px-2 py-2  hover:text-mt-600 transition-colors"
            exact-active-class="border-b-2 border-mt-600 text-mt-600"
          >
            <Home class="max-lg:text-xl text-2xl drop-shadow-lg mr-2" />
            Home
          </router-link>
          <router-link
            v-if="authStore.isLoggedIn"
            to="/stats"
            class="flex items-center px-2 py-2   hover:text-mt-600 transition-colors"
            exact-active-class="border-b-2 border-mt-600 text-mt-600"
          >
            <BarChart3 class="max-lg:text-xl text-2xl drop-shadow-lg mr-2" />
            Stats
          </router-link>
          <span
            v-else
            class="flex items-center px-2 py-2 text-mt-600/50 cursor-not-allowed"
          >
            <BarChart3 class="max-lg:text-xl text-2xl drop-shadow-lg mr-2" />
            Stats
          </span>
          <router-link
            v-if="authStore.isLoggedIn"
            to="/profile"
            class="flex items-center px-2 py-2  hover:text-mt-600 transition-colors"
            exact-active-class="border-b-2 border-mt-600 text-mt-600"
          >
            <User class="max-lg:text-xl text-2xl drop-shadow-lg mr-2" />
            Profile
          </router-link>
          <span
            v-else
            class="flex items-center px-2 py-2  text-mt-600/50 cursor-not-allowed"
          >
            <User class="max-lg:text-xl text-2xl drop-shadow-lg" />
            Profile
          </span>
          <a
            v-if="authStore.isLoggedIn"
            class="flex items-center px-2 py-2 text-red-500 hover:text-red-600 transition-colors"
            href="/api/logout"
          >
            <LogOut class="max-lg:text-xl text-2xl drop-shadow-lg mr-2" />
            Logout
          </a>
          <a
            v-else
            class="flex items-center px-2 py-2 text-green-500 hover:text-green-600 transition-colors"
            href="/api/login"
          >
            <LogIn class="max-lg:text-xl text-2xl drop-shadow-lg mr-2" />
            Login
          </a>
        </nav>
      </div>
    </div>
  </Teleport>
</template>
