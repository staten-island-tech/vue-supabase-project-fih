<script setup lang="ts">
const user = useSupabaseUser()

watch(user, () => {
  if (user.value) {
      return navigateTo('/Aquarium')
  }
}, { immediate: true })
</script>

<template>
  <main class="confirm-page">Confirming your account...</main>
</template>

<style scoped>
.confirm-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #e0f7fa;
  color: #0f172a;
  font-weight: 800;
}
</style>
