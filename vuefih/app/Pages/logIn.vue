<template>
  <form>
  <div>
    <h1>Welcome!</h1>
    <h2>Please Log In</h2>
    <h2>New Email</h2>
    <input type="text" class="Email" name="Email" required size="10">
    <h2>New Password</h2>
    <input type="text" class="Password" name="Password" required size="10">
    <nuxt-link><!-- Here Put Something to link to the Aquarium -->
      <h2>To Your Aquarium!</h2>
    </nuxt-link to="/Aquarium">
    <h2>New Here?</h2>
    <nuxt-link to="/signIn">
      <h2>Sign In</h2>
    </nuxt-link> 
  </div>
  </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup () {
    

    return {}
  }
})
</script>

<style scoped>

</style>