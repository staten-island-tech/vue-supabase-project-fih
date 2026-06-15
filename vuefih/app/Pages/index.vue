<script setup lang="ts">
const supabase = useSupabaseClient()
const { data } = await supabase.auth.getSession()

await navigateTo(data.session ? '/Aquarium' : '/login', { replace: true })
</script>

<template>
  <main class="loading-page">Loading...</main>
</template>

<style scoped>
.loading-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #e0f7fa;
  color: #0f172a;
  font-weight: 800;
}
</style>
