<template>
  <div>
    <NuxtPage name="logIn" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(() => {
  navigateTo('/login')
});
</script>

<style scoped>

</style>