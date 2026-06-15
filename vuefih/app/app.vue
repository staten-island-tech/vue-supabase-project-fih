<template>
  <div>
    <NuxtPage :key="route.fullPath" />
  </div>
</template>

<script setup>
const route = useRoute()
</script>

<style lang="scss" scoped>

</style>
