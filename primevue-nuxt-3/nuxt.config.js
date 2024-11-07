import Aura from '@primevue/themes/aura'

export default defineNuxtConfig({
  modules: ['@primevue/nuxt-module', '@nuxtjs/tailwindcss'],

  primevue: {
    autoImport: true,
    options: {
      theme: {
        preset: Aura
      }
    }
  },

  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: true
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Playwrite+GB+S:ital,wght@0,100..400;1,100..400&display=swap'
        }
      ]
    }
  },

  css: [
    'primeicons/primeicons.css',
    '~/assets/scss/index.scss',
    '~/assets/scss/tailwind.scss'
  ],

  devtools: { enabled: false },
  compatibilityDate: '2024-10-29'
})
