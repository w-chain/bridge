// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      network: process.env.NUXT_PUBLIC_NETWORK || 'testnet'
    },
    alchemyApiKey: process.env.ALCHEMY_API_KEY || '',
  },

  routeRules: {
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