<template style="width: 100%; height: 100%;">
  <div
    class="min-h-screen w-full bg-cover bg-center bg-fixed bg-no-repeat relative"
    :style="{
      backgroundImage: `url('https://cdn.vectorstock.com/i/500p/26/43/coral-reef-aquarium-background-vector-50352643.jpg')`
    }"
  >
    <GoBackButton style="position: absolute; top: 10px; left: 10px;" />

    <button
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      style="position: absolute; bottom: 10px; left: 10px;"
      v-show="showVisitFunctionbtn"
      @click="toggleVisitFunction"
    >
      Visit Other Aquariums!
    </button>

    <VisitFunction v-show="showVisitFunction" />

    <button
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      style="position: absolute; top: 10px; right: 10px;"
      v-show="showUserProfilebtn"
      @click="toggleUserProfile"
    >
      User Profile
    </button>

    <button
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      style="position: absolute; bottom: 10px; right: 10px;"
      @click="goToPixel"
    >
      Create Fish
    </button>

    <UserProfile
      class="user-profile-panel"
      v-show="showUserProfile"
      @close="toggleUserProfile"
    />

    <div class="aquarium-fish-layer">
      <div v-if="fish.length" class="aquarium-container">
        <div
          v-for="f in fish"
          :key="f.id"
          class="fish-wrapper"
          :style="f.style"
        >
          <img
            :src="f.publicUrl"
            class="aquarium-fish"
            alt="Saved fish"
            @click="openFish(f)"
          />
        </div>
      </div>

      <div v-else class="empty-fish">
        No fish yet — create one!
      </div>
    </div>

    <div v-if="showModal" class="modal-backdrop" @click.self="closeModal">
      <div class="fish-card">
        <button class="close" @click="closeModal">✕</button>

        <img :src="selectedFish.publicUrl" class="card-img" />

        <h3 class="card-name">
          {{ selectedFish.name || 'Unnamed fish' }}
        </h3>

        <p class="card-desc">
          {{ selectedFish.description || 'No description' }}
        </p>

        <div class="card-actions">
          <button class="edit-btn" @click="editFish">Edit</button>
          <button class="delete-btn" @click="deleteFish">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useSupabaseClient, useSupabaseUser } from '#imports'

const router = useRouter()
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const showVisitFunctionbtn = ref(true)
const showUserProfilebtn = ref(true)
const showVisitFunction = ref(false)
const showUserProfile = ref(false)

const fish = ref([])
const selectedFish = ref(null)
const showModal = ref(false)

function toggleVisitFunction() {
  showVisitFunction.value = !showVisitFunction.value
  showUserProfile.value = false
}

function toggleUserProfile() {
  showUserProfile.value = !showUserProfile.value
  showVisitFunction.value = false
}

function goToPixel() {
  router.push('/PixelArtFish')
}

const loadFish = async () => {
 const route = useRoute()

const loadFish = async () => {
  const userId = targetUserId.value

  if (!userId) return

  const { data, error } = await supabase
    .from('aquarium')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.log(error)
    fish.value = []
    return
  }

  fish.value = (data || []).map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    publicUrl: item.public_url,
    style: randomStyle()
  }))
}

const randomStyle = () => {
  const left = Math.floor(5 + Math.random() * 80)
  const top = Math.floor(10 + Math.random() * 70)
  const dur = Math.floor(6 + Math.random() * 6)

  return `
    position:absolute;
    left:${left}%;
    top:${top}%;
    transform:translate(-50%,-50%);
    animation: swim ${dur}s ease-in-out infinite alternate;
  `
}

const openFish = (f) => {
  selectedFish.value = f
  showModal.value = true
}

const closeModal = () => {
  selectedFish.value = null
  showModal.value = false
}

const editFish = () => {
  if (!selectedFish.value) return
  router.push(`/FishDescription?id=${selectedFish.value.id}`)
}

const deleteFish = async () => {
  if (!selectedFish.value) return

  const { error } = await supabase
    .from('aquarium')
    .delete()
    .eq('id', selectedFish.value.id)

  if (error) return

  fish.value = fish.value.filter(f => f.id !== selectedFish.value.id)
  closeModal()
}

watch(targetUserId, async () => {
  await loadFish()
}, { immediate: true })

onMounted(loadFish)
</script>

<style scoped>
.aquarium-fish-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.user-profile-panel {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 50;
}

.aquarium-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.aquarium-fish {
  width: 80px;
  height: auto;
  pointer-events: auto;
  cursor: pointer;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
}

.empty-fish {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0,0,0,0.6);
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.4);
}

.fish-card {
  background: white;
  padding: 1rem 1.25rem;
  border-radius: 10px;
  width: 320px;
  text-align: center;
}

.card-img {
  width: 180px;
  margin: 0.5rem auto;
}

.card-actions {
  margin-top: 0.75rem;
  display: flex;
  justify-content: center;
}

.edit-btn {
  background: #06b6d4;
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
}

.delete-btn {
  background: #ef4444;
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  margin-left: 0.75rem;
  border: none;
}

@keyframes swim {
  from { transform: translate(-50%,-50%) translateX(-8px); }
  to { transform: translate(-50%,-50%) translateX(8px); }
}
</style>