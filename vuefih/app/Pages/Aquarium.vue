<template>
  <div class="aquarium-page">
    <header class="aquarium-header">
      <GoBackButton />

      <div class="nav-actions">
        <button class="action-btn" @click="goToPixel">Create Fish</button>
        <NuxtLink class="action-btn action-link" to="/GlobalAquarium">Global Aquarium</NuxtLink>
      </div>

      <button class="action-btn profile-btn" @click="showUserProfile = !showUserProfile">
        User Profile
      </button>
    </header>

    <UserProfile class="profile" v-show="showUserProfile" @close="showUserProfile = false" />

    <main class="aquarium-stage" aria-live="polite">
      <div v-if="loading" class="status-card">
        Loading your aquarium...
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
        <h2>No fish yet</h2>
        <p>Create one and it will swim here after it saves.</p>
        <button class="action-btn" @click="goToPixel">Create Fish</button>
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

        <div class="modal-actions">
          <button type="button" @click="editFish">Edit</button>
          <button type="button" class="danger-btn" @click="deleteFish">Delete</button>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useSupabaseClient, useSupabaseUser, useRouter } from '#imports'

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

const fish = ref([])
const selectedFish = ref(null)
const showUserProfile = ref(false)
const loading = ref(true)
const error = ref('')
const currentUserId = ref('')

watch(user, async (u) => {
  if (u?.id && u.id !== currentUserId.value) {
    currentUserId.value = u.id
    await loadFish(u.id)
  }
})

onMounted(loadCurrentUserFish)

async function getCurrentUserId() {
  if (user.value?.id) return user.value.id

  const { data: userData } = await supabase.auth.getUser()
  if (userData?.user?.id) return userData.user.id

  const { data: sessionData } = await supabase.auth.getSession()
  return sessionData?.session?.user?.id || ''
}

async function loadCurrentUserFish() {
  loading.value = true
  error.value = ''

  const userId = await getCurrentUserId()
  currentUserId.value = userId

  if (!userId) {
    fish.value = []
    loading.value = false
    error.value = 'Please log in to see your aquarium.'
    return
  }

  await loadFish(userId)
}

async function loadFish(userId) {
  loading.value = true
  error.value = ''

  const { data, error: queryError } = await supabase
    .from('aquarium')
    .select('id, user_id, name, description, public_url, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (queryError) {
    fish.value = []
    error.value = queryError.message || 'Could not load your fish.'
    loading.value = false
    return
  }

  fish.value = (data || []).map((f, index) => ({
    ...f,
    style: fishStyle(f.id, index)
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

function openFish(f) {
  selectedFish.value = f
}

function close() {
  selectedFish.value = null
}

function goToPixel() {
  router.push('/PixelArtFish')
}

function editFish() {
  if (!selectedFish.value?.id) return
  router.push(`/FishDescription?id=${selectedFish.value.id}`)
}

async function deleteFish() {
  if (!selectedFish.value?.id) return

  const { error: deleteError } = await supabase
    .from('aquarium')
    .delete()
    .eq('id', selectedFish.value.id)
    .eq('user_id', currentUserId.value)

  if (deleteError) {
    error.value = deleteError.message || 'Could not delete fish.'
    return
  }

  fish.value = fish.value.filter(f => f.id !== selectedFish.value.id)
  close()
}
</script>

<style scoped>
.aquarium-page {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background:
    linear-gradient(180deg, rgba(6, 182, 212, 0.24), rgba(15, 118, 110, 0.22)),
    url('https://cdn.vectorstock.com/i/500p/26/43/coral-reef-aquarium-background-vector-50352643.jpg') center / cover fixed;
}

.aquarium-header {
  position: relative;
  z-index: 12;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 12px;
}

.nav-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.action-btn {
  border: 0;
  border-radius: 8px;
  background: #0891b2;
  color: white;
  cursor: pointer;
  font-weight: 700;
  line-height: 1;
  padding: 10px 14px;
  text-decoration: none;
  box-shadow: 0 8px 20px rgba(8, 47, 73, 0.22);
}

.action-btn:hover,
.action-btn:focus-visible {
  background: #0e7490;
}

.action-link {
  display: inline-flex;
  align-items: center;
}

.profile-btn {
  background: #2563eb;
}

.profile {
  position: absolute;
  right: 12px;
  top: 64px;
  z-index: 14;
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

.fish:hover {
  z-index: 3;
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
  .aquarium-header {
    align-items: stretch;
    flex-direction: column;
  }

  .nav-actions {
    order: 2;
  }

  .profile-btn {
    align-self: flex-start;
    order: 1;
  }

  .profile {
    left: 12px;
    right: 12px;
    top: 132px;
  }
}
</style>
