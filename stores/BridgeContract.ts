import { defineStore } from 'pinia'
import { useVueDapp } from '@vue-dapp/core';
import { BrowserProvider, Contract, concat, zeroPadValue, toBeHex, parseUnits, hexlify, solidityPackedKeccak256, getAddress } from 'ethers';
import { BRIDGE_CONTRACT_REGISTRY } from '~~/shared/contracts/bridge';
import type { SupportedChainId } from '~~/shared/types/contract';
import { getDomainId } from '~~/shared/utils/domainId';
import { TransactionStatus } from '~~/shared/types';
import { BRIDGE_ABI } from '~~/shared/abi/bridge';
import { useTokenStore, useTransactionStore, useNetworkStore } from '~~/stores';
import type { ContractTransactionResponse } from 'ethers';
import { LazyModalBridgePreflightChecks } from '#components';

export const useBridgeContractStore = defineStore('BridgeContract', () => {
  const { isConnected, wallet, chainId } = useVueDapp();
  const toast = useToast();
  const overlay = useOverlay();
  const router = useRouter();

  const preflightModal = overlay.create(LazyModalBridgePreflightChecks);
  const agreedToTerms = ref(false);
  
  const contracts = computed(() => chainId.value? BRIDGE_CONTRACT_REGISTRY[chainId.value as SupportedChainId] : undefined)
  const tokenStore = useTokenStore();
  const transactionStore = useTransactionStore();
  const networkStore = useNetworkStore();

  const { addTransaction, updateDepositNonce, updateTransactionStatus } = transactionStore;

  const loading = ref(false);
  const txHash = ref('');

  async function getHandlerAllowance(token: string) {
    if (!contracts.value || !wallet.provider || !isConnected.value) return;
    const handlerAddress = contracts.value.erc20Handler.toLowerCase();
    const tokenAddress = token.toLowerCase();
    
    // Check if allowance exists in the store
    const handlerAllowances = tokenStore.handlerAllowances[handlerAddress];
    if (!handlerAllowances || !handlerAllowances[tokenAddress]) {
      // If allowance doesn't exist, fetch it from the contract
      const allowance = await tokenStore.getUserTokenAllowance(token, contracts.value.erc20Handler);
      return allowance;
    }
    return handlerAllowances[tokenAddress];
  }

  async function approve(tokenAddress: string) {
    if (!contracts.value ||!wallet.provider ||!isConnected.value) return;
    if (agreedToTerms.value === false) {
      preflightModal.open();
      return;
    }
    const handlerAddress = contracts.value.erc20Handler;
    return tokenStore.approve(tokenAddress, handlerAddress);
  }

  async function deposit(amount: number, recipient: string, token: Tokens, destinationChainId: SupportedChainId) {
    if (agreedToTerms.value === false) {
      preflightModal.open();
      return;
    }
    const tokenData = tokenStore.getTokenBySymbol(token);
    if (!contracts.value ||!wallet.provider ||!isConnected.value ||!tokenData) return;
    
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
        toBeHex(parseUnits(amount.toString(), tokenData.decimals)),
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

      // setup Event Listener
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // contract.once(contract.filters.Deposit!(null,null,null,signer.address,null,null), (...args: any[]) => {
      //   // The Deposit event signature is likely: Deposit(uint8 destDomainID, bytes32 resourceID, uint64 depositNonce, address user, bytes data, uint256 feeData)
      //   // So destructure accordingly:
      //   const [destDomainId, resourceId, depNonce] = args[0].args;
      //   if (Number(destDomainId) === domainId && String(resourceId).toLowerCase() === tokenData.resourceId.toLowerCase()) {
      //     updateDepositNonce(txHash.value, String(depNonce));
      //     updateTransactionStatus(txHash.value, TransactionStatus.AWAITING);
      //     txHash.value = '';
      //   }
      // });

      // Make Deposit
      const tx: ContractTransactionResponse = await contract.deposit!(domainId, tokenData.resourceId, data);
      txHash.value = tx.hash;
      addTransaction({
        fromChainId: wallet.chainId!,
        toChainId: destinationChainId,
        originDomainId: getDomainId(wallet.chainId as SupportedChainId),
        destinationDomainId: domainId,
        resourceId: tokenData.resourceId,
        depositNonce: '0',
        data: data,
        amount: amount,
        tokenAddress: tokenData.address,
        tokenSymbol: tokenData.symbol,
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
        router.push({ query: { tab: 'history' } })
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
      const { switchNetwork } = networkStore;
      await switchNetwork(getNetworkFromChainId(toChainId));
    }
    const handlerAddress = contracts.value.erc20Handler;
    const dataHash = solidityPackedKeccak256(["address", "bytes"], [getAddress(handlerAddress), hexlify(data)])
    const provider = new BrowserProvider(wallet.provider);
    const contract = new Contract(contracts.value.bridge, BRIDGE_ABI, provider);
    const proposal = await contract.getProposal!(getDomainId(fromChainId as SupportedChainId), depositNonce, dataHash);

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
