<script setup lang="ts">
import NavComponent from "./components/nav-component.vue";
</script>

<template>
  <div>
    <NavComponent />
    <main class="min-h-screen bg-gray-100 p-6">
      <div class="max-w-2xl mx-auto">
        <section class=" py-[70px] mx-auto">
          <div class="mx-auto px-4 sm:container">
            <div>
              <h2 class="text-dark mb-2 text-2xl font-semibold ">
                {{ $route.name }}
              </h2>
            </div>
          </div>
        </section>
        <RouterView />
      </div>
    </main>
  </div>
</template>
