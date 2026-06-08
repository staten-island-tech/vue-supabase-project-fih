<template>
    <div>
        <RouterLink to="AcquariumScreen">To Acquarium</RouterLink>
        <div id = "ShowFish"></div>
        <input>Name:</input>
        <input>Fish Description:</input>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://zyjawkkqocasuwvuaxxv.supabase.co',
  'sb_publishable_G5zffL3bGX59EzIERu590w_RQxjqzgT'
)

const publicUrl = ref(null)

onMounted(() => {
  const path = 'Fish Drawings/pixel_art_1780675093881.png'
  const { data } = supabase.storage.from('Fish').getPublicUrl(path)
  publicUrl.value = data?.publicUrl || data?.publicURL || null
 const ShowFish = ('publicUrl:', publicUrl.value)
})
</script>

<style scoped>

</style>