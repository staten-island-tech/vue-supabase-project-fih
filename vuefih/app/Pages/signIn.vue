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

      <button type="submit" :disabled="auth.loading">Create account</button>

      <p v-if="message">{{ message }}</p>
      <p v-if="auth.error" style="color:red">{{ auth.error }}</p>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/Stores/store'

const email = ref('')
const password = ref('')
const message = ref('')
const router = useRouter()
const auth = useAuthStore()

async function register() {
  message.value = ''
  if (!email.value || !password.value) {
    message.value = 'Email and password are required.'
    return
  }

  const redirectTo = `${window.location.origin}/Confirm`
  const res = await auth.signUp(email.value, password.value, redirectTo)

  if (!res.success) {
    message.value = auth.error || 'Registration failed.'
    return
  }

  // If your Supabase project requires email confirmation, user will need to confirm.
  if (res.data?.user && !res.data?.session) {
    message.value = 'Check your email to confirm your account.'
    return
  }

  // If account created and signed in immediately, route user
  await router.push('/Aquarium')
}
</script>

<style scoped>
</style>