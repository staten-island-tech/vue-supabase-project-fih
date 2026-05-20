<template>
    <div>
        <h1>Glad To Have You Here!</h1>
        <input type="text" id= "Email" name="New email" required size="10">
        <input type="text" id= "Password" name="New Password" required size="10">
        <router-link :to="Aquarium">
            <button v-if="Email !== null && Password !== null">To Your Aquarium!</button>
        </router-link>
    </div>
</template>

<script setup lang="ts">
import Aquarium from './Aquarium.vue';

const Email = document.querySelector("Email")
const Password = document.querySelector("Password")
</script>

<style scoped>

</style>