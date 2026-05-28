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
import { useRouter } from 'vue-router'
import { createClient } from '@supabase/supabase-js'

const email = ref('')
const password = ref('')
const message = ref('')
const router = useRouter()
const supabase = useSupabaseClient()

async function register() {
  message.value = ''
  if (!email.value || !password.value) {
    message.value = 'Email and password are required.'
    return
  }

  try {
    const { data, error } = await supabase.auth.signUp(
      { email: email.value, password: password.value }
    )

    if (error) {
      message.value = error.message || 'Sign up error.'
      return
    }

    // Typical signup flows:
    // - If email confirmation is required, data.user exists but no session => inform the user
    // - If instant sign-in, redirect to protected page
    if (data?.user && !data?.session) {
      message.value = 'Check your email to confirm your account.'
      return
    }

    message.value = 'Registration successful. Redirecting...'
    await router.push('/Aquarium')
  } catch (err: any) {
    message.value = err?.message || 'Unexpected error'
  }
}

</script>

<style scoped>
</style>