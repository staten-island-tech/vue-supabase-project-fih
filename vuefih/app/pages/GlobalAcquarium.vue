<template>
  <div class="global-aquarium-page">
    <div class="page-header">
      <div>
        <h1>Global Aquarium</h1>
        <p>Explore other users' aquariums and open one by ID.</p>
      </div>
      <RouterLink to="/Aquarium" class="back-button">Back</RouterLink>
    </div>

    <div class="visit-row">
      <input
        v-model="visitId"
        placeholder="Enter a user ID to visit"
        aria-label="User ID"
      />
      <button @click="visitAquarium">Visit Aquarium</button>
    </div>

    <div v-if="loading" class="status">Loading aquariums…</div>
    <div v-if="error" class="status status-error">{{ error }}</div>

    <div v-if="users.length" class="users-list">
      <div v-for="user in users" :key="user.user_id" class="user-card">
        <div class="user-card-header">
          <div>
            <strong>User ID:</strong>
            <span>{{ user.user_id }}</span>
          </div>
          <span class="fish-count">{{ user.count }} fish</span>
        </div>

        <div class="user-card-body">
          <div>
            <strong>Latest fish name:</strong>
            {{ user.latestFish || 'None yet' }}
          </div>
          <div>
            <strong>Latest description:</strong>
            {{ user.latestDescription || 'No description available' }}
          </div>
        </div>

        <button @click="goToAquarium(user.user_id)">
          Open Aquarium
        </button>
      </div>
    </div>

    <div v-if="!loading && !users.length" class="status">
      No public aquariums found yet.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useSupabaseClient } from '#imports'

const router = useRouter()
const supabase = useSupabaseClient()

const visitId = ref('')
const users = ref([])
const loading = ref(false)
const error = ref('')

const loadGlobalAquariums = async () => {
  loading.value = true
  error.value = ''

  const { data, error: supErr } = await supabase
    .from('aquarium')
    .select('id,background,created_at')
    .order('id', { ascending: false })

  if (supErr) {
    error.value = supErr.message
    users.value = []
    loading.value = false
    return
  }

  if (!data?.length) {
    users.value = []
    loading.value = false
    return
  }

  users.value = data.map(row => ({
    user_id: row.id,
    count: 1,
    latestFish: row.background ? 'Saved aquarium background' : 'No aquarium background',
    latestDescription: row.background ? 'Background saved' : 'No description available'
  }))
  loading.value = false
}

const visitAquarium = async () => {
  error.value = ''

  if (!visitId.value.trim()) {
    error.value = 'Enter a user ID first.'
    return
  }

  const { data, error: checkError } = await supabase
    .from('aquarium')
    .select('id')
    .eq('id', visitId.value.trim())
    .single()

  if (checkError || !data) {
    error.value = 'No aquarium was found for that ID.'
    return
  }

  router.push(`/Aquarium/${visitId.value.trim()}`)
}

const goToAquarium = (userId) => {
  router.push(`/Aquarium/${userId}`)
}

onMounted(loadGlobalAquariums)
</script>

<style scoped>
.global-aquarium-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 1.5rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.back-button {
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1rem;
  background: #0ea5e9;
  color: white;
  border-radius: 0.75rem;
  text-decoration: none;
}

.visit-row {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.visit-row input {
  flex: 1;
  border: 1px solid #cbd5e1;
  border-radius: 0.75rem;
  padding: 0.75rem;
}

.visit-row button {
  border: none;
  background: #2563eb;
  color: white;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
}

.status {
  margin: 1rem 0;
}

.status-error {
  color: #dc2626;
}

.users-list {
  display: grid;
  gap: 1rem;
}

.user-card {
  border: 1px solid #cbd5e1;
  border-radius: 1rem;
  padding: 1rem;
  background: #f8fafc;
}

.user-card-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.fish-count {
  color: #475569;
}

.user-card-body {
  margin-bottom: 1rem;
  color: #475569;
}

.user-card button {
  border: none;
  background: #2563eb;
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  cursor: pointer;
}
</style>