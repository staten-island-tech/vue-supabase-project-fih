<template>
  <div class="page">
    <header class="toolbar">
      <NuxtLink to="/FishDescription">
        Next
      </NuxtLink>

      <button
        id="Save"
        @click="save"
      >
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

        <button
          @click="isEraser = !isEraser"
        >
          {{
            isEraser
              ? 'Switch to Brush'
              : 'Use Eraser'
          }}
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
import {
  useSupabaseClient,
  useSupabaseUser,
  useRouter
} from "#imports"

import iro from "@jaames/iro"
import DrawingCanvas from "@/components/DrawingCanvas.vue"

const currentColor = ref("#ff0000")
const brushSize = ref(5)
const isEraser = ref(false)

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

onMounted(() => {
  const colorPicker =
    new iro.ColorPicker(
      "#colorPicker",
      {
        width: 200,
        color: "#ff0000",
        borderWidth: 1,
        borderColor: "#fff",
      }
    )

  colorPicker.on(
    "color:change",
    (color) => {
      currentColor.value =
        color.hexString

      isEraser.value = false
    }
  )
})

const save = async () => {
  try {
    let userId = user.value?.id

    if (!userId) {
      const {
        data: authData,
        error: authError,
      } =
        await supabase.auth.getUser()

      if (authError) {
        console.warn(authError)
      }

      userId =
        authData?.user?.id
    }

    if (!userId) {
      const {
        data: sessionData,
        error: sessionError,
      } =
        await supabase.auth.getSession()

      if (sessionError) {
        console.warn(sessionError)
      }

      userId =
        sessionData?.session?.user?.id
    }

    if (!userId) {
      throw new Error(
        "User not signed in"
      )
    }

    const canvas =
      document.querySelector(
        ".drawing-canvas"
      )

    if (!canvas) {
      throw new Error(
        "Canvas not found"
      )
    }

    const blob =
      await new Promise(
        (resolve) =>
          canvas.toBlob(
            resolve,
            "image/png"
          )
      )

    if (!blob) {
      throw new Error(
        "Blob creation failed"
      )
    }

    const filename =
      `pixel_art_${Date.now()}.png`

    const path =
      `Fish Drawings/${userId}/${filename}`

    const file =
      new File(
        [blob],
        filename,
        {
          type:
            "image/png",
        }
      )

    const { data, error } =
      await supabase.storage
        .from("Fish")
        .upload(
          path,
          file,
          {
            cacheControl:
              "3600",
            upsert: false,
            contentType:
              file.type,
          }
        )

    if (error) {
      throw error
    }

    const {
      data: urlData,
    } =
      supabase.storage
        .from("Fish")
        .getPublicUrl(
          path
        )

    const publicUrl =
      urlData?.publicUrl ||
      urlData?.publicURL ||
      null

    localStorage.setItem(
      `fish-image-path-${userId}`,
      path
    )

    if (publicUrl) {
      localStorage.setItem(
        `fish-image-url-${userId}`,
        publicUrl
      )
    }

    console.log(
      "Upload succeeded",
      data
    )

    await router.push({
      path: "/FishDescription",
      query: {
        filePath:
          encodeURIComponent(
            path
          ),
      },
    })
  } catch (err) {
    console.error(
      "Save failed:",
      err
    )
  }
}
</script>

<style scoped>

</style>