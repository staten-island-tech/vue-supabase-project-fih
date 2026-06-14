<template>
  <div class="page">
    <header>
      <NuxtLink to="/AcquariumScreen">
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
      <input
        placeholder="Name"
      />

      <input
        placeholder="Fish Description"
      />
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useSupabaseClient, useSupabaseUser, useRoute } from '#imports'

const publicUrl = ref(null)
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const route = useRoute()

const loadUserImage = async () => {
  let userId = user.value?.id

  if (!userId) {
    const { data: authData, error: authError } =
      await supabase.auth.getUser()

    if (authError) {
      console.warn('Supabase getUser fallback error', authError)
    }

    userId = authData?.user?.id
  }

  if (!userId) {
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession()

    if (sessionError) {
      console.warn('Supabase getSession fallback error', sessionError)
    }

    userId = sessionData?.session?.user?.id
  }

  const queryPath = route.query.filePath
    ? String(route.query.filePath)
    : null

  const savedPath = userId
    ? localStorage.getItem(`fish-image-path-${userId}`)
    : null

  const path = queryPath
    ? decodeURIComponent(queryPath)
    : savedPath

  if (path) {
    const { data, error } =
      supabase.storage
        .from('Fish')
        .getPublicUrl(path)

    if (error) {
      console.error('getPublicUrl error:', error)
      return
    }

    publicUrl.value =
      data?.publicUrl ||
      data?.publicURL ||
      null

    return
  }

  if (!userId) {
    console.warn('No signed in user found')
    return
  }

  const folder = `Fish Drawings/${userId}`

  const { data: files, error: listError } =
    await supabase.storage
      .from('Fish')
      .list(folder)

  if (listError) {
    console.error('Storage list error:', listError)
    return
  }

  if (!files?.length) {
    publicUrl.value = null
    return
  }

  const latestFile = [...files]
    .filter(file => file.name)
    .sort((a, b) =>
      b.name.localeCompare(a.name)
    )[0]

  if (!latestFile) {
    publicUrl.value = null
    return
  }

  const filePath =
    `${folder}/${latestFile.name}`

  const { data, error } =
    supabase.storage
      .from('Fish')
      .getPublicUrl(filePath)

  if (error) {
    console.error('getPublicUrl error:', error)
    return
  }

  publicUrl.value =
    data?.publicUrl ||
    data?.publicURL ||
    null
}

onMounted(loadUserImage)
watch(user, loadUserImage, {
  immediate: true
})
</script>

<style scoped>

</style>