<template>
  <form @submit.prevent="login">
    <div style="position: relative; border: 1px solid #ccc; border-radius: 20px; padding: 20px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 50%;">
      <h1 style="text-align: center; font-family: Roboto, sans-serif;">Welcome!</h1>
      <h2 style="text-align: center; font-family: Roboto, sans-serif;">Please Log In</h2>
      <h2 style="text-align: center; font-family: Roboto, sans-serif;">Email</h2>
      <input  style="flex: 1; display: flex; justify-self: center;  width: 50%;" type="email" v-model="email" name="Email" required size="10" />
      <h2 style="text-align: center; font-family: Roboto, sans-serif;">Password</h2>
      <input
        type="password"
        v-model="password"
        name="Password"
        required
        size="10"
        style="flex: 1; display: flex; justify-self: center;  width: 50%;"
      />
      <button  style="flex: 1; display: flex; justify-self: center; font-family: Roboto, sans-serif;" type="submit" :disabled="auth.loading">Log In</button>
      <h2 style="text-align: center; font-family: Roboto, sans-serif;">New Here?</h2>
      <nuxt-link style="text-align: center;" to="/signIn">
        <button style="flex: 1; display: flex; justify-self: center; font-family: Roboto, sans-serif;">Sign In</button>
      </nuxt-link>
      <p v-if="auth.error" style="color: red">{{ auth.error }}</p>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "~/Stores/store"; 
import { useSupabaseClient } from "#imports";

type email = string;
type password = string;

const email = ref<email>("");
const password = ref<password>("");
const message = ref("");
const router = useRouter();
const auth = useAuthStore();
const route = useRoute();
const supabase = useSupabaseClient();
const aquariums = ref([]);

async function login() {
  message.value = "";

  const e = (email.value || "").trim();
  const p = (password.value || "").trim();

  if (!e || !p) {
    message.value = "Email and password are required.";
    return;
  }

  console.log("login attempt", { email: e, passwordLength: p.length });

  const res = await auth.signIn(e, p);
  console.log("signIn result", res);

  if (!res.success) {
    message.value =
      (res.error as any)?.message || auth.error || "Login failed.";
    return;
  }

  if (res.data?.user && !res.data?.session) {
    message.value = "Please confirm your email before signing in.";
    return;
  }
  const id = res.data?.user?.id;
  console.log("logged in user id", id);
  const user = res.data?.user ?? null;
  console.log("logged in user", user);
  auth.$patch({ user: user as any });
  await router.push(`/Aquarium/${id}`);
}

onMounted(async () => {
  const rawId = route.params.id;
  const userId = Array.isArray(rawId) ? rawId[0] : rawId;

  if (!userId) {
    return;
  }

  const { data } = await supabase
    .from("aquarium")
    .select("*")
    .eq("id", userId);

  aquariums.value = data ?? [];
});
</script>

<style scoped></style>
