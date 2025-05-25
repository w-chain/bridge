import { defineStore } from 'pinia'
import { useVueDapp } from '@vue-dapp/core';
import { BrowserProvider, Contract, concat, zeroPadValue, toBeHex, parseUnits, hexlify, solidityPackedKeccak256, getAddress, MaxUint256 } from 'ethers';
import { BRIDGE_CONTRACT_REGISTRY } from '~~/shared/contracts/bridge';
import { getDomainId } from '~~/shared/utils/domainId';
import type { ChainId } from '~~/shared/types';
import { TransactionStatus } from '~~/shared/types';
import { BRIDGE_ABI } from '~~/shared/abi/bridge';
import { useTransactionStore, useNetworkStore } from '~~/stores';
import type { ContractTransactionResponse } from 'ethers';
import { LazyModalBridgePreflightChecks } from '#components';
import type Token from '~~/shared/objects/token';

export const useBridgeContractStore = defineStore('BridgeContract', () => {
  const { isConnected, wallet, chainId, watchWalletChanged } = useVueDapp();
  const toast = useToast();
  const overlay = useOverlay();

  const preflightModal = overlay.create(LazyModalBridgePreflightChecks);
  const agreedToTerms = ref(false);

  async function checkTermsAgreement() {
    if (agreedToTerms.value) return true;
    return new Promise<boolean>((resolve) => {
      preflightModal.open({
        onResult: (agreed: boolean) => {
          if (agreed) agreedToTerms.value = true;
          resolve(agreed);
        }
      });
    });
  }
  
  
  const contracts = computed(() => chainId.value? BRIDGE_CONTRACT_REGISTRY[chainId.value as ChainId] : undefined)
  
  const transactionStore = useTransactionStore();
  const networkStore = useNetworkStore();

  const { addTransaction, updateDepositNonce, updateTransactionStatus } = transactionStore;

  const loading = ref(false);
  const txHash = ref('');

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

  async function getHandlerAllowance(token: Token) {
    if (!contracts.value || !wallet.provider || !wallet.address || !isConnected.value) return;
    const handlerAddress = token.handlerContractAddress.toLowerCase();
    const tokenAddress = token.address.toLowerCase();
    
    // Check if allowance exists in the store
    const cached = handlerAllowances.value[handlerAddress];
    if (!cached || !cached[tokenAddress]) {
      // If allowance doesn't exist, fetch it from the contract
      const provider = new BrowserProvider(wallet.provider);
      const allowance = await token.handlerAllowance(wallet.address, provider);
      updateHandlerAllowance(handlerAddress, tokenAddress, allowance);
      return allowance;
    }
    return cached[tokenAddress];
  }

  async function approve(token: Token) {
    if (!contracts.value ||!wallet.provider || !wallet.chainId) return;
    if (wallet.chainId !== token.chainId) {
      await networkStore.switchNetworkWithChainId(token.chainId);
    }

    const agreed = await checkTermsAgreement();
    if (!agreed) return;
    
    const signer = await new BrowserProvider(wallet.provider).getSigner();
    const txHash = await token.handlerApproveMax(signer);
    updateHandlerAllowance(contracts.value.erc20Handler, token.address, MaxUint256);
    useTxHashToast(txHash);
  }

  async function deposit(amount: number, recipient: string, token: Token, destinationChainId: ChainId) {
    const agreed = await checkTermsAgreement();
    if (!agreed) return;

    if (!contracts.value ||!wallet.provider || !isConnected.value || !chainId.value) return;

    if (chainId.value !== token.chainId) {
      await networkStore.switchNetworkWithChainId(token.chainId);
    }
    
    if (destinationChainId === chainId.value) {
      toast.add({
        title: 'Error',
        description: 'You cannot deposit to the same chain',
        color: 'error',
      })
      return;
    }
    const domainId = getDomainId(destinationChainId);
    
    const data = concat([
      // Deposit Amount (32 bytes)
      zeroPadValue(
        toBeHex(parseUnits(amount.toString(), token.decimals)),
        32
      ),
      // Length of recipient address (32 bytes)
      zeroPadValue(
        toBeHex(20), // Fixed length for Ethereum address (20 bytes)
        32
      ),
      // Recipient address (20 bytes)
      zeroPadValue(recipient, 20),
    ]);

    loading.value = true;
    try {
      const signer = await new BrowserProvider(wallet.provider).getSigner();
      const contract = new Contract(contracts.value.bridge, BRIDGE_ABI, signer);

      // Make Deposit
      const tx: ContractTransactionResponse = await contract.deposit!(domainId, token.resourceId, data);
      txHash.value = tx.hash;
      addTransaction({
        fromChainId: wallet.chainId!,
        toChainId: destinationChainId,
        originDomainId: getDomainId(wallet.chainId as ChainId),
        destinationDomainId: domainId,
        resourceId: token.resourceId,
        depositNonce: '0',
        data: data,
        amount: amount,
        tokenAddress: token.address,
        tokenSymbol: token.symbol,
        sender: wallet.address!,
        recipient: recipient,
        txHash: tx.hash,
        status: TransactionStatus.PENDING,
        timestamp: Date.now(),
      });

      const res = await tx.wait();
      if (tx.hash && res && res.status === 1) {
        const depositLog = res.logs.find(log => {
          try {
            const parsed = contract.interface.parseLog(log);
            return parsed?.name === "Deposit";
          } catch {
            return false;
          }
        });
      
        if (depositLog) {
          const parsedLog = contract.interface.parseLog(depositLog);
          if (parsedLog && parsedLog.args) {
            const depositNonce = parsedLog.args.depositNonce;
            updateDepositNonce(tx.hash, String(depositNonce));
            updateTransactionStatus(tx.hash, TransactionStatus.AWAITING);
          }
        } else {
          console.error("Deposit event not found");
        }
        useTxHashToast(tx.hash);
        navigateTo('/history');
      }
      return Promise.resolve();
    } catch (error) {
      console.error(error);
      toast.add({
        title: 'Error',
        description: 'Failed to deposit token',
        color: 'error',
      })
    } finally {
      loading.value = false;
    }
  }

  async function getProposal(fromChainId: number, toChainId: number, data: string, depositNonce: string, txHash: string) {
    if (!contracts.value ||!wallet.provider ||!isConnected.value) return;
    if (chainId.value !== toChainId) {
      await networkStore.switchNetworkWithChainId(toChainId);
    }
    const handlerAddress = contracts.value.erc20Handler;
    const dataHash = solidityPackedKeccak256(["address", "bytes"], [getAddress(handlerAddress), hexlify(data)])
    const provider = new BrowserProvider(wallet.provider);
    const contract = new Contract(contracts.value.bridge, BRIDGE_ABI, provider);
    const proposal = await contract.getProposal!(getDomainId(fromChainId as ChainId), depositNonce, dataHash);

    const status = Number(proposal._status);
    const yesVotes = Number(proposal._yesVotes);

    if (status === 3) updateTransactionStatus(txHash, TransactionStatus.SUCCESS);

    return { status, yesVotes }
  }

  return {
    contracts,
    loading,
    agreedToTerms,
    getHandlerAllowance,
    deposit,
    approve,
    getProposal,
  }
})
