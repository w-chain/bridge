import { defineStore } from 'pinia'
import { useVueDapp } from '@vue-dapp/core'
import { getNetworkChainId } from '~~/shared/utils/network';

export const useNetworkStore = defineStore('Network', () => {
  const { chainId, connector, wallet } = useVueDapp();

  const currentAccount = computed(() => wallet.address);
 
  const isTestnet = useRuntimeConfig().public.network === 'testnet';
  const allowedChains = isTestnet ? [ChainId.SEPOLIA, ChainId.BSC_TESTNET, ChainId.WCHAIN_TESTNET] : [ChainId.ETH, ChainId.BSC, ChainId.WCHAIN];
  const isAllowedChain = computed(() => chainId.value ? allowedChains.includes(chainId.value) : true);

  async function switchNetworkWithChainId(chainId: ChainId) {
    await until(connector).toBeTruthy();
    if (!connector.value || !connector.value.switchChain) {
      console.log('connector not ready');
      return;
    }
    await connector.value.switchChain(chainId); 
  }

  async function switchNetwork(network: Networks) {
    const chainId = getNetworkChainId(network, isTestnet);
    return switchNetworkWithChainId(chainId);
  }

  return { isTestnet, isAllowedChain, chainId, allowedChains, currentAccount, switchNetwork, switchNetworkWithChainId  }
})
