<template>
  <button v-show="show" @click="goBack">{{ label }}</button>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
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
  // Show button only if: user is signed in, viewing a different aquarium, and target is valid
  return !!userId && !!targetId && userId !== targetId
})

const label = computed(() =>
  currentUserId.value === resolvedTargetId.value ? 'Go back to your aquarium' : 'Go back to my aquarium'
)

onMounted(() => {
  // eslint-disable-next-line no-console
  console.log('[GoBackButton] mounted:', { 
    propTarget: props.targetId, 
    resolvedTarget: resolvedTargetId.value, 
    currentUserId: currentUserId.value, 
    show: show.value 
  })
})

async function goBack() {
  const id = currentUserId.value
  if (id) {
    await router.push(`/Aquarium/${id}`)
  } else {
    await router.push('/Aquarium')
  }
}
</script>
