<template>
    <div>
        <img src="https://media.istockphoto.com/id/500739571/photo/aquascaping-of-the-planted-aquarium.jpg?s=612x612&w=0&k=20&c=YCij36GhbrEIid6LmlNT7ak3WBgYTMpGF6bI-6cpjR4=" alt="Aquarium" />
        <button @click="toggleVisitFunction">Visit Other Aquariums!</button>
        <VisitFunction v-show="showVisitFunction"/>
        <button @click="toggleUserProfile">User Profile</button>
        <UserProfile v-show="showUserProfile"/>
    </div>
</template>

<script setup>
import VisitFunction from '~/components/visitFunction.vue';
import UserProfile from '~/components/userProfile.vue';
import { ref } from 'vue';

const showVisitFunction = ref(false);
const showUserProfile = ref(false);

function toggleVisitFunction() {
    showVisitFunction.value = !showVisitFunction.value;
}
function toggleUserProfile() {
    showUserProfile.value = !showUserProfile.value;
}
</script>

<style scoped>

</style>