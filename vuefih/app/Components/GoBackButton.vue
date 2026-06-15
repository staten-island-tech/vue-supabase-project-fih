<template>
  <button v-if="show" class="go-back-btn" type="button" @click="goBack">
    {{ label }}
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSupabaseUser } from '#imports'
import { useAuthStore } from '~/Stores/store'

const props = defineProps({
  targetId: {
    type: String,
    default: ''
  }
})

const router = useRouter()
const route = useRoute()
const currentUser = useSupabaseUser()
const auth = useAuthStore()

// Resolve target ID from prop, route params, or route path
const resolvedTargetId = computed(() => {
  if (props.targetId && props.targetId !== '') return props.targetId
  
  const raw = route.params.id
  if (raw) {
    return Array.isArray(raw) ? raw[0] : String(raw)
  }
  
  // fallback: parse id from the path (e.g. /aquarium/<id>)
  const path = String(route.path || '')
  const m = path.match(/\/aquarium\/([^\/\?#]+)/i)
  return m ? m[1] : ''
})

const currentUserId = computed(() => currentUser.value?.id ?? auth.user?.id ?? '')
const show = computed(() => {
  const userId = currentUserId.value
  const targetId = resolvedTargetId.value
  return !!userId && !!targetId && userId !== targetId
})

const label = computed(() => 'My Aquarium')

async function goBack() {
  await router.push('/Aquarium')
}
</script>

<style scoped>
.go-back-btn {
  border: 0;
  border-radius: 8px;
  background: #f8fafc;
  color: #0369a1;
  cursor: pointer;
  font-weight: 700;
  line-height: 1;
  padding: 10px 14px;
  text-decoration: none;
  box-shadow: 0 8px 20px rgba(8, 47, 73, 0.18);
}

.go-back-btn:hover,
.go-back-btn:focus-visible {
  background: #e0f2fe;
}
</style>
