<template style="width: 100%; height: 100%;">
    <div class="min-h-screen w-full bg-cover bg-center bg-fixed bg-no-repeat relative" :style="{ backgroundImage: `url('https://cdn.vectorstock.com/i/500p/26/43/coral-reef-aquarium-background-vector-50352643.jpg')` }">
        <GoBackButton style="position: absolute; top: 10px; left: 10px;"/>
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" style="position: absolute; bottom: 10px; left: 10px;" v-show="showVisitFunctionbtn" @click="toggleVisitFunction">Visit Other Aquariums!</button>
        <VisitFunction v-show="showVisitFunction"/>
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" style="position: absolute; top: 10px; right: 10px;" v-show="showUserProfilebtn" @click="toggleUserProfile">User Profile</button>
        <UserProfile class="position-absolute top-10 right-10" v-show="showUserProfile"/>
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