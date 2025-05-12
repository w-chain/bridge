// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      network: 'testnet'
    }
  },

  routeRules: {
    '/': { prerender: true },
    '/migration': { redirect: { to: 'https://legacy-brige.w-chain.com/migration', statusCode: 301 } }
  },

  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@pinia/nuxt',
    '@vue-dapp/nuxt',
    '@vueuse/nuxt'
  ],

  css: ['~/assets/css/main.css'],

  future: {
    compatibilityVersion: 4
  },

  compatibilityDate: '2024-11-27'
})