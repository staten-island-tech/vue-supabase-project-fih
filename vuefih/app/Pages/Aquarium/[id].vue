<template>
  <div>
    <h1>User Aquarium</h1>
    <GoBackButton :targetId="userId" />
    <UserProfile :canEdit="canEditProfile" />

    <p v-if="loading">Loading…</p>
    <p v-if="error" style="color:red">{{ error }}</p>

    <div v-if="!loading && aquariums.length === 0">
      <p>No aquariums found for this user.</p>
    </div>

    <ul v-if="aquariums.length">
      <li v-for="aq in aquariums" :key="String(aq.id)">
        <h3>{{ aq.name }}</h3>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '~/Stores/store'
import UserProfile from '~/components/userProfile.vue'
import GoBackButton from '~/components/GoBackButton.vue'
import type { aq } from '~/Types And Interfaces/types'

const route = useRoute()
const router = useRouter()
const supabase = useSupabaseClient()
const auth = useAuthStore()
const aquariums = ref<aq[]>([])
const loading = ref(true)
const error = ref('')

const rawId = route.params.id
const userId = Array.isArray(rawId) ? rawId[0] : rawId

const canEditProfile = computed(() => !!auth.user && auth.user.id === userId)

if (!userId) {
  router.replace('/Aquarium')
} else {
  onMounted(async () => {
    if (!auth.user) {
      await auth.fetchUser()
    }

    loading.value = true
    error.value = ''
    try {
      const { data, error: supErr } = await supabase
        .from('aquariums')
        .select('*')
        .eq('user_id', userId)

      if (supErr) {
        error.value = supErr.message || 'Failed to load aquariums.'
      } else {
        aquariums.value = data ?? []
      }
    } catch (err: any) {
      error.value = err?.message || String(err)
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped>
/* minimal styling */
</style>