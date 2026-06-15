<template>
  <template>
  <form @submit.prevent="register">
    <div class="register-box">
      <NuxtLink to="/login" class="back-btn">
        <button type="button">Return</button>
      </NuxtLink>

      <h1>Glad To Have You Here!</h1>

      <h2>New Email</h2>
      <input type="email" v-model="email" name="New email" required />

      <h2>New Password</h2>
      <input type="password" v-model="password" name="New Password" required />

      <button type="submit" :disabled="auth.loading">
        Create account
      </button>

      <p v-if="message">{{ message }}</p>
      <p v-if="auth.error" class="error">{{ auth.error }}</p>
    </div>
  </form>
</template>
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

  if (res.data?.user && !res.data?.session) {
    message.value = 'Check your email to confirm your account.'
    return
  }

  await router.push('/Aquarium')
}
</script>

<style scoped>
form {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle at top, #0f172a, #020617);
  padding: 20px;
}

.register-box {
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: center;
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.45);
}

h1 {
  margin: 0;
  font-size: 1.5rem;
}

h2 {
  margin: 0;
  font-size: 1rem;
  color: #374151;
}

input {
  width: 100%;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  outline: none;
  font-size: 14px;
}

input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

button {
  width: 100%;
  padding: 10px 14px;
  border-radius: 10px;
  border: none;
  font-weight: 700;
  cursor: pointer;
}

button[type="submit"] {
  background: #06b6d4;
  color: white;
}

.back-btn button {
  background: rgba(15, 23, 42, 0.08);
  color: #111827;
}

button:hover {
  opacity: 0.9;
}

.error {
  color: #ef4444;
  font-weight: 600;
  margin: 0;
}

p {
  margin: 0;
}
</style>