<template>
    <div>

    </div>
</template>

<script setup>
import { createClient } from '@supabase/supabase-js'
const supabase = createClient('your_project_url', 'your_supabase_api_key')
async function uploadFile(file) {
  const { data, error } = await supabase.storage.from('bucket_name').upload('file_path', file)
  if (error) {
  } else {
  }
}
</script>

<style lang="scss" scoped>

</style>