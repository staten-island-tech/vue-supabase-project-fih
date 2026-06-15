<template>
  <div class="page">
    <header class="toolbar">
      <NuxtLink to="/FishDescription">
        Next
      </NuxtLink>

      <button id="Save" @click="save">
        Save
      </button>
    </header>

    <section class="controls-card">
      <div id="colorPicker"></div>

      <div class="tool-settings">
        <div>
          Brush Size:
          <strong>{{ brushSize }}</strong>px
        </div>

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
    </section>

    <section class="canvas-card">
      <DrawingCanvas
        :currentColor="currentColor"
        :brushSize="brushSize"
        :isEraser="isEraser"
      />
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useSupabaseClient, useSupabaseUser, useRouter } from "#imports"
import iro from "@jaames/iro"

const currentColor = ref("#ff0000")
const brushSize = ref(5)
const isEraser = ref(false)

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

onMounted(() => {
  const picker = new iro.ColorPicker("#colorPicker", {
    width: 200,
    color: "#ff0000",
    borderWidth: 1,
    borderColor: "#fff"
  })

  picker.on("color:change", (color) => {
    currentColor.value = color.hexString
    isEraser.value = false
  })
})

const getUserId = async () => {
  const direct = user.value?.id
  if (direct) return direct

  const { data } = await supabase.auth.getUser()
  if (data?.user?.id) return data.user.id

  const { data: session } = await supabase.auth.getSession()
  return session?.session?.user?.id || null
}

const save = async () => {
  try {
    const userId = await getUserId()
    if (!userId) throw new Error("Not signed in")

    const canvas = document.querySelector(".drawing-canvas")
    if (!canvas) throw new Error("Canvas not found")

    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/png")
    )

    if (!blob) throw new Error("Failed to create image")

    const filename = `pixel_art_${Date.now()}.png`
    const path = `Fish Drawings/${userId}/${filename}`

    const file = new File([blob], filename, { type: "image/png" })

    const { error } = await supabase.storage
      .from("Fish")
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type
      })

    if (error) throw error

    const { data } = supabase.storage
      .from("Fish")
      .getPublicUrl(path)

    await router.push({
      path: "/FishDescription",
      query: { filePath: path }
    })
  } catch (err) {
    console.error("Save failed:", err)
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 20px;
  background: radial-gradient(circle at top, #0f172a, #020617);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}

.toolbar {
  width: 100%;
  max-width: 900px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.toolbar a {
  color: white;
  text-decoration: none;
  font-weight: 600;
  padding: 8px 14px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.12);
}

.toolbar a:hover {
  background: rgba(255, 255, 255, 0.2);
}

#Save {
  background: #06b6d4;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
}

.controls-card {
  width: 100%;
  max-width: 900px;
  display: flex;
  gap: 24px;
  padding: 18px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  align-items: center;
}

#colorPicker {
  width: 220px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tool-settings {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  color: white;
  font-weight: 500;
}

.tool-settings strong {
  color: #06b6d4;
}

input[type="range"] {
  width: 100%;
  cursor: pointer;
}

.tool-settings button {
  align-self: flex-start;
  padding: 8px 12px;
  border-radius: 10px;
  border: none;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  font-weight: 600;
  cursor: pointer;
}

.tool-settings button:hover {
  background: rgba(255, 255, 255, 0.25);
}

.canvas-card {
  width: 100%;
  max-width: 900px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>