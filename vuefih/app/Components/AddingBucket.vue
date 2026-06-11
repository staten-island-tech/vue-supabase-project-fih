<template>
  <div>
    <p class="uploadFile"></p>
  </div>
</template>

<script context="module">
import { supabase } from '@/utils/supabaseClient.js'

/**
 * @param {File} file
 * @param {string|null} [path] 
 * @param {string} [folder] 
 * @returns {Promise<{ data: any, publicUrl: string }>}
 */
export async function uploadFile(file, path = null, folder = 'Fish Drawings') {
  if (!file) throw new Error('uploadFile: file is required')

  folder = (folder || 'Fish Drawings').replace(/^\/+|\/+$/g, '')

  const filenameBase = path || `uploads/${Date.now()}_${file.name}`
  const filename = `${folder}/${filenameBase}`

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

  return { data, publicUrl: publicURL }
}

/**
 * @param {string} [path='Fish Drawings'] 
 * @param {object} [options] 
 * @returns {Promise<any[]>}
 */
export async function listFiles(path = 'Fish Drawings', options = { limit: 100 }) {
  const { data, error } = await supabase.storage.from('Fish').list(path, options)
  if (error) throw error
  return data
}
</script>

<style lang="scss" scoped>
</style>
