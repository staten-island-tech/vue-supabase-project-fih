<template>
  <div
    class="min-h-screen w-full bg-cover bg-center bg-fixed bg-no-repeat relative"
    :style="{
      backgroundImage: `url('https://cdn.vectorstock.com/i/500p/26/43/coral-reef-aquarium-background-vector-50352643.jpg')`
    }"
  >
    <GoBackButton class="z-10 absolute top-2 left-2" />

    <button
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded absolute bottom-2 left-2 z-10"
      v-show="showVisitFunctionbtn"
      @click="toggleVisitFunction"
    >
      Visit Other Aquariums!
    </button>

    <VisitFunction v-show="showVisitFunction" />

    <button
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded absolute top-2 right-2 z-10"
      v-show="showUserProfilebtn"
      @click="toggleUserProfile"
    >
      User Profile
    </button>

    <button
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded absolute bottom-2 right-2 z-10"
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
      <div v-if="fish.length > 0" class="aquarium-container">
        <div
          v-for="f in fish"
          :key="f.id"
          class="fish-wrapper"
          :style="f.style"
        >
          <img
            :src="f.publicUrl"
            class="aquarium-fish"
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

const fish = ref([])
const selectedFish = ref(null)
const showModal = ref(false)

const showVisitFunctionbtn = ref(true)
const showVisitFunction = ref(false)
const showUserProfilebtn = ref(true)
const showUserProfile = ref(false)

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
  const userId = user.value?.id
  if (!userId) return

  const { data, error } = await supabase
    .from('aquarium')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
    fish.value = []
    return
  }

  fish.value = (data || []).map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    publicUrl: item.public_url,
    style: {
      position: 'absolute',
      left: `${10 + Math.random() * 80}%`,
      top: `${10 + Math.random() * 70}%`,
      transform: 'translate(-50%, -50%)'
    }
  }))
}

watch(user, (val) => {
  if (val?.id) loadFish()
}, { immediate: true })

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

  if (error) {
    console.error(error)
    return
  }

  fish.value = fish.value.filter(f => f.id !== selectedFish.value.id)
  closeModal()
}
</script>

<style scoped>
.aquarium-fish-layer {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.aquarium-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.aquarium-fish {
  width: 85px;
  cursor: pointer;
  pointer-events: auto;
  filter: drop-shadow(0 6px 10px rgba(0,0,0,0.35));
}

.empty-fish {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: 600;
  background: rgba(0,0,0,0.3);
  padding: 12px 18px;
  border-radius: 12px;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.55);
  z-index: 50;
}

.fish-card {
  background: white;
  padding: 20px;
  border-radius: 16px;
  width: 340px;
  text-align: center;
}

.card-img {
  width: 170px;
}

.card-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
}
</style>