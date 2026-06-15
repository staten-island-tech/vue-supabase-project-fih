<template>
  <div class="pixel-page">
    <header class="toolbar">
      <NuxtLink class="tool-button" to="/Aquarium">Back</NuxtLink>

      <label>
        <span>Color</span>
        <input v-model="currentColor" type="color" />
      </label>

      <label class="range-label">
        <span>Brush {{ brushSize }}</span>
        <input v-model.number="brushSize" min="1" max="40" type="range" />
      </label>

      <label class="check-row">
        <input v-model="isEraser" type="checkbox" />
        <span>Eraser</span>
      </label>

      <button class="tool-button save-button" :disabled="saving" @click="save">
        {{ saving ? 'Saving...' : 'Save Fish' }}
      </button>

      <p v-if="message" class="message">{{ message }}</p>
    </header>

    <DrawingCanvas
      :current-color="currentColor"
      :brush-size="brushSize"
      :is-eraser="isEraser"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useSupabaseClient, useSupabaseUser } from '#imports'

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

const currentColor = ref('#0f172a')
const brushSize = ref(8)
const isEraser = ref(false)
const saving = ref(false)
const message = ref('')

async function getUserId() {
  if (user.value?.id) return user.value.id

  const { data: userData } = await supabase.auth.getUser()
  if (userData?.user?.id) return userData.user.id

  const { data: sessionData } = await supabase.auth.getSession()
  return sessionData?.session?.user?.id || null
}

async function save() {
  if (saving.value) return

  saving.value = true
  message.value = ''

  try {
    const userId = await getUserId()
    if (!userId) {
      message.value = 'Please log in before saving a fish.'
      await router.push('/login')
      return
    }

    const canvas = document.querySelector('.drawing-canvas')
    if (!canvas) {
      message.value = 'Canvas is not ready yet.'
      return
    }

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
    if (!blob) {
      message.value = 'Could not save the drawing.'
      return
    }

    const filename = `fish_${Date.now()}.png`
    const path = `${userId}/${filename}`
    const file = new File([blob], filename, { type: 'image/png' })

    const { error: uploadError } = await supabase.storage
      .from('Fish')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: 'image/png'
      })

    if (uploadError) throw uploadError

    const { data: publicData } = supabase.storage.from('Fish').getPublicUrl(path)
    const publicUrl = publicData?.publicUrl || publicData?.publicURL || ''

    if (!publicUrl) {
      throw new Error('Saved image did not return a public URL.')
    }

    const { data: insertedFish, error: insertError } = await supabase
      .from('aquarium')
      .insert({
        user_id: userId,
        name: 'New Fish',
        description: '',
        public_url: publicUrl
      })
      .select('id')
      .single()

    if (insertError) throw insertError

    await router.push(`/FishDescription?id=${insertedFish.id}`)
  } catch (err) {
    message.value = err?.message || 'Failed to save fish.'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.pixel-page {
  min-height: 100vh;
  background: #dff7fb;
}

.toolbar {
  min-height: 64px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  padding: 12px;
  background: #0f172a;
  color: white;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.2);
}

.toolbar label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
}

.range-label input {
  width: 140px;
}

.check-row {
  user-select: none;
}

.tool-button {
  border: 0;
  border-radius: 8px;
  background: #06b6d4;
  color: white;
  cursor: pointer;
  font-weight: 700;
  padding: 9px 12px;
  text-decoration: none;
}

.save-button {
  background: #14b8a6;
}

.tool-button:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.message {
  margin: 0;
  color: #fecaca;
  font-weight: 700;
}

@media (max-width: 640px) {
  .toolbar {
    align-items: stretch;
  }

  .toolbar label,
  .tool-button {
    justify-content: center;
  }
}
</style>
