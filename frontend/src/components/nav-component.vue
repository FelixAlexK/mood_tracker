<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

import { routes } from "../router";

const open = ref(false);
const dropdownButtonRef = ref<HTMLButtonElement | null>(null);

function toggleNavbar() {
  open.value = !open.value;
}

const navLinkItems = ref(routes);

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
  <header
    class="flex w-full items-center bg-white dark:bg-dark"
  >
    <div class="container">
      <div class="relative -mx-4 flex items-center justify-between">
        <div class="w-60 max-w-full px-4">
          <a href="/#" class="block w-full py-5">
            <img
              src="https://cdn.tailgrids.com/2.0/image/assets/images/logo/logo-primary.svg"
              alt="logo"
              class="dark:hidden"
            >
            <img
              src="https://cdn.tailgrids.com/2.0/image/assets/images/logo/logo-white.svg"
              alt="logo"
              class="hidden dark:block"
            >
          </a>
        </div>
        <div class="flex w-full items-center justify-between px-4">
          <div>
            <button
              id="navbarToggler"
              ref="dropdownButtonRef"
              class="absolute right-4 top-1/2 block -translate-y-1/2 rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden"
              @click="toggleNavbar"
            >
              <span
                class="relative my-[6px] block h-[2px] w-[30px] bg-body-color dark:bg-white"
              />
              <span
                class="relative my-[6px] block h-[2px] w-[30px] bg-body-color dark:bg-white"
              />
              <span
                class="relative my-[6px] block h-[2px] w-[30px] bg-body-color dark:bg-white"
              />
            </button>
            <nav
              id="navbarCollapse"
              :class="{ hidden: !open }"
              class="absolute right-4 top-full w-full max-w-[250px] rounded-lg bg-white px-6 py-5 shadow dark:bg-dark-2 lg:static lg:block lg:w-full lg:max-w-full lg:shadow-none lg:dark:bg-transparent"
            >
              <ul class="block lg:flex">
                <template v-for="(item, index) in navLinkItems.filter((v) => v.name !== '')" :key="index">
                  <li>
                    <RouterLink :to="item.path" class="flex py-2 text-base font-medium text-body-color hover:text-dark dark:text-dark-6 dark:hover:text-white lg:ml-12 lg:inline-flex">
                      {{ item.name }}
                    </RouterLink>
                  </li>
                </template>
              </ul>
            </nav>
          </div>
          <div class="hidden justify-end pr-16 sm:flex lg:pr-0">
            <a
              href="/api/login"
              class="px-7 py-3 text-base font-medium text-dark hover:text-primary dark:text-white"
            >Sign in</a>
            <a
              href="/api/register"
              class="rounded-md bg-primary px-7 py-3 text-base font-medium text-white hover:bg-primary/90"
            >Sign Up</a>
            <a
              href="/api/logout"
              class="rounded-md bg-primary px-7 py-3 text-base font-medium text-white hover:bg-primary/90"
            >Logout</a>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
