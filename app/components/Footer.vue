<!-- eslint-disable vue/multi-word-component-names -->
<script lang="ts" setup>
const socials = [{
  icon: 'i-simple-icons-x',
  href: 'https://x.com/WChainNetwork' 
}, {
  icon: 'i-simple-icons-telegram',
  href: 'https://t.me/official_wchain'
}, {
  icon: 'i-simple-icons-discord',
  href: 'https://discord.gg/hr35kDxtfT'
}, {
  icon: 'i-simple-icons-linkedin',
  href: 'https://www.linkedin.com/company/wchain',
}, {
  icon: 'i-simple-icons-coinmarketcap',
  href: 'https://coinmarketcap.com/currencies/w-chain'
}]
</script>

<template>
  <div class="absolute bottom-1 left-1 w-full py-4">
    <div class="flex flex-col items-center justify-center gap-4 max-w-lg mx-auto">
      <div class="font-semibold">Powered by <NuxtLink class="underline" to="https://w-chain.com" external target="_blank">W Chain</NuxtLink></div>
      <div class="flex justify-center gap-4">
        <UButton 
          v-for="item in socials"
          :key="item.href"
          :icon="item.icon"
          :to="item.href"
          variant="soft"
        />
      </div>
      <div class="text-xs">
        {{ new Date().getFullYear() }} © All Rights Reserved. 
      </div>
    </div>
  </div>
</template>