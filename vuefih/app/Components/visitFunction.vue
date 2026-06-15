<template>
    <div class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        <h1>Give Me Their ID!(Can be seen in the URL)</h1>
        <input class = "bg-white text-gray-700 font-bold py-2 px-4 rounded" type="text" v-model="id"/>
        <button class="bg-white text-gray-700 font-bold py-2 px-4 rounded" @click="visitAquarium">Visit Aquarium</button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const id = ref('');
let errormessage = ref('');
const router = useRouter();

async function visitAquarium() {
    if (!id.value) {
        errormessage.value = 'Please enter a valid ID.';
        return;
    }
    else {
        await router.push(`/Aquarium/${id.value}`);
    }
}

</script>

<style scoped>

</style>