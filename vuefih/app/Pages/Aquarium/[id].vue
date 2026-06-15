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
      <p>No fish found for this user.</p>
    </div>

    <div v-if="aquariums.length" class="aquarium-grid">
      <div v-for="aq in aquariums" :key="aq.id" class="aquarium-card">
        <h3>{{ aq.name || 'Unnamed Fish' }}</h3>
        <p>{{ aq.description || 'No description available.' }}</p>

        <img
          v-if="aq.public_url"
          :src="aq.public_url"
          style="width:120px;"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSupabaseClient } from '#imports'
import { useAuthStore } from '~/Stores/store'

const route = useRoute()
const router = useRouter()
const supabase = useSupabaseClient()
const auth = useAuthStore()

const aquariums = ref([])
const loading = ref(true)
const error = ref('')

const rawId = route.params.id
const userId = Array.isArray(rawId) ? rawId[0] : rawId

if (!userId) {
  router.replace('/Aquarium')
}


const canEditProfile = computed(() => {
  return !!auth.user && auth.user.id === userId
})

const loadAquarium = async () => {
  loading.value = true
  error.value = ''

  const { data, error: supErr } = await supabase
    .from('aquarium')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (supErr) {
    error.value = supErr.message
    aquariums.value = []
  } else {
    aquariums.value = data || []
  }

  loading.value = false
}

onMounted(async () => {
  if (!auth.user) {
    await auth.fetchUser()
  }

  await loadAquarium()
})

const goToPixel = () => {
  router.push('/PixelArtFish')
}
</script>

<style scoped>
.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.primary-btn {
  background: #06b6d4;
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

.primary-btn:hover {
  opacity: 0.95;
}

.create-fish-row {
  margin-top: 12px;
}

.aquarium-grid {
  display: grid;
  gap: 12px;
  margin-top: 12px;
}

.aquarium-card {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 10px;
}
</style>