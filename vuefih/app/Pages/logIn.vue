<template>
  <form @submit.prevent="login">
  <div>
    <h1>Welcome!</h1>
    <h2>Please Log In</h2>
    <h2>Email</h2>
    <input type="email" v-model="email" name="Email" required size="10">
    <h2>Password</h2>
    <input type="password" v-model="password" name="Password" required size="10">
    <button type="submit" :disabled="auth.loading">Log In</button>
    <h2>New Here?</h2>
    <nuxt-link to="/signIn">
      <h2>Sign In</h2>
    </nuxt-link> 
      <p v-if="message">{{ message }}</p>
      <p v-if="auth.error" style="color:red">{{ auth.error }}</p>
  </div>
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/Stores/store' // keep your existing import
import { useSupabaseClient } from '#imports'

const email = ref('')
const password = ref('')
const message = ref('')
const router = useRouter()
const auth = useAuthStore()
const route = useRoute()
const supabase = useSupabaseClient()
const aquariums = ref([])

async function login() {
  message.value = ''

  // trim inputs to avoid accidental whitespace
  const e = (email.value || '').trim()
  const p = (password.value || '').trim()

  if (!e || !p) {
    message.value = 'Email and password are required.'
    return
  }

  // debug: show email and password length (never log actual password)
  console.log('login attempt', { email: e, passwordLength: p.length })

  // Use the pinia action so error handling is consistent
  const res = await auth.signIn(e, p)
  console.log('signIn result', res)

  if (!res.success) {
    // show the Supabase error message (res.error may be an AuthApiError)
    message.value = (res.error as any)?.message || auth.error || 'Login failed.'
    return
  }

  // if Supabase returned a user but no session (email unconfirmed), inform user
  if (res.data?.user && !res.data?.session) {
    message.value = 'Please confirm your email before signing in.'
    return
  }
  const id = res.data?.user?.id
  console.log('logged in user id', id)
  // update store user (if your store action doesn't already) and navigate
  const user = res.data?.user ?? null
  console.log('logged in user', user)
  auth.$patch({ user: user as any })
  await router.push(`/Aquarium/${id}`)
}

onMounted(async () => {
  const rawId = route.params.id
  const userId = Array.isArray(rawId) ? rawId[0] : rawId

  if (!userId) {
    return
  }

  const { data } = await supabase
    .from('aquariums')
    .select('*')
    .eq('user_id', userId)

  aquariums.value = data ?? []
})
</script>

<style scoped>
</style>