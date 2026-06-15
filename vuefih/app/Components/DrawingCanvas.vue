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
  if (!canvas) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  if (!ctx) {
    ctx = canvas.getContext("2d");
  }

  if (!ctx) return;

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function getMousePos(e) {
  const canvas = canvasRef.value;
  if (!canvas) return { x: 0, y: 0 };

  const rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

function startDrawing(e) {
  if (!ctx) return;
  isDrawing = true;
  const pos = getMousePos(e);
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
}

function draw(e) {
  if (!isDrawing || !ctx) return;
  const pos = getMousePos(e);

  ctx.lineWidth = props.brushSize;
  ctx.lineCap = "round";

  ctx.strokeStyle = props.isEraser ? "white" : props.currentColor;

  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
}

function stopDrawing() {
  if (!ctx) return;
  isDrawing = false;
  ctx.closePath();
}

onMounted(() => {
  const canvas = canvasRef.value;
  if (!canvas) return;

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