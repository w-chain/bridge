import { defineStore } from 'pinia'
import { useNetworkStore } from './Network';
import { getTokenBySymbol } from '~~/shared/registry/tokens';
import { useBridgeContractStore } from './BridgeContract';

export const useBridgeStatesStore = defineStore('BridgeStates', () => {
  const networkStore = useNetworkStore();
  const bridgeContractStore = useBridgeContractStore();

  const from = ref<Networks>(Networks.ETH);
  const fromChainId = ref<ChainId>();
  const fromToken = ref<TokenSymbols>();
  const fromAmount = ref<number>();
  const to = ref<Networks>(Networks.WCHAIN);
  const toChainId = ref<ChainId>();
  const toToken = ref<TokenSymbols>();
  const toAmount = ref<number>()
  const fee = ref(0); // in Source chain Native Token
  const handlerAllowance = ref(BigInt(0));

  function init(isTestnet: boolean) {
    fromChainId.value = getNetworkChainId(from.value, isTestnet);
    toChainId.value = getNetworkChainId(to.value, isTestnet);
    if (fromChainId.value !== networkStore.chainId) {
      networkStore.switchNetworkWithChainId(fromChainId.value);
    }
  }

  function swapNetworks() {
    const oldFrom = from.value;
    const oldTo = to.value;
    from.value = oldTo;
    to.value = oldFrom;
  }

  function resetTokens() {
    fromToken.value = undefined;
    toToken.value = undefined;
  }

  async function fetchHandlerAllowance() {
    if (!fromToken.value || !fromChainId.value) return;
    const token = getTokenBySymbol(fromChainId.value, fromToken.value);
    if (!token) return;
    const allowance = await bridgeContractStore.getHandlerAllowance(token);
    handlerAllowance.value = BigInt(allowance ?? 0);
  }

  const selectedToken = computed(() => {
    if (!fromToken.value || !fromChainId.value) return undefined;
    return getTokenBySymbol(fromChainId.value, fromToken.value);
  })

  watch([from, to], ([newFrom, newTo]) => {
    if (newFrom) {
      fromChainId.value = getNetworkChainId(newFrom, networkStore.isTestnet);
      networkStore.switchNetworkWithChainId(fromChainId.value);
    }
    if (newTo) {
      toChainId.value = getNetworkChainId(newTo, networkStore.isTestnet);
    }
    resetTokens();
  })

  watch(fromToken, (newToken) => {
    if (newToken) {
      if (from.value === Networks.BSC || to.value === Networks.BSC) {
        toToken.value = getBSCTargetToken(newToken);
      } else {
        toToken.value = newToken;
      }
      fetchHandlerAllowance();
    }
  });

  return {
    from,
    fromChainId,
    fromToken,
    fromAmount,
    to,
    toChainId,
    toToken,
    toAmount,
    fee,
    handlerAllowance,
    selectedToken,
    resetTokens,
    fetchHandlerAllowance,
    swapNetworks,
    init
  }
})
