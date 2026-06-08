<template>
    <div>
        <h1>Give Me Their ID!(Can be seen in the URL)</h1>
        <input type="text" v-model="id"/>
        <button @click="visitAquarium">Visit Aquarium</button>
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
        await router.push(`/aquarium/${id.value}`);
    }
}

</script>

<style scoped>

</style>