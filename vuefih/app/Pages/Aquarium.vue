<template>
    <div>
        <img src="https://media.istockphoto.com/id/500739571/photo/aquascaping-of-the-planted-aquarium.jpg?s=612x612&w=0&k=20&c=YCij36GhbrEIid6LmlNT7ak3WBgYTMpGF6bI-6cpjR4=" alt="Aquarium" />
        <button @click="toggleVisitFunction">Visit Other Aquariums!</button>
        <VisitFunction v-show="showVisitFunction"/>
    </div>
</template>

<script setup>
import VisitFunction from '~/Components/visitFunction.vue';
import { ref } from 'vue';

const showVisitFunction = ref(false);

function toggleVisitFunction() {
    showVisitFunction.value = !showVisitFunction.value;
}
</script>

<style scoped>

</style>