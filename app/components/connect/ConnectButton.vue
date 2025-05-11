<script lang="ts" setup>
import { shortenAddress, useVueDapp, } from '@vue-dapp/core';

const { isConnected, wallet, chainId } = useVueDapp();
const { onOpen, openModal } = useConnectButtonLogic();

const networkImage = computed(() => chainId.value ? useNetworkLogo(chainId.value) : '');

const handleClick = () => {
  if (isConnected.value) {
    openModal();
  } else {
    onOpen();
  }
};

</script>

<template>
  <UButton 
    class="cursor-pointer"
    :icon="isConnected? undefined : 'i-lucide-wallet'"
    :avatar="isConnected? { src: networkImage } : undefined "
    @click="handleClick"
  >
    {{ isConnected? shortenAddress(wallet.address ?? '') : 'Connect Wallet' }}
  </UButton>
</template>