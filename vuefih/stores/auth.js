// ...new file...
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    error: null
  }),
  actions: {
    async signUp(email, password, redirectTo) {
      this.loading = true
      this.error = null
      try {
        const supabase = useSupabaseClient()
        const { data, error } = await supabase.auth.signUp(
          { email, password },
          redirectTo ? { emailRedirectTo: redirectTo } : {}
        )
        if (error) {
          this.error = error.message
          return { success: false, error }
        }
        this.user = data?.user ?? null
        return { success: true, data }
      } catch (err) {
        this.error = err?.message ?? String(err)
        return { success: false, error: err }
      } finally {
        this.loading = false
      }
    },

    async signIn(email, password) {
      this.loading = true
      this.error = null
      try {
        const supabase = useSupabaseClient()
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
          this.error = error.message
          return { success: false, error }
        }
        this.user = data?.user ?? null
        return { success: true, data }
      } catch (err) {
        this.error = err?.message ?? String(err)
        return { success: false, error: err }
      } finally {
        this.loading = false
      }
    },

    async signOut() {
      this.loading = true
      this.error = null
      try {
        const supabase = useSupabaseClient()
        const { error } = await supabase.auth.signOut()
        if (error) {
          this.error = error.message
          return { success: false, error }
        }
        this.user = null
        return { success: true }
      } finally {
        this.loading = false
      }
    }
  }
})  