<script setup lang="ts">
import NavComponent from "./components/nav-component.vue";
</script>

<template>
  <div>
    <NavComponent />
    <main class="min-h-screen bg-gray-100 p-6">
      <div class="container mx-auto">
        <RouterView />
      </div>
    </main>
  </div>
</template>
