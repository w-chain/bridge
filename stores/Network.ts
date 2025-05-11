import { defineStore } from 'pinia'
import { useVueDapp } from '@vue-dapp/core'
import { getNetworkChainId } from '~~/shared/utils/network';

export const useNetworkStore = defineStore('Network', () => {
  const { chainId, connector } = useVueDapp();
 
  const isTestnet = useRuntimeConfig().public.network === 'testnet';
  const allowedChains = isTestnet ? [11155111, 71117] : [1, 171717];
  const isAllowedChain = computed(() => chainId.value ? allowedChains.includes(chainId.value) : true);

  async function switchNetwork(network: Networks) {
    if (!connector.value || !connector.value.switchChain) return;
    const chainId = getNetworkChainId(network, isTestnet);
    await connector.value.switchChain(chainId);
  }

  return { isTestnet, isAllowedChain, chainId, allowedChains, switchNetwork  }
})
