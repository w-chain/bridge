<script lang="ts" setup>
import { BrowserWalletConnector, useVueDapp, useAutoConnect } from '@vue-dapp/core';
import { WalletConnectConnector } from '@vue-dapp/walletconnect';

useAutoConnect();
const { addConnectors } = useVueDapp();
if (import.meta.client) {
  addConnectors([ 
    new BrowserWalletConnector(), 
    new WalletConnectConnector({
			projectId: 'e88b108675fcd6ac261333158b4e516e',
			chains: [1, 11155111, 56, 97, 171717, 71117],
      rpcMap: {
        171717: ' https://rpc.w-chain.com',
        71117: 'https://rpc-testnet.w-chain.com'
      },
			showQrModal: true,
			qrModalOptions: {
				themeMode: 'dark',
				themeVariables: undefined,
				desktopWallets: undefined,
				walletImages: undefined,
				mobileWallets: undefined,
				enableExplorer: true,
				privacyPolicyUrl: undefined,
				termsOfServiceUrl: undefined,
			},
		}) 
  ]);
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
    <main class="min-h-screen relative flex flex-col items-center px-2 pt-8 gap-4">
      <TopNavBar />
      <NuxtPage />
      <Footer />
    </main>
  </UApp>
</template>