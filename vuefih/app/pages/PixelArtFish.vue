<template>
  <div>
    <NuxtLink to="FishDescription">Next</NuxtLink>
    <div id="colorPicker"></div>
    <DrawingCanvas :currentColor="currentColor"/>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import iro from "@jaames/iro";

import DrawingCanvas from "@/Components/DrawingCanvas.vue";

const currentColor = ref("#ff0000");

onMounted(() => {
  const colorPicker = new iro.ColorPicker("#colorPicker", {
    width: 200,
    color: "#ff0000",
    borderWidth: 1,
    borderColor: "#fff",
  });

  colorPicker.on("color:change", (color) => {
    currentColor.value = color.hexString;
  });
});
</script>