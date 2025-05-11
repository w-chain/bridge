// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  nitro: {
    awsAmplify: {
        imageSettings: {
            dangerouslyAllowSVG: true
        }
    },
    preset: 'awsAmplify',
    output: {
      dir: `../../dist/app`,
    },
  },

  runtimeConfig: {
    public: {
      network: 'testnet'
    }
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