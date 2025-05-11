<script lang="ts" setup>
import { BrowserWalletConnector, useVueDapp, useAutoConnect } from '@vue-dapp/core';

useAutoConnect();
const { addConnectors } = useVueDapp();
if (import.meta.client) {
  addConnectors([ new BrowserWalletConnector() ]);
}

useHead({
  htmlAttrs: {
    lang: 'en',
  },
  meta: [
    { property: 'og:title', content: `W Bridge` },
    { property: 'og:site_name', content: `W Bridge` },
    { property: 'og:type', content: `website` },
    { name: 'description', content: 'W Bridge connecting W Chain to popular EVM Networks, enabling seamless funds movements between chains.' },
    { property: 'og:description', content: 'W Bridge connecting W Chain to popular EVM Networks, enabling seamless funds movements between chains.' },
    { property: 'og:url', content: 'https://bridge.w-chain.com/' },
    { name: 'robots', content: 'follow, index' },
    { name: 'keywords', content: 'Bridge, DeFi, Staking, Lending, Capital' },
  ],
  title: `W Bridge`,
})

</script>

<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>