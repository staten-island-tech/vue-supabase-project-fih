// ...existing code...
<template>
  <form @submit.prevent="register">
    <div>
      <nuxt-link to="/login">
        <h2>Return?</h2>
      </nuxt-link>

      <h1>Glad To Have You Here!</h1>

      <h2>New Email</h2>
      <input type="email" v-model="email" class="Email" name="New email" required />

      <h2>New Password</h2>
      <input type="password" v-model="password" class="Password" name="New Password" required />

      <button type="submit">Create account</button>

      <p v-if="message">{{ message }}</p>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const message = ref('')
const supabase = useSupabaseClient()

async function register() {
  const { error } = await supabase.auth.signInWithOtp({
    email: email.value,
    options: {
      emailRedirectTo: 'http://localhost:3000/Confirm',
    }
  })
  if (error) console.log(error)
}

</script>

<style scoped>
</style>