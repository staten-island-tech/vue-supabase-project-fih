<template>
  <div class="user-profile-card">
    <button class="close-profile" @click="$emit('close')">✕</button>

    <img
      src="https://th.bing.com/th/id/OIP.i3qQLulfg9NApqe_4NaYzgHaHa?w=214&h=214&c=7&r=0&o=7&pid=1.7&rm=3"
      alt="User Profile Picture"
    />

    <h1>User Email:</h1>
    <h3>{{ userEmail }}</h3>

    <h2>User Id:</h2>
    <h3>{{ userId }}</h3>

    <button
      class="bg-white text-gray-700 font-bold py-2 px-4 rounded"
      @click="signOut"
    >
      Sign Out
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSupabaseClient, useSupabaseUser, useRouter } from '#imports'

const emit = defineEmits(['close'])

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

const userEmail = computed(() => user.value?.email ?? '')
const userId = computed(() => user.value?.id ?? '')

async function signOut() {
  await supabase.auth.signOut()
  emit('close')
  router.push('/login')
}
</script>

<style scoped>
.user-profile-card {
  position: relative;
  background: #1d4ed8;
  color: white;
  padding: 1rem;
  border-radius: 0.75rem;
  min-width: 240px;
}

.user-profile-card img {
  display: block;
  width: 80px;
  height: 80px;
  border-radius: 9999px;
  margin: 0 auto 1rem;
}

.close-profile {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 1rem;
  width: 32px;
  height: 32px;
  border-radius: 9999px;
  cursor: pointer;
}

.close-profile:hover {
  background: rgba(255, 255, 255, 0.35);
}
</style>