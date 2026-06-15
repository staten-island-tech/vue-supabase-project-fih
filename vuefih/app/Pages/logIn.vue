<template>
 <form @submit.prevent="login">
  <div class="login-box">
    <h1>Welcome!</h1>
    <h2>Please Log In</h2>

    <h2>Email</h2>
    <input type="email" v-model="email" name="Email" required />

    <h2>Password</h2>
    <input type="password" v-model="password" name="Password" required />

    <button type="submit" :disabled="auth.loading">
      Log In
    </button>

    <h2>New Here?</h2>

    <NuxtLink to="/signIn">
    Sign In
    </NuxtLink>

    <p v-if="auth.error">{{ auth.error }}</p>
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
<style scoped>
form {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle at top, #0f172a, #020617);
}

.login-box {
  width: 90%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.45);
  text-align: center;
}

h1 {
  margin: 0;
  font-size: 1.6rem;
}

h2 {
  margin: 0;
  font-size: 1rem;
  color: #374151;
}

input {
  width: 100%;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  outline: none;
  font-size: 14px;
}

input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

button {
  width: 100%;
  padding: 10px 14px;
  border-radius: 10px;
  border: none;
  font-weight: 700;
  cursor: pointer;
}

button[type="submit"] {
  background: #06b6d4;
  color: white;
}

button[type="button"] {
  background: rgba(15, 23, 42, 0.08);
  color: #111827;
}

button:hover {
  opacity: 0.9;
}

p {
  color: #ef4444;
  margin: 0;
}
</style>
