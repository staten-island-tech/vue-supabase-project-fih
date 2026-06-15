<template>
  <div class="user-profile-card">
    <button class="close-profile" type="button" @click="$emit('close')">Close</button>
    <img
      src="https://th.bing.com/th/id/OIP.i3qQLulfg9NApqe_4NaYzgHaHa?w=214&h=214&c=7&r=0&o=7&pid=1.7&rm=3"
      alt="User Profile Picture"
    />
    <div>
      <p class="label">Email</p>
      <p class="value">{{ userEmail || 'Not signed in' }}</p>
    </div>
    <div>
      <p class="label">User ID</p>
      <p class="value id-value">{{ userId || 'No user loaded' }}</p>
    </div>
    <NuxtLink v-if="userId" class="profile-link" :to="publicAquariumPath">
      Public Aquarium
    </NuxtLink>
    <button
      v-if="canEdit"
      class="sign-out-btn"
      type="button"
      :disabled="auth.loading"
      @click="signOut"
    >
      {{ auth.loading ? 'Signing out...' : 'Sign Out' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAuthStore } from '~/Stores/store'

const props = defineProps({
  canEdit: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close'])
const auth = useAuthStore()

const canEdit = computed(() => props.canEdit)
const userEmail = computed(() => auth.user?.email ?? '')
const userId = computed(() => auth.user?.id ?? '')
const publicAquariumPath = computed(() => `/Aquarium/${encodeURIComponent(userId.value)}`)

onMounted(async () => {
  if (!auth.user) {
    await auth.fetchUser()
  }
})

async function signOut() {
  const result = await auth.signOut()
  if (result.success) {
    emit('close')
  }
}
</script>

<style scoped>
.user-profile-card {
  display: grid;
  gap: 12px;
  max-width: 320px;
  padding: 16px;
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.88);
  color: white;
}

.user-profile-card img {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
}

.close-profile {
  justify-self: end;
  border: 0;
  background: transparent;
  color: white;
  cursor: pointer;
  font-weight: 700;
}

.label,
.value {
  margin: 0;
}

.label {
  color: #a5f3fc;
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
}

.value {
  overflow-wrap: anywhere;
}

.id-value {
  font-size: 0.86rem;
}

.profile-link,
.sign-out-btn {
  border: 0;
  border-radius: 8px;
  background: white;
  color: #0369a1;
  cursor: pointer;
  font-weight: 800;
  padding: 9px 12px;
  text-align: center;
  text-decoration: none;
}

.sign-out-btn:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}
</style>
