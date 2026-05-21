<template>
  <form>
  <div>
    <h1>Welcome!</h1>
    <h2>Please Log In</h2>
    <input type="text" class="Email" name="Email" required size="10">
    <input type="text" class="Password" name="Password" required size="10">
    <nuxt-link :to="Aquarium"><!-- Here Put Something to link tho the Aquarium -->
      <h2>To Your Aquarium!</h2>
    </nuxt-link>
    <h2>New Here?</h2>
    <nuxt-link to="/signIn">
      <h2>Sign In</h2>
    </nuxt-link> 
  </div>
  </form>
</template>

<script setup lang="ts">
import Aquarium from '~/Pages/Aquarium.vue';
</script>

<style>

</style>