<template>
    <div>
        <RouterLink to="AcquariumScreen">To Acquarium</RouterLink>
        <input>Name:</input>
        <input>Fish Description:</input>
    </div>
</template>

<script setup>
import { createClient } from '@supabase/supabase-js'
const supabase = createClient('https://zyjawkkqocasuwvuaxxv.supabase.co', 'sb_publishable_G5zffL3bGX59EzIERu590w_RQxjqzgT')
const { data } = supabase.storage.from('Fish Drawings').getPublicUrl('https://zyjawkkqocasuwvuaxxv.supabase.co/storage/v1/object/public/Fish/Fish%20Drawings/pixel_art_1780675093881.png')
console.log(data.publicUrl)
</script>

<style  scoped>

</style>