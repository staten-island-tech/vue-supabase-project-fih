<template>
    <form>
    <div>
        <h1>Glad To Have You Here!</h1>
        <input type="text" class= "Email" name="New email" required size="10">
        <input type="text" class= "Password" name="New Password" required size="10">
        <nuxt-link :to="Aquarium">
            <h2>To Your Aquarium!</h2>
        </nuxt-link>
    </div>
    </form>
</template>

<script setup lang="ts">
import Aquarium from '../Pages/Aquarium.vue';
import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://zyjawkkqocasuwvuaxxv.supabase.co', 'sb_publishable_G5zffL3bGX59EzIERu590w_RQxjqzgT')
const email = document.querySelector("Email")

async function register() {
  const { data , error } = await supabase.auth.signUp({ //data is very general here, replace with stuff you need, work in pinia and go from there
    email: '',
    password: '',
    options: {
      emailRedirectTo: '/Aquarium',
    },
  })
}

register()
</script>

<style scoped>

</style>
