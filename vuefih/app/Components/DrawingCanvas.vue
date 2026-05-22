<template>
  <canvas ref="canvasRef" class="drawing-canvas"></canvas>
</template>

<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
  currentColor: String,
  brushSize: {
    type: Number,
    default: 5
  },
  isEraser: {
    type: Boolean,
    default: false
  }
});

const canvasRef = ref(null);
let ctx = null;
let isDrawing = false;

function resizeCanvas() {
  const canvas = canvasRef.value;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function getMousePos(e) {
  const rect = canvasRef.value.getBoundingClientRect();
  return { 
    x: e.clientX - rect.left, 
    y: e.clientY - rect.top 
  };
}

function startDrawing(e) {
  isDrawing = true;
  const pos = getMousePos(e);
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
}

function draw(e) {
  if (!isDrawing) return;
  const pos = getMousePos(e);
  
  ctx.lineWidth = props.brushSize;
  ctx.lineCap = "round";
  
  if (props.isEraser) {
    ctx.strokeStyle = "white";
  } else {
    ctx.strokeStyle = props.currentColor;
  }
  
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
}

function stopDrawing() {
  isDrawing = false;
  ctx.closePath();
}

onMounted(() => {
  const canvas = canvasRef.value;
  ctx = canvas.getContext("2d");
  
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  
  canvas.addEventListener("pointerdown", startDrawing);
  canvas.addEventListener("pointermove", draw);
  canvas.addEventListener("pointerup", stopDrawing);
  canvas.addEventListener("pointerleave", stopDrawing);
});
</script>

<style scoped>
.drawing-canvas {
  width: auto;
  height: auto;
  background: white;
  display: block;
}
</style>