<script setup lang="ts">
import NavComponent from "./components/nav-component.vue";
</script>

<template>
  <div>
    <NavComponent />
    <main class="min-h-screen bg-gray-100 p-6">
      <div class="max-w-2xl mx-auto">
        <RouterView />
      </div>
    </main>
  </div>
</template>
