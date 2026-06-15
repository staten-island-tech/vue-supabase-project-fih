<template>
  <div>
    <h1>User Aquarium</h1>
    <div class="header-actions">
      <GoBackButton :targetId="userId" />
      <button class="primary-btn" @click="goToPixel">Create Fish</button>
    </div>
    <UserProfile :canEdit="canEditProfile" />

    <div class="create-fish-row">
      <button class="primary-btn" @click="goToPixel">Create Fish</button>
    </div>

    <p v-if="loading">Loading…</p>
    <p v-if="error" style="color:red">{{ error }}</p>

    <div v-if="!loading && aquariums.length === 0">
      <p>No aquariums found for this user.</p>
    </div>

    <div v-if="aquariums.length" class="aquarium-grid">
      <div v-for="aq in aquariums" :key="String(aq.id)" class="aquarium-card">
        <h3>{{ aq.name || 'Unnamed Fish' }}</h3>
        <p>{{ aq.description || 'No description available.' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '~/Stores/store'
import type { aq } from '~/Types And Interfaces/types'

const route = useRoute()
const router = useRouter()
const supabase = useSupabaseClient()
const auth = useAuthStore()
const aquariums = ref<aq[]>([])
const loading = ref(true)
const error = ref('')

const rawId = route.params.id
const userId = Array.isArray(rawId) ? rawId[0] : rawId

const canEditProfile = computed(() => !!auth.user && auth.user.id === userId)

if (!userId) {
  router.replace('/Aquarium')
} else {
  onMounted(async () => {
    if (!auth.user) {
      await auth.fetchUser()
    }

    loading.value = true
    error.value = ''
    try {
      const { data, error: supErr } = await supabase
        .from('aquariums')
        .select('*')
        .eq('user_id', userId)

      if (supErr) {
        error.value = supErr.message || 'Failed to load aquariums.'
      } else {
        aquariums.value = data ?? []
      }
    } catch (err: any) {
      error.value = err?.message || String(err)
    } finally {
      loading.value = false
    }
  })
}

const goToPixel = () => {
  router.push('/PixelArtFish')
}
</script>

<style scoped>
/* minimal styling */
.header-actions { display:flex; align-items:center; gap:12px; margin-bottom:8px }
.primary-btn { background:#06b6d4; color:white; padding:8px 12px; border-radius:8px; border:none; cursor:pointer }
.primary-btn:hover { opacity:0.95 }

.create-fish-row { margin-top:12px }
</style>