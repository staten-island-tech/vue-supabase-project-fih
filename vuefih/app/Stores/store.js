import { defineStore } from 'pinia'
import { navigateTo, useSupabaseClient } from '#imports'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    /** @type {import('@supabase/supabase-js').User | null} */
    user: null,
    loading: false,
    error: null
  }),
  actions: {
    async signUp(email, password, redirectTo) {
      this.loading = true
      this.error = null
      try {
        const supabase = useSupabaseClient() // Nuxt composable injected by @nuxtjs/supabase
        const { data, error } = await supabase.auth.signUp(
          { email, password },
          redirectTo ? { emailRedirectTo: redirectTo } : {}
        )
        if (data?.user) {
          const userId = data.user.id
          console.log('user uuid', userId)
        }
        if (error) {
          this.error = error.message
          return { success: false, error }
        }
        this.user = data?.user ?? null
        return { success: true, data }
      } catch (err) {
        this.error = err?.message || String(err)
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
        if (data?.user) {
          const userId = data.user.id
          console.log('user uuid', userId)
        }
        if (error) {
          this.error = error.message
          return { success: false, error }
        }
        this.user = data?.user ?? null
        return { success: true, data }
      } catch (err) {
        this.error = err?.message || String(err)
        return { success: false, error: err }
      } finally {
        this.loading = false
      }
    },

    async signInWithMagicLink(email, redirectTo) {
      this.loading = true
      this.error = null
      try {
        const supabase = useSupabaseClient()
        const { data, error } = await supabase.auth.signInWithOtp({
          email,
          options: redirectTo ? { emailRedirectTo: redirectTo } : {}
        })
        if (error) {
          this.error = error.message
          return { success: false, error }
        }
        if (data?.user) {
          const userId = data.user.id
          console.log('user uuid', userId)
        }
        return { success: true }
      } catch (err) {
        this.error = err?.message || String(err)
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
        navigateTo('/login')
        return { success: true }
      } finally {
        this.loading = false
      }
    },

    // new: set user directly
    setUser(user) {
      this.user = user ?? null
    },

    // new: ensure current auth user is loaded into the store
    async fetchUser() {
      this.loading = true
      this.error = null
      try {
        const supabase = useSupabaseClient()
        const { data, error } = await supabase.auth.getUser()
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

    // new: fetch profile row from 'profiles' table (expects profiles.id = auth.user.id)
    async fetchProfile() {
      this.loading = true
      this.error = null
      try {
        const supabase = useSupabaseClient()
        const userId = this.user?.id
        if (!userId) {
          return { success: false, error: { message: 'No authenticated user' } }
        }
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()
        if (error) {
          this.error = error.message
          return { success: false, error }
        }
        return { success: true, data }
      } catch (err) {
        this.error = err?.message ?? String(err)
        return { success: false, error: err }
      } finally {
        this.loading = false
      }
    },
  }
})