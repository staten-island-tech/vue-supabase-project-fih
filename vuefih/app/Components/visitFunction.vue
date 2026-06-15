<template>
    <div class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        <h1>Give Me Their ID!(Can be seen in the URL)</h1>
        <input class = "bg-white text-gray-700 font-bold py-2 px-4 rounded" type="text" v-model="id"/>
        <button class="bg-white text-gray-700 font-bold py-2 px-4 rounded" @click="visitAquarium">Visit Aquarium</button>
        <p v-if="errormessage" class="text-red-200 mt-2">{{ errormessage }}</p>
    </div>
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
        .select('id')
        .eq('id', id.value.trim())
        .maybeSingle();

    if (error) {
        errormessage.value = 'Unable to check that ID right now.';
        return;
    }

    if (!data) {
        errormessage.value = 'No aquarium was found for that ID.';
        return;
    }

    await router.push(`/Aquarium/${id.value.trim()}`);
}

</script>

<style scoped>

</style>