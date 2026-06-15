<template>
  <div class="page">
    <header>
      <NuxtLink to="/Aquarium">
        Back to Aquarium
      </NuxtLink>
    </header>

    <section class="preview-card">
      <h2>Fish Preview</h2>

      <img
        v-if="publicUrl"
        :src="publicUrl"
        alt="fish"
        class="fish-image"
      />

      <p v-else>No image found.</p>
    </section>

    <section class="details-card">
      <input v-model="fishName" placeholder="Name" />
      <input v-model="fishDescription" placeholder="Fish Description" />

      <button class="save-next" @click="saveAndNext">
        Save and next
      </button>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import {
  useSupabaseClient,
  useSupabaseUser,
  useRoute,
  useRouter
} from '#imports'

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const route = useRoute()
const router = useRouter()

const publicUrl = ref(null)
const fishName = ref('')
const fishDescription = ref('')

const loadUserImage = async () => {
  const userId =
    user.value?.id ||
    (await supabase.auth.getUser()).data?.user?.id ||
    (await supabase.auth.getSession()).data?.session?.user?.id

  const savedFishId = route.query.savedFishId || route.query.fishId
  const queryPath = route.query.filePath ? String(route.query.filePath) : null

  if (savedFishId) {
    const key = `aquarium-fish-${userId || 'anon'}`

    try {
      const list = JSON.parse(localStorage.getItem(key) || '[]')
      const found = list.find(f => String(f.id) === String(savedFishId))

      if (found) {
        publicUrl.value = found.publicUrl || found.src || null
        fishName.value = found.name || ''
        fishDescription.value = found.description || ''
        return
      }
    } catch {}
  }

  const savedPath =
    userId && localStorage.getItem(`fish-image-path-${userId}`)

  const path = queryPath || savedPath

  if (path) {
    const { data } = supabase.storage.from('Fish').getPublicUrl(path)
    const url = data?.publicUrl || data?.publicURL

    if (url) {
      publicUrl.value = url
      return
    }
  }

  if (!userId) return

  const { data: files } = await supabase.storage
    .from('Fish')
    .list(`Fish Drawings/${userId}`)

  const latest = files
    ?.filter(f => f.name)
    ?.sort((a, b) => b.name.localeCompare(a.name))[0]

  if (!latest) return

  const { data } = supabase.storage
    .from('Fish')
    .getPublicUrl(`Fish Drawings/${userId}/${latest.name}`)

  publicUrl.value = data?.publicUrl || data?.publicURL || null
}

onMounted(loadUserImage)
watch(user, loadUserImage, { immediate: true })

const saveAndNext = () => {
  const userId = user.value?.id || 'anon'
  const key = `aquarium-fish-${userId}`
  const savedFishId = route.query.savedFishId || route.query.fishId

  let list = []

  try {
    list = JSON.parse(localStorage.getItem(key) || '[]')
  } catch {}

  const index = savedFishId
    ? list.findIndex(f => String(f.id) === String(savedFishId))
    : -1

  const existing = index >= 0 ? list[index] : null

  const fish = {
    id: existing?.id || Date.now(),
    publicUrl: publicUrl.value,
    name: fishName.value,
    description: fishDescription.value,
    createdAt: existing?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  if (index >= 0) list[index] = fish
  else list.push(fish)

  localStorage.setItem(key, JSON.stringify(list))
  router.push('/Aquarium')
}
</script>

<style scoped>

</style>