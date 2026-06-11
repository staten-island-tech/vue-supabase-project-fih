<template>
    <div>
        <img src="https://th.bing.com/th/id/OIP.i3qQLulfg9NApqe_4NaYzgHaHa?w=214&h=214&c=7&r=0&o=7&pid=1.7&rm=3" alt="User Profile Picture" />
        <h1>User Email</h1>
        <h3>{{ userEmail }}</h3>
        <h2>User Id</h2>
        <h3>{{ userId }}</h3>
        <button @click="UpdateProfile">Update Profile</button>
        <button @click="SignOut">Sign Out</button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '~/Stores/store';
import { useSupabaseClient } from "#imports";

const userEmail = ref("");
const userId = ref("");
const auth = useAuthStore();
const supabase = useSupabaseClient();

async function UpdateProfile() {
    auth.updateProfile();
}

function SignOut() {
    auth.signOut();
}
</script>

<style scoped>

</style>