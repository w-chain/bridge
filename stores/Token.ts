import { defineStore } from 'pinia'
import { useVueDapp } from '@vue-dapp/core'
import { BrowserProvider, Contract, MaxUint256 } from 'ethers';
import { TOKEN_CONTRACT_REGISTRY } from '~~/shared/contracts/tokens';
import type { HandlerAllowances, SupportedChainId, Tokens } from '~~/shared/types';
import { ERC20_ABI } from '~~/shared/abi/token';

export const useTokenStore = defineStore('Token', () => {
  const { isConnected, wallet, chainId, watchWalletChanged } = useVueDapp();
  const toast = useToast();

  const tokens = computed(() => chainId.value? TOKEN_CONTRACT_REGISTRY[chainId.value as SupportedChainId] : []);

  const handlerAllowances = ref<HandlerAllowances>({});

  function updateHandlerAllowance(handlerAddress: string, tokenAddress: string, allowance: bigint) {
    handlerAllowances.value[handlerAddress.toLowerCase()] = {
      ...handlerAllowances.value[handlerAddress.toLowerCase()],
      [tokenAddress.toLowerCase()]: allowance,
    }
  }

  watchWalletChanged(() => {
    handlerAllowances.value = {};
  })

  const tokenBalanceLoading = ref(false);
  async function getUserTokenBalance(address: string) {
    if (!isConnected.value || !wallet.provider) return BigInt(0);
    tokenBalanceLoading.value = true;
    try {
      const provider = new BrowserProvider(wallet.provider);
      const token = new Contract(address, ERC20_ABI, provider);
      const balance = await token.balanceOf!(wallet.address);
      return BigInt(balance);
    } catch (error) {
      console.error(error);
      toast.add({
        title: 'Error',
        description: 'Failed to get token balance',
        color: 'error',
      });
      return BigInt(0);
    } finally {
      tokenBalanceLoading.value = false;
    }
  }

  async function getUserTokenAllowance(tokenAddress: string, spenderAddress: string) {
    if (!isConnected.value ||!wallet.provider) return BigInt(0);
    try {
      const provider = new BrowserProvider(wallet.provider);
      const token = new Contract(tokenAddress, ERC20_ABI, provider);
      const allowance = await token.allowance!(wallet.address, spenderAddress);
      updateHandlerAllowance(spenderAddress, tokenAddress, BigInt(allowance));
      return BigInt(allowance);
    } catch (error) {
      console.error(error);
      toast.add({
        title: 'Error',
        description: 'Failed to get token allowance',
        color: 'error',
      });
      return BigInt(0);
    }
  }

  const approveLoading = ref(false);
  async function approve(tokenAddress: string, spenderAddress: string) {
    if (!isConnected.value ||!wallet.provider) return;
    approveLoading.value = true;
    try {
      const signer = await new BrowserProvider(wallet.provider).getSigner();
      const token = new Contract(tokenAddress, ERC20_ABI, signer);
      const tx = await token.approve!(spenderAddress, MaxUint256);
      const res = await tx.wait();
      if (res.status === 1) {
        useTxHashToast(tx.hash);
      }
      updateHandlerAllowance(spenderAddress, tokenAddress, MaxUint256);
    } catch (error) {
      console.error(error);
      toast.add({
        title: 'Error',
        description: 'Failed to approve token',
        color: 'error',
      })
    } finally {
      approveLoading.value = false;
    }
  }

  function getTokenBySymbol(symbol: Tokens) {
    return tokens.value.find(token => token.symbol === symbol);
  }

  return {
    tokens,
    tokenBalanceLoading,
    getUserTokenBalance,
    approveLoading,
    approve,
    getTokenBySymbol,
    getUserTokenAllowance,
    handlerAllowances,
  }
})
