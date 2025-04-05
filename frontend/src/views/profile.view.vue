<script setup lang="ts">
import { getCurrentUser, userQueryOptions } from "@/lib/api";
import { useQuery } from "@tanstack/vue-query";

const { data, isPending, isError } = useQuery(userQueryOptions);
</script>

<template>
  <div>
    <span v-if="isPending">loading...</span>
    <span v-else-if="isError">not logged in</span>

    <div v-else>
      <p>Hello {{ data?.family_name }}</p>
    </div>
  </div>
</template>
