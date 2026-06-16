import tailwindcss from "@tailwindcss/vite";
import viteTsconfigPaths from 'vite-tsconfig-paths'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,
  css: [
    new URL('./assets/css/tailwind.css', import.meta.url).pathname
  ],
  vite: {
    plugins: [
      viteTsconfigPaths(),
      tailwindcss(),
    ]
  },
  modules: [
    '@nuxtjs/supabase',
    '@pinia/nuxt'
  ],
  supabase: {
    redirect: false,
  },
  runtimeConfig: {
    public: {
      supabase: 
      {
        key:"sb_publishable_G5zffL3bGX59EzIERu590w_RQxjqzgT",
        url:"https://zyjawkkqocasuwvuaxxv.supabase.co",
        redirect:false
      }
    },
  },
})