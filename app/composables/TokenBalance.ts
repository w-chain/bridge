import { useVueDapp } from '@vue-dapp/core'
import { BrowserProvider, formatUnits } from 'ethers';
import type Token from '~~/shared/objects/token';
import { useBridgeContractStore, useNetworkStore } from '~~/stores';


export const useTokenBalance = (tokenRef: Ref<Token>) => {
  const { isConnected, wallet, chainId, watchWalletChanged } = useVueDapp();
  const bridgeContract = useBridgeContractStore();
  const { switchNetworkWithChainId } = useNetworkStore();
  const toast = useToast();
  
  // Use computed for the state keys based on the ref value
  const stateKey = computed(() => `tokenBalance-${tokenRef.value.address}-${tokenRef.value.chainId}`);
  const bigIntStateKey = computed(() => `tokenBalanceBigInt-${tokenRef.value.address}-${tokenRef.value.chainId}`);
  const lastUpdatedKey = computed(() => `tokenBalanceLastUpdated-${tokenRef.value.address}-${tokenRef.value.chainId}`);
  const loadingKey = computed(() => `tokenBalanceIsLoading-${tokenRef.value.address}-${tokenRef.value.chainId}`);

  const balance = useState<number>(stateKey.value);
  const balanceBigInt = useState<bigint>(bigIntStateKey.value);
  const lastUpdated = useState<number>(lastUpdatedKey.value);
  const isLoading = useState<boolean>(loadingKey.value);
  
  const CACHE_TIME = 1000 * 60;

  async function updateBalance() {
    if (!isConnected.value || !wallet.provider || !wallet.address) return;
    if (lastUpdated.value + CACHE_TIME > Date.now()) return;
    if (isLoading.value) return;
    if (chainId.value !== tokenRef.value.chainId) {
      toast.add({
        title: 'Wrong Source Network',
        description: 'Please switch to the correct network',
        color: 'error'
      });
      return;
    }

    isLoading.value = true;

    try {
      if (wallet.chainId !== tokenRef.value.chainId) {
        await switchNetworkWithChainId(tokenRef.value.chainId)
      }
      const provider = new BrowserProvider(wallet.provider);
      const res = await tokenRef.value.balanceOf(wallet.address, provider);
      balanceBigInt.value = res;
      balance.value = Number(formatUnits(res, tokenRef.value.decimals));
      lastUpdated.value = Date.now();
      if (BigInt(res) > BigInt(0)) {
        bridgeContract.getHandlerAllowance(tokenRef.value);
      }
    } catch (error) {
      console.error(error);
      toast.add({
        title: 'Token Balance Error',
        description: 'There is probably a problem with your RPC or connection',
        color: 'error'
      });
    } finally {
      isLoading.value = false;
    }
  }

  const cachedBalance = computed(() => {
    if (lastUpdated.value + CACHE_TIME > Date.now()) {
      return balance.value;
    } else {
      updateBalance();
      return balance.value;
    }
  });

  watchWalletChanged(() => {
    updateBalance();
  });

  // Watch the entire token ref
  watch(tokenRef, () => {
    lastUpdated.value = 0;
    updateBalance();
  }, { immediate: true });

  return {
    balance: cachedBalance,
    balanceBigInt,
    isLoading,
    updateBalance
  }
}
