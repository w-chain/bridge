export default defineAppConfig({
  // https://ui.nuxt.com/getting-started/theme#design-system
  ui: {
    colors: {
      primary: 'royal-blue',
      neutral: 'neutral',
    },
    icons: {
      loading: 'i-lucide-loader-circle'
    },
    button: {
      slots: {
        base: 'rounded-xl cursor-pointer',
      }
    },
    skeleton: {
      base: 'dark:bg-neutral-400'
    }
  }
})
