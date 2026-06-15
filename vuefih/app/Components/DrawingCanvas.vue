<template>
  <canvas ref="canvasRef" class="drawing-canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

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
})

const canvasRef = ref(null)
let ctx = null
let isDrawing = false

function resizeCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return

  const oldImage = ctx ? ctx.getImageData(0, 0, canvas.width, canvas.height) : null
  const rect = canvas.getBoundingClientRect()
  const width = Math.max(1, Math.floor(rect.width))
  const height = Math.max(1, Math.floor(rect.height))

  canvas.width = width
  canvas.height = height

  if (!ctx) {
    ctx = canvas.getContext('2d')
  }

  if (!ctx) return

  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  if (oldImage) {
    ctx.putImageData(oldImage, 0, 0)
  }
}

function getMousePos(e) {
  const canvas = canvasRef.value
  if (!canvas) return { x: 0, y: 0 }

  const rect = canvas.getBoundingClientRect()
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  }
}

function startDrawing(e) {
  if (!ctx) return
  isDrawing = true
  const pos = getMousePos(e)
  ctx.beginPath()
  ctx.moveTo(pos.x, pos.y)
}

function draw(e) {
  if (!isDrawing || !ctx) return
  const pos = getMousePos(e)

  ctx.lineWidth = props.brushSize
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.strokeStyle = props.isEraser ? 'white' : props.currentColor

  ctx.lineTo(pos.x, pos.y)
  ctx.stroke()
}

function stopDrawing() {
  if (!ctx) return
  isDrawing = false
  ctx.closePath()
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return

  ctx = canvas.getContext('2d')
  resizeCanvas()

  window.addEventListener('resize', resizeCanvas)
  canvas.addEventListener('pointerdown', startDrawing)
  canvas.addEventListener('pointermove', draw)
  canvas.addEventListener('pointerup', stopDrawing)
  canvas.addEventListener('pointercancel', stopDrawing)
  canvas.addEventListener('pointerleave', stopDrawing)
})

onBeforeUnmount(() => {
  const canvas = canvasRef.value
  window.removeEventListener('resize', resizeCanvas)

  if (!canvas) return
  canvas.removeEventListener('pointerdown', startDrawing)
  canvas.removeEventListener('pointermove', draw)
  canvas.removeEventListener('pointerup', stopDrawing)
  canvas.removeEventListener('pointercancel', stopDrawing)
  canvas.removeEventListener('pointerleave', stopDrawing)
})
</script>

<style scoped>
.drawing-canvas {
  width: 100%;
  height: calc(100vh - 64px);
  min-height: 420px;
  background: white;
  display: block;
  touch-action: none;
  cursor: crosshair;
}
</style>
