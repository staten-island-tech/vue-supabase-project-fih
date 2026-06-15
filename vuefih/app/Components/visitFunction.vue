<template>
  <section class="visit-card">
    <label>
      <span>User ID</span>
      <input v-model="id" type="text" placeholder="Paste an aquarium user ID" @keyup.enter="visitAquarium" />
    </label>
    <button type="button" @click="visitAquarium">Visit Aquarium</button>
    <p v-if="errormessage" class="error-message">{{ errormessage }}</p>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useSupabaseClient } from '#imports';

const id = ref('');
let errormessage = ref('');
const router = useRouter();
const supabase = useSupabaseClient();

async function visitAquarium() {
    errormessage.value = '';

    if (!id.value.trim()) {
        errormessage.value = 'Please enter a valid ID.';
        return;
    }

    const { data, error } = await supabase
        .from('aquarium')
        .select('user_id')
        .eq('user_id', id.value.trim())
        .limit(1)
        .maybeSingle();

    if (error) {
        errormessage.value = 'Unable to check that ID right now.';
        return;
    }

    if (!data) {
        errormessage.value = 'No aquarium was found for that user ID.';
        return;
    }

    await router.push(`/Aquarium/${id.value.trim()}`);
}

</script>

<style scoped>
.visit-card {
  display: grid;
  gap: 10px;
  width: min(360px, calc(100vw - 32px));
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.92);
  color: #0f172a;
  padding: 14px;
  box-shadow: 0 16px 34px rgba(8, 47, 73, 0.18);
}

label {
  display: grid;
  gap: 8px;
  font-weight: 800;
}

input {
  width: 100%;
  border: 1px solid #67e8f9;
  border-radius: 8px;
  color: #0f172a;
  font: inherit;
  padding: 10px 12px;
}

button {
  border: 0;
  border-radius: 8px;
  background: #0891b2;
  color: white;
  cursor: pointer;
  font-weight: 800;
  padding: 10px 14px;
}

.error-message {
  margin: 0;
  color: #b91c1c;
  font-weight: 700;
}
</style>
