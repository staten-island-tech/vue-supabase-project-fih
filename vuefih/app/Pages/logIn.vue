<template>
  <main class="auth-page">
    <form class="auth-panel" @submit.prevent="login">
      <div>
        <p class="eyebrow">Pixel Aquarium</p>
        <h1>Welcome back</h1>
        <p class="helper">Log in to create fish, manage your aquarium, and browse the global gallery.</p>
      </div>

      <label>
        <span>Email</span>
        <input v-model="email" type="email" name="email" autocomplete="email" required />
      </label>

      <label>
        <span>Password</span>
        <input
          v-model="password"
          type="password"
          name="password"
          autocomplete="current-password"
          required
        />
      </label>

      <p v-if="message" class="message" :class="{ error: hasError }">{{ message }}</p>
      <p v-if="auth.error" class="message error">{{ auth.error }}</p>

      <button class="primary-btn" type="submit" :disabled="auth.loading">
        {{ auth.loading ? 'Logging in...' : 'Log In' }}
      </button>

      <p class="switch-copy">
        New here?
        <NuxtLink to="/signIn">Create an account</NuxtLink>
      </p>
    </form>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/Stores/store'

const email = ref('')
const password = ref('')
const message = ref('')
const hasError = ref(false)
const router = useRouter()
const auth = useAuthStore()

async function login() {
  message.value = ''
  hasError.value = false

  const e = email.value.trim()
  const p = password.value

  if (!e || !p) {
    message.value = 'Email and password are required.'
    hasError.value = true
    return
  }

  const res = await auth.signIn(e, p)

  if (!res.success) {
    message.value = (res.error as any)?.message || auth.error || 'Login failed.'
    hasError.value = true
    return
  }

  if (res.data?.user && !res.data?.session) {
    message.value = 'Please confirm your email before signing in.'
    hasError.value = true
    return
  }

  auth.$patch({ user: res.data?.user ?? null })
  await router.push('/Aquarium')
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 20px;
  background:
    linear-gradient(135deg, rgba(14, 165, 233, 0.2), rgba(20, 184, 166, 0.22)),
    #e0f7fa;
  color: #0f172a;
}

.auth-panel {
  width: min(420px, 100%);
  display: grid;
  gap: 16px;
  border: 1px solid rgba(14, 116, 144, 0.16);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.92);
  padding: 24px;
  box-shadow: 0 22px 60px rgba(8, 47, 73, 0.18);
}

.eyebrow {
  margin: 0 0 6px;
  color: #0e7490;
  font-weight: 800;
  text-transform: uppercase;
  font-size: 0.78rem;
}

h1 {
  margin: 0 0 8px;
  font-size: 2rem;
  line-height: 1.1;
}

.helper,
.switch-copy,
.message {
  margin: 0;
}

.helper,
.switch-copy {
  color: #475569;
}

label {
  display: grid;
  gap: 8px;
  font-weight: 700;
}

input {
  width: 100%;
  border: 1px solid #67e8f9;
  border-radius: 8px;
  color: #0f172a;
  font: inherit;
  padding: 10px 12px;
}

.primary-btn {
  border: 0;
  border-radius: 8px;
  background: #0891b2;
  color: white;
  cursor: pointer;
  font-weight: 800;
  padding: 11px 14px;
}

.primary-btn:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.switch-copy a {
  color: #0369a1;
  font-weight: 800;
}

.message {
  color: #0369a1;
  font-weight: 700;
}

.message.error {
  color: #b91c1c;
}
</style>
