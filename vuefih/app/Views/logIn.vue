<template>
  <div>
    <h1>Welcome!</h1>
    <h2>Please Log In</h2>
    <input type="text" id="Email" name="Email" required size="10">
    <input type="text" id="Password" name="Password" required size="10">
    <router-link :to="Aquarium"><!-- Here Put Something to link tho the Aquarium -->
      <button v-if="Email !== null && Password !== null">To Your Aquarium!</button>
    </router-link>
    <h2>New Here?</h2>
    <router-link :to="SignIn">
    <button>Sign In</button>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import Aquarium from '~/Components/Aquarium.vue';
import SignIn from '~/Components/signIn.vue';

const Email = document.querySelector("Email")
const Password = document.querySelector("Password")
</script>

<style>

</style>