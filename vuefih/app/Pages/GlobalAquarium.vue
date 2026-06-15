<template>
  <div class="global-page">
    <header class="global-header">
      <div>
        <h1>Global Aquarium</h1>
        <p>Browse every public aquarium, then jump into one.</p>
      </div>

      <NuxtLink to="/Aquarium" class="nav-btn">My Aquarium</NuxtLink>
    </header>

    <section class="visit-panel">
      <input
        v-model="visitId"
        placeholder="Paste a user ID"
        aria-label="User ID"
        @keyup.enter="visitAquarium"
      />
      <button :disabled="checkingVisit" @click="visitAquarium">
        {{ checkingVisit ? 'Checking...' : 'Visit' }}
      </button>
    </section>

    <p v-if="loading" class="status">Loading public aquariums...</p>
    <p v-else-if="error" class="status error">{{ error }}</p>

    <section v-else-if="users.length" class="aquarium-list">
      <article
        v-for="aquariumUser in users"
        :key="aquariumUser.user_id"
        class="aquarium-card"
      >
        <div class="fish-preview">
          <img
            v-for="fish in aquariumUser.previewFish"
            :key="fish.id"
            :src="fish.public_url"
            :alt="fish.name || 'Fish'"
          />
          <div v-if="!aquariumUser.previewFish.length" class="preview-empty">
            No images
          </div>
        </div>

        <div class="card-body">
          <div class="card-title-row">
            <h2>{{ aquariumUser.label }}</h2>
            <span>{{ aquariumUser.count }} fish</span>
          </div>

          <p class="user-id">Owner ID: {{ aquariumUser.user_id }}</p>
          <p v-if="aquariumUser.fishNames.length" class="fish-names">
            Fish: {{ aquariumUser.fishNames.join(', ') }}
          </p>
          <p>{{ aquariumUser.latestDescription || 'No fish descriptions yet.' }}</p>

          <NuxtLink
            class="open-aquarium-btn"
            :to="aquariumPath(aquariumUser.user_id)"
          >
            Open Aquarium
          </NuxtLink>
        </div>
      </article>
    </section>

    <section v-else class="empty-state">
      <h2>No public aquariums yet</h2>
      <p>Create a fish in your aquarium and it will appear here if Supabase allows public reads.</p>
    </section>
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
const checkingVisit = ref(false)
const error = ref('')

onMounted(loadGlobalAquariums)

async function loadGlobalAquariums() {
  loading.value = true
  error.value = ''

  const { data, error: supErr } = await supabase
    .from('aquarium')
    .select('id, user_id, name, description, public_url, created_at')
    .not('user_id', 'is', null)
    .order('created_at', { ascending: false })

  if (supErr) {
    error.value = supErr.message || 'Could not load global aquariums.'
    users.value = []
    loading.value = false
    return
  }

  const grouped = new Map()

  for (const row of data || []) {
    const uid = row.user_id
    if (!uid) continue

    if (!grouped.has(uid)) {
      grouped.set(uid, {
        user_id: uid,
        label: `Aquarium ${shortUserId(uid)}`,
        count: 0,
        latestDescription: row.description || '',
        previewFish: [],
        fishNames: []
      })
    }

    const aquarium = grouped.get(uid)
    aquarium.count++

    if (row.description && !aquarium.latestDescription) {
      aquarium.latestDescription = row.description
    }

    if (row.name && aquarium.fishNames.length < 5 && !aquarium.fishNames.includes(row.name)) {
      aquarium.fishNames.push(row.name)
    }

    if (row.public_url && aquarium.previewFish.length < 4) {
      aquarium.previewFish.push({
        id: row.id,
        name: row.name,
        public_url: row.public_url
      })
    }
  }

  users.value = Array.from(grouped.values())
  loading.value = false
}

async function visitAquarium() {
  error.value = ''

  const id = visitId.value.trim()
  if (!id) {
    error.value = 'Enter a user ID first.'
    return
  }

  checkingVisit.value = true
  const { data, error: checkError } = await supabase
    .from('aquarium')
    .select('user_id')
    .eq('user_id', id)
    .limit(1)
    .maybeSingle()

  checkingVisit.value = false

  if (checkError) {
    error.value = checkError.message || 'Could not check that aquarium.'
    return
  }

  if (!data) {
    error.value = 'No public aquarium found for that user ID.'
    return
  }

  await goToAquarium(id)
}

function aquariumPath(userId) {
  return `/Aquarium/${encodeURIComponent(userId)}`
}

function shortUserId(userId) {
  const id = String(userId || '')
  if (id.length <= 8) return id || 'Unknown'
  return `${id.slice(0, 4)}...${id.slice(-4)}`
}

async function goToAquarium(userId) {
  await router.push(aquariumPath(userId))
}
</script>

<style scoped>
.global-page {
  min-height: 100vh;
  padding: 24px;
  background:
    linear-gradient(180deg, rgba(14, 165, 233, 0.18), rgba(20, 184, 166, 0.2)),
    #e0f7fa;
  color: #0f172a;
}

.global-header {
  max-width: 1040px;
  margin: 0 auto 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.global-header h1 {
  margin: 0 0 4px;
  font-size: clamp(2rem, 5vw, 4rem);
  line-height: 1;
}

.global-header p {
  color: #155e75;
  margin: 0;
}

.nav-btn,
.visit-panel button,
.open-aquarium-btn {
  border: 0;
  border-radius: 8px;
  background: #0891b2;
  color: white;
  cursor: pointer;
  font-weight: 700;
  padding: 10px 14px;
  text-decoration: none;
}

.open-aquarium-btn {
  display: inline-flex;
}

.visit-panel {
  max-width: 1040px;
  margin: 0 auto 20px;
  display: flex;
  gap: 10px;
  padding: 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.78);
  box-shadow: 0 16px 34px rgba(8, 47, 73, 0.12);
}

.visit-panel input {
  min-width: 0;
  flex: 1;
  border: 1px solid #67e8f9;
  border-radius: 8px;
  color: #0f172a;
  font: inherit;
  padding: 10px 12px;
}

.visit-panel button:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.status,
.empty-state {
  max-width: 1040px;
  margin: 18px auto;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.84);
  padding: 18px;
}

.error {
  color: #991b1b;
}

.aquarium-list {
  max-width: 1040px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.aquarium-card {
  overflow: hidden;
  border: 1px solid rgba(14, 116, 144, 0.16);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 16px 34px rgba(8, 47, 73, 0.12);
}

.fish-preview {
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  background:
    radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.7), transparent 28%),
    linear-gradient(180deg, #22d3ee, #0f766e);
}

.fish-preview img {
  width: clamp(54px, 7vw, 90px);
  height: auto;
  image-rendering: pixelated;
  filter: drop-shadow(0 8px 10px rgba(8, 47, 73, 0.28));
}

.preview-empty {
  color: white;
  font-weight: 700;
}

.card-body {
  padding: 16px;
}

.card-title-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.card-title-row h2 {
  margin: 0;
  font-size: 1.15rem;
}

.card-title-row span {
  color: #0e7490;
  font-weight: 700;
  white-space: nowrap;
}

.user-id {
  color: #475569;
  font-size: 0.85rem;
  overflow-wrap: anywhere;
}

.fish-names {
  color: #155e75;
  font-weight: 700;
  overflow-wrap: anywhere;
}

@media (max-width: 640px) {
  .global-page {
    padding: 16px;
  }

  .global-header,
  .visit-panel {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
