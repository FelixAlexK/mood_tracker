<script setup lang="ts">
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";

import NavComponent from "./components/nav-component.vue";

const { locale } = useI18n(); // Access i18n functions

onMounted(() => {
  const savedLocale = localStorage.getItem("user-locale");
  if (savedLocale) {
    locale.value = savedLocale;
  }
});
</script>

<template>
  <header>
    <NavComponent />
  </header>
  <main class="min-h-screen bg-mt-100 p-4 lg:p-8 text-gray-950">
    <RouterView v-slot="{ Component }">
      <template v-if="Component">
        <Transition mode="out-in">
          <KeepAlive>
            <Suspense>
              <!-- main content -->
              <component :is="Component" />

              <!-- loading state -->
              <template #fallback>
                Loading...
              </template>
            </Suspense>
          </KeepAlive>
        </Transition>
      </template>
    </RouterView>
  </main>
</template>
