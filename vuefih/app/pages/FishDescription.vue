<template>
  <div>
    <NuxtLink to="/AcquariumScreen">To Aquarium</NuxtLink>
    <div id="ShowFish">
      <img v-if="publicUrl" :src="publicUrl" alt="fish" style="max-width:100%;height:auto" />
      <p v-else>No image</p>
    </div>
    <input placeholder="Name" />
    <input placeholder="Fish Description" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { createClient } from '@supabase/supabase-js'

const publicUrl = ref(null)

onMounted(() => {
  const SUPABASE_URL = process.env.NUXT_PUBLIC_SUPABASE_URL || 'https://zyjawkkqocasuwvuaxxv.supabase.co'
  const SUPABASE_ANON = process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_G5zffL3bGX59EzIERu590w_RQxjqzgT'
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)

  const path = 'Fish Drawings/pixel_art_1780675093881.png'
  const { data, error } = supabase.storage.from('Fish').getPublicUrl(path)
  if (error) {
    console.error('getPublicUrl error:', error)
    return
  }
  publicUrl.value = data?.publicUrl || data?.publicURL || null
})
</script>

<style scoped>
</style>