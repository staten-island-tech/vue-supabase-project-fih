const { createClient } = require('@supabase/supabase-js')
const supabase = createClient('https://zyjawkkqocasuwvuaxxv.supabase.co', 'sb_publishable_G5zffL3bGX59EzIERu590w_RQxjqzgT')
;(async () => {
  try {
    const { data, error } = await supabase.from('aquarium').select('id,user_id,name,description,public_url,created_at').limit(1)
    console.log('select result', { data, error })
    const { data: cols, error: colsErr } = await supabase.from('information_schema.columns').select('table_name,column_name,data_type').eq('table_name','aquarium')
    console.log('columns result', { cols, colsErr })
  } catch (err) {
    console.error('script error', err)
  }
})()
