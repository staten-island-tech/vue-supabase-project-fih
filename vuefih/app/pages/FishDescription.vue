<template>
  <div class="page">
    <header>
      <NuxtLink to="/Aquarium">Back</NuxtLink>
    </header>

    <section v-if="loading">Loading...</section>

    <section v-else>
      <img v-if="publicUrl" :src="publicUrl" class="fish-image" />
      <p v-else>No image found.</p>

      <input v-model="fishName" placeholder="Name" />
      <input v-model="fishDescription" placeholder="Description" />

      <button @click="saveFish">Save</button>
    </section>
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

const getUserId = async () => {
  if (user.value?.id) {
    return user.value.id
  }

  const { data: authData } = await supabase.auth.getUser()
  if (authData?.user?.id) {
    return authData.user.id
  }

  const { data: sessionData } = await supabase.auth.getSession()
  return sessionData?.session?.user?.id || null
}

const getRouteFishId = () => {
  const queryId = route.query.savedFishId || route.query.id
  if (!queryId) return null
  return Array.isArray(queryId) ? queryId[0] : queryId
}

const getRouteFilePath = () => {
  const queryPath = route.query.filePath
  if (!queryPath) return null
  return Array.isArray(queryPath) ? queryPath[0] : queryPath
}

const loadImage = async () => {
  loading.value = true
  const savedFishId = getRouteFishId()
  const filePath = getRouteFilePath()

  if (savedFishId) {
    const { data, error } = await supabase
      .from('aquarium')
      .select('id,background')
      .eq('id', savedFishId)
      .single()

    if (error) {
      console.error('Failed to load fish entry:', error)
      loading.value = false
      return
    }

    publicUrl.value = data?.background || ''
    fishName.value = ''
    fishDescription.value = ''
    loading.value = false
    return
  }

  if (!filePath) {
    loading.value = false
    return
  }

  const { data } = supabase.storage
    .from('Fish')
    .getPublicUrl(String(filePath))

  publicUrl.value = data?.publicUrl || data?.publicURL || ''
  loading.value = false
}

const saveFish = async () => {
  try {
    const userId = await getUserId()
    if (!userId) {
      console.warn('No user found')
      return
    }

    if (!publicUrl.value) {
      console.log('missing image')
      return
    }

    const savedFishId = route.query.savedFishId || route.query.id || null
    const aquariumId = savedFishId || userId

    const { error } = await supabase
      .from('aquarium')
      .upsert(
        {
          id: aquariumId,
          background: publicUrl.value
        },
        { onConflict: 'id' }
      )

    if (error) {
      console.error('Save failed:', error)
      return
    }

    await router.replace('/Aquarium')
  } catch (err) {
    console.error('SAVE FAILED:', err)
  }
}

onMounted(loadImage)
</script>