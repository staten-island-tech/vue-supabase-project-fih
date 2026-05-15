import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL= "https://zyjawkkqocasuwvuaxxv.supabase.co"
const SUPABASE_KEY= "sb_publishable_G5zffL3bGX59EzIERu590w_RQxjqzgT"

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
import { SessionContextProvider } from '@supabase/auth-helpers-react'

<SessionContextProvider supabaseClient={supabase}>
  <App />
</SessionContextProvider>