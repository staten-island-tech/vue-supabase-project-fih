<template>
  <div>
    <p class="uploadFile"></p>
  </div>
</template>

<script context="module">
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://zyjawkkqocasuwvuaxxv.supabase.co',
  'sb_publishable_G5zffL3bGX59EzIERu590w_RQxjqzgT'
)

/**
 * @param {File} file 
 * @param {string} [path] 
 * @returns {Promise<{ data: any, publicUrl: string }>}
 * @throws 
 */
export async function uploadFile(file, path = null) {
  if (!file) throw new Error('uploadFile: file is required')

  const filename = path || `uploads/${Date.now()}_${file.name}`
  const options = {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || 'application/octet-stream'
  }

  const { data, error } = await supabase.storage.from('Fish').upload(filename, file, options)

  if (error) {
    throw error
  }

  const { publicURL, error: urlError } = supabase.storage.from('Fish').getPublicUrl(data.path || filename)
  if (urlError) {
    throw urlError
  }

  return { data, publicUrl: publicURL || publicURL }
}
</script>

<script setup>

</script>

<style lang="scss" scoped>
</style>
