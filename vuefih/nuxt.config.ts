// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/supabase'],
  runtimeConfig: {
    public: {
      supabase: {key:"sb_publishable_G5zffL3bGX59EzIERu590w_RQxjqzgT",
        url:"https://zyjawkkqocasuwvuaxxv.supabase.co"
      }
    },
  },
})

