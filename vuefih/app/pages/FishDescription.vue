<template>
  <div class="description-page">
    <header class="page-header">
      <NuxtLink class="ghost-btn" to="/Aquarium">Back</NuxtLink>
      <h1>Fish Details</h1>
    </header>

    <main class="details-panel">
      <section v-if="loading" class="status">Loading fish...</section>

      <section v-else class="editor">
        <div class="preview">
          <img v-if="publicUrl" :src="publicUrl" class="fish-image" alt="Saved fish" />
          <p v-else>No image found.</p>
        </div>

        <label>
          <span>Name</span>
          <input v-model="fishName" placeholder="Name your fish" />
        </label>

        <label>
          <span>Description</span>
          <textarea
            v-model="fishDescription"
            placeholder="Write a short description"
            rows="4"
          />
        </label>

        <p v-if="message" class="message" :class="{ error: hasError }">{{ message }}</p>

        <button class="save-btn" :disabled="saving" @click="saveFish">
          {{ saving ? 'Saving...' : 'Save Fish' }}
        </button>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter, useSupabaseClient, useSupabaseUser } from '#imports'

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const route = useRoute()
const router = useRouter()

const publicUrl = ref('')
const fishName = ref('')
const fishDescription = ref('')
const loading = ref(true)
const saving = ref(false)
const message = ref('')
const hasError = ref(false)

const getUserId = async () => {
  if (user.value?.id) return user.value.id

  const { data: authData } = await supabase.auth.getUser()
  if (authData?.user?.id) return authData.user.id

  const { data: sessionData } = await supabase.auth.getSession()
  return sessionData?.session?.user?.id || null
}

const getRouteValue = (key) => {
  const value = route.query[key]
  if (!value) return null
  return Array.isArray(value) ? value[0] : value
}

const getRouteFishId = () => getRouteValue('savedFishId') || getRouteValue('id')
const getRouteFilePath = () => getRouteValue('filePath')

const loadImage = async () => {
  loading.value = true
  message.value = ''
  hasError.value = false

  const savedFishId = getRouteFishId()
  const filePath = getRouteFilePath()

  if (savedFishId) {
    const userId = await getUserId()
    if (!userId) {
      message.value = 'Please log in before editing fish details.'
      hasError.value = true
      loading.value = false
      await router.push('/login')
      return
    }

    const { data, error } = await supabase
      .from('aquarium')
      .select('id, name, description, public_url')
      .eq('id', savedFishId)
      .eq('user_id', userId)
      .maybeSingle()

    if (error) {
      message.value = error.message || 'Failed to load fish.'
      hasError.value = true
      loading.value = false
      return
    }

    if (!data) {
      message.value = 'Fish not found in your aquarium.'
      hasError.value = true
      loading.value = false
      return
    }

    publicUrl.value = data?.public_url || ''
    fishName.value = data?.name || ''
    fishDescription.value = data?.description || ''
    loading.value = false
    return
  }

  if (filePath) {
    const { data } = supabase.storage.from('Fish').getPublicUrl(String(filePath))
    publicUrl.value = data?.publicUrl || data?.publicURL || ''
  }

  loading.value = false
}

const saveFish = async () => {
  if (saving.value) return

  saving.value = true
  message.value = ''
  hasError.value = false

  try {
    const userId = await getUserId()
    if (!userId) {
      message.value = 'Please log in before saving fish details.'
      hasError.value = true
      await router.push('/login')
      return
    }

    if (!publicUrl.value) {
      message.value = 'Missing fish image.'
      hasError.value = true
      return
    }

    const savedFishId = getRouteFishId()
    const payload = {
      user_id: userId,
      name: fishName.value.trim() || 'Unnamed Fish',
      description: fishDescription.value.trim(),
      public_url: publicUrl.value
    }

    if (savedFishId) {
      const { error } = await supabase
        .from('aquarium')
        .update(payload)
        .eq('id', savedFishId)
        .eq('user_id', userId)

      if (error) throw error
    } else {
      const { error } = await supabase.from('aquarium').insert(payload)
      if (error) throw error
    }

    await router.replace('/Aquarium')
  } catch (err) {
    message.value = err?.message || 'Failed to save fish.'
    hasError.value = true
  } finally {
    saving.value = false
  }
}

onMounted(loadImage)
</script>

<style scoped>
.description-page {
  min-height: 100vh;
  background:
    linear-gradient(135deg, rgba(14, 165, 233, 0.16), rgba(20, 184, 166, 0.18)),
    #e0f2fe;
  color: #0f172a;
  padding: 24px;
}

.page-header {
  max-width: 900px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.page-header h1 {
  margin: 0;
  font-size: 1.75rem;
}

.ghost-btn,
.save-btn {
  border: 0;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
  padding: 10px 14px;
  text-decoration: none;
}

.ghost-btn {
  background: white;
  color: #0369a1;
}

.details-panel {
  max-width: 900px;
  margin: 0 auto;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  box-shadow: 0 18px 42px rgba(8, 47, 73, 0.16);
}

.editor {
  display: grid;
  grid-template-columns: minmax(180px, 280px) 1fr;
  gap: 16px;
  align-items: start;
}

.preview {
  grid-row: span 3;
  min-height: 220px;
  display: grid;
  place-items: center;
  border: 1px solid #bae6fd;
  border-radius: 8px;
  background: #f0f9ff;
}

.fish-image {
  max-width: 220px;
  width: 80%;
  image-rendering: pixelated;
}

label {
  display: grid;
  gap: 8px;
  font-weight: 700;
}

input,
textarea {
  width: 100%;
  border: 1px solid #bae6fd;
  border-radius: 8px;
  color: #0f172a;
  font: inherit;
  padding: 10px 12px;
}

textarea {
  resize: vertical;
}

.save-btn {
  justify-self: start;
  background: #0891b2;
  color: white;
}

.save-btn:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.status,
.message {
  margin: 0;
  color: #0369a1;
}

.message.error {
  color: #b91c1c;
}

@media (max-width: 720px) {
  .description-page {
    padding: 16px;
  }

  .editor {
    grid-template-columns: 1fr;
  }

  .preview {
    grid-row: auto;
  }
}
</style>
