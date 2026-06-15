<template>
  <div class="visited-aquarium-page">
    <header class="visited-header">
      <div class="title-block">
        <h1>{{ canEditProfile ? 'Your Aquarium' : 'User Aquarium' }}</h1>
        <p>{{ userId }}</p>
      </div>

      <div class="header-actions">
        <GoBackButton :targetId="userId" />
        <NuxtLink to="/GlobalAquarium" class="primary-btn">Global Aquarium</NuxtLink>
        <button v-if="canEditProfile" class="primary-btn" @click="goToPixel">Create Fish</button>
      </div>
    </header>

    <main class="aquarium-stage">
      <div v-if="loading" class="status-card">
        Loading aquarium...
      </div>

      <div v-else-if="error" class="status-card error-card">
        {{ error }}
      </div>

      <div v-else-if="fish.length">
        <button
          v-for="f in fish"
          :key="f.id"
          class="fish"
          :style="f.style"
          type="button"
          @click="openFish(f)"
        >
          <img v-if="f.public_url" :src="f.public_url" :alt="f.name || 'Fish'" />
          <span v-else>{{ f.name || 'Fish' }}</span>
        </button>
      </div>

      <div v-else class="status-card">
        <h2>No fish found</h2>
        <p>This aquarium is empty or not public yet.</p>
      </div>
    </main>

    <div v-if="selectedFish" class="modal" @click.self="close">
      <article class="fish-card">
        <button class="close-btn" type="button" @click="close">Close</button>
        <img
          v-if="selectedFish.public_url"
          :src="selectedFish.public_url"
          :alt="selectedFish.name || 'Fish'"
        />
        <h3>{{ selectedFish.name || 'Unnamed Fish' }}</h3>
        <p>{{ selectedFish.description || 'No description available.' }}</p>

        <div v-if="canEditProfile" class="modal-actions">
          <button type="button" @click="editFish">Edit</button>
          <button type="button" class="danger-btn" @click="deleteFish">Delete</button>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSupabaseClient } from '#imports'
import { useAuthStore } from '~/Stores/store'

const route = useRoute()
const router = useRouter()
const supabase = useSupabaseClient()
const auth = useAuthStore()

const fish = ref([])
const selectedFish = ref(null)
const loading = ref(true)
const error = ref('')

const userId = computed(() => {
  const rawId = route.params.id
  const value = Array.isArray(rawId) ? rawId[0] : rawId
  return value ? decodeURIComponent(String(value)) : ''
})

const canEditProfile = computed(() => {
  return !!auth.user?.id && auth.user.id === userId.value
})

onMounted(async () => {
  if (!auth.user) {
    await auth.fetchUser()
  }
})

watch(
  () => route.params.id,
  async () => {
    selectedFish.value = null

    if (!userId.value) {
      await router.replace('/Aquarium')
      return
    }

    await loadAquarium()
  },
  { immediate: true }
)

async function loadAquarium() {
  loading.value = true
  error.value = ''

  const { data, error: supErr } = await supabase
    .from('aquarium')
    .select('id, user_id, name, description, public_url, created_at')
    .eq('user_id', userId.value)
    .order('created_at', { ascending: false })

  if (supErr) {
    error.value = supErr.message || 'Could not load this aquarium.'
    fish.value = []
    loading.value = false
    return
  }

  fish.value = (data || []).map((item, index) => ({
    ...item,
    style: fishStyle(item.id, index)
  }))
  loading.value = false
}

function fishStyle(id, index) {
  const seed = String(id || index)
    .split('')
    .reduce((total, char) => total + char.charCodeAt(0), 0)

  const left = 10 + (seed % 76)
  const top = 20 + ((seed * 7) % 58)
  const duration = 10 + (seed % 8)
  const delay = -1 * (seed % 6)

  return {
    left: `${left}%`,
    top: `${top}%`,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`
  }
}

function openFish(item) {
  selectedFish.value = item
}

function close() {
  selectedFish.value = null
}

function goToPixel() {
  router.push('/PixelArtFish')
}

function editFish() {
  if (!selectedFish.value?.id || !canEditProfile.value) return
  router.push(`/FishDescription?id=${selectedFish.value.id}`)
}

async function deleteFish() {
  if (!selectedFish.value?.id || !canEditProfile.value) return

  const { error: deleteError } = await supabase
    .from('aquarium')
    .delete()
    .eq('id', selectedFish.value.id)
    .eq('user_id', userId.value)

  if (deleteError) {
    error.value = deleteError.message || 'Could not delete fish.'
    return
  }

  fish.value = fish.value.filter(item => item.id !== selectedFish.value.id)
  close()
}
</script>

<style scoped>
.visited-aquarium-page {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background:
    linear-gradient(180deg, rgba(20, 184, 166, 0.22), rgba(8, 145, 178, 0.22)),
    url('https://cdn.vectorstock.com/i/500p/26/43/coral-reef-aquarium-background-vector-50352643.jpg') center / cover fixed;
}

.visited-header {
  position: relative;
  z-index: 12;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 14px;
}

.title-block {
  max-width: min(440px, 100%);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.78);
  padding: 12px 14px;
  box-shadow: 0 12px 28px rgba(8, 47, 73, 0.18);
}

.title-block h1 {
  margin: 0 0 4px;
  font-size: 1.35rem;
}

.title-block p {
  color: #475569;
  margin: 0;
  overflow-wrap: anywhere;
  font-size: 0.85rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.primary-btn {
  display: inline-flex;
  align-items: center;
  border: 0;
  border-radius: 8px;
  background: #0891b2;
  color: white;
  cursor: pointer;
  font-weight: 700;
  padding: 10px 14px;
  text-decoration: none;
  box-shadow: 0 8px 20px rgba(8, 47, 73, 0.22);
}

.primary-btn:hover,
.primary-btn:focus-visible {
  background: #0e7490;
}

.aquarium-stage {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.fish {
  position: absolute;
  border: 0;
  background: transparent;
  cursor: pointer;
  padding: 0;
  transform: translate(-50%, -50%);
  animation-name: swim;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  animation-timing-function: ease-in-out;
}

.fish img {
  width: clamp(72px, 9vw, 138px);
  height: auto;
  display: block;
  image-rendering: pixelated;
  filter: drop-shadow(0 10px 14px rgba(8, 47, 73, 0.28));
}

.fish span {
  display: inline-flex;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.84);
  color: #0f172a;
  padding: 8px 10px;
}

.status-card {
  position: absolute;
  left: 50%;
  top: 52%;
  transform: translate(-50%, -50%);
  width: min(360px, calc(100% - 32px));
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.88);
  color: #0f172a;
  padding: 18px;
  text-align: center;
  box-shadow: 0 18px 42px rgba(8, 47, 73, 0.22);
}

.status-card h2,
.status-card p {
  margin: 0 0 12px;
}

.error-card {
  color: #991b1b;
}

.modal {
  position: fixed;
  inset: 0;
  z-index: 30;
  display: grid;
  place-items: center;
  background: rgba(8, 47, 73, 0.68);
  padding: 16px;
}

.fish-card {
  position: relative;
  width: min(380px, 100%);
  border-radius: 8px;
  background: white;
  color: #0f172a;
  padding: 18px;
  box-shadow: 0 24px 60px rgba(8, 47, 73, 0.34);
}

.fish-card img {
  width: 170px;
  max-width: 100%;
  display: block;
  margin-bottom: 12px;
  image-rendering: pixelated;
}

.fish-card h3 {
  margin: 0 0 8px;
}

.fish-card p {
  margin: 0 0 16px;
  color: #475569;
}

.close-btn {
  position: absolute;
  right: 12px;
  top: 12px;
  border: 0;
  background: transparent;
  color: #475569;
  cursor: pointer;
  font-weight: 700;
}

.modal-actions {
  display: flex;
  gap: 8px;
}

.modal-actions button {
  border: 0;
  border-radius: 8px;
  background: #0ea5e9;
  color: white;
  cursor: pointer;
  padding: 9px 12px;
}

.modal-actions .danger-btn {
  background: #dc2626;
}

@keyframes swim {
  from {
    transform: translate(-50%, -50%) translateX(-18px) rotate(-2deg);
  }
  to {
    transform: translate(-50%, -50%) translateX(18px) rotate(2deg);
  }
}

@media (max-width: 700px) {
  .visited-header {
    align-items: stretch;
    flex-direction: column;
  }

  .header-actions {
    align-items: stretch;
  }
}
</style>
