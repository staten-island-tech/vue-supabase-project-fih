<template>
    <div>
        <img src="https://th.bing.com/th/id/OIP.i3qQLulfg9NApqe_4NaYzgHaHa?w=214&h=214&c=7&r=0&o=7&pid=1.7&rm=3" alt="User Profile Picture" />
        <h1>User Email:</h1>
        <h3>{{ userEmail }}</h3>
        <h2>User Id:</h2>
        <h3>{{ userId }}</h3>
        <button @click="SignOut">Sign Out</button>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useAuthStore } from '~/Stores/store';

const props = defineProps({
  canEdit: {
    type: Boolean,
    default: true
  }
});

const auth = useAuthStore();
const userEmail = computed(() => auth.user?.email ?? '');
const userId = computed(() => auth.user?.id ?? '');

onMounted(async () => {
  if (!auth.user) {
    await auth.fetchUser();
  }
});

async function SignOut() {
  await auth.signOut();
}
</script>

<style scoped>

</style>