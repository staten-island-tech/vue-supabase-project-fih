<template>
    <div>
        <GoBackButton />
        <img src="https://media.istockphoto.com/id/500739571/photo/aquascaping-of-the-planted-aquarium.jpg?s=612x612&w=0&k=20&c=YCij36GhbrEIid6LmlNT7ak3WBgYTMpGF6bI-6cpjR4=" alt="Aquarium" />
        <button v-show="showVisitFunctionbtn" @click="toggleVisitFunction">Visit Other Aquariums!</button>
        <VisitFunction v-show="showVisitFunction"/>
        <button v-show="showUserProfilebtn" @click="toggleUserProfile">User Profile</button>
        <UserProfile v-show="showUserProfile"/>
    </div>
</template>

<script setup>
import VisitFunction from '~/components/visitFunction.vue';
import UserProfile from '~/components/userProfile.vue';
import GoBackButton from '~/components/GoBackButton.vue';
import { ref } from 'vue';

const showVisitFunctionbtn = ref(true);
const showUserProfilebtn = ref(true);
const showVisitFunction = ref(false);
const showUserProfile = ref(false);

function toggleVisitFunction() {
    showVisitFunction.value = !showVisitFunction.value;
    showUserProfile.value = false;
}
function toggleUserProfile() {
    showUserProfile.value = !showUserProfile.value;
    showVisitFunction.value = false;
}
</script>

<style scoped>

</style>