<script setup lang="ts">
import NavComponent from "./components/nav-component.vue";
</script>

<template>
  <header>
    <NavComponent />
  </header>
  <main class="min-h-screen bg-mt-100 p-6 text-gray-950">
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
