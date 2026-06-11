<template>
  <div>
    <NuxtLink to="FishDescription">Next</NuxtLink>
    <button id="Save" @click="save">Save</button>
    <div class="controls">
      <div id="colorPicker"></div>
      
      <div class="tool-settings">
        <label for="brushSize">Brush Size: {{ brushSize }}px</label>
        <input 
          id="brushSize" 
          type="range" 
          min="1" 
          max="50" 
          v-model.number="brushSize" 
        />

        <button @click="isEraser = !isEraser">
          {{ isEraser ? 'Switch to Brush' : 'Use Eraser' }}
        </button>
      </div>
    </div>

    <DrawingCanvas 
      :currentColor="currentColor" 
      :brushSize="brushSize"
      :isEraser="isEraser"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import iro from "@jaames/iro";
import DrawingCanvas from "@/components/DrawingCanvas.vue";

const currentColor = ref("#ff0000");
const brushSize = ref(5); 
const isEraser = ref(false);

onMounted(() => {
  const colorPicker = new iro.ColorPicker("#colorPicker", {
    width: 200,
    color: "#ff0000",
    borderWidth: 1,
    borderColor: "#fff",
  });

  colorPicker.on("color:change", (color) => {
    currentColor.value = color.hexString;
    isEraser.value = false; 
  })
})


const save = async () => {
  try {
    const canvas = document.querySelector('.drawing-canvas')
    if (!canvas) throw new Error('Canvas element not found')

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
    if (!blob) throw new Error('Failed to export canvas blob')

    const file = new File([blob], `pixel_art_${Date.now()}.png`, { type: 'image/png' })
    const form = new FormData()
    form.append('file', file)

    const res = await fetch('/api/upload', { method: 'POST', body: form })
    const json = await res.json()
    if (!res.ok) throw new Error(json?.statusMessage || JSON.stringify(json))
    console.log('Upload result:', json)
  } catch (err) {
    console.error('Save failed:', err)
  }
}
</script>

<style scoped>
.controls {
  margin-bottom: 20px;
}
.tool-settings {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 15px;
}
</style>