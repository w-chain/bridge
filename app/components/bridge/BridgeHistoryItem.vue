<script lang="ts" setup>
import { shortenAddress } from '@vue-dapp/core';
import type { BridgeTransaction } from '~~/shared/types/transaction';
import { getNetworkFromChainId } from '~~/shared/utils/network';
import { useBridgeContractStore } from '~~/stores';

const props = defineProps<{
  transaction: BridgeTransaction
}>();

const isPending = computed(() => props.transaction.status === TransactionStatus.PENDING || props.transaction.status === TransactionStatus.AWAITING);
const isSuccess = computed(() => props.transaction.status === TransactionStatus.SUCCESS);
const isFailed = computed(() => props.transaction.status === TransactionStatus.FAILED || props.transaction.status === TransactionStatus.REJECTED);

const bridgeStore = useBridgeContractStore();

const loading = ref(false);
async function handleCheckTransaction() {
  loading.value = true;
  try {
    const { getProposal } = bridgeStore;
    await getProposal(props.transaction.fromChainId, props.transaction.toChainId, props.transaction.data, props.transaction.depositNonce, props.transaction.txHash);
  } finally {
    loading.value = false;
  }
}

let intervalId: NodeJS.Timeout | null = null

// Setup watch outside of onMounted
const stopWatch = watch(isPending, (newValue) => {
  if (newValue && !intervalId) {
    handleCheckTransaction();
    // Start interval when isPending becomes true
    intervalId = setInterval(handleCheckTransaction, 10_000)
  } else if (!newValue && intervalId) {
    // Clear interval when isPending becomes false
    clearInterval(intervalId)
    intervalId = null
  }
}, { immediate: true })

// Cleanup on component unmount
onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
  stopWatch()
})
</script>

<template>
  <div class="p-4 rounded-xl mb-4 bg-neutral-100 dark:bg-neutral-800 " :class="{ 'border border-yellow-500': isPending }" >
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
      <div class="flex items-center gap-2 flex-wrap">
        <UButton variant="ghost" size="xs" :avatar="{ src: getNetworkImage(getNetworkFromChainId(transaction.fromChainId)) }" :label="`From: ${getNetworkFromChainId(transaction.fromChainId)}`" />
        <span>→</span>
        <UButton variant="ghost" size="xs" :avatar="{ src: getNetworkImage(getNetworkFromChainId(transaction.toChainId)) }" :label="`To: ${getNetworkFromChainId(transaction.toChainId)}`" />
      </div>
      <div
        class="text-sm" 
        :class="{
        'text-green-500': isSuccess,
        'text-yellow-500': isPending,
        'text-red-500': isFailed
      }">
        {{ transaction.status }}
        <UIcon
          v-if="isPending"
          name="i-lucide-refresh-cw"
          class="animate-spin"
        />
      </div>
    </div>

    <UAlert 
      v-if="isPending"
      class="my-2"
      description="This may takes up-to 15 minutes to complete."
      color="warning"
      icon="i-lucide-clock-10"
      variant="outline"
    />
    
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
      <div>
        <div class="text-gray-400">Amount</div>
        <div class="flex gap-2 items-center flex-wrap">
          {{ transaction.amount }}
          <UBadge variant="outline" :label="getBSCTargetToken(transaction.tokenSymbol as TokenSymbols)" :avatar="{ src: getTokenImage(transaction.tokenSymbol as TokenSymbols), alt: `${transaction.tokenSymbol} logo` }" />
          <ModalAddToken :token-symbol="getBSCTargetToken(transaction.tokenSymbol as TokenSymbols)" :to-chain-id="transaction.toChainId" />
        </div>
      </div>
      <div>
        <div class="text-gray-400">Recipient</div>
        <div class="truncate">{{ shortenAddress(transaction.recipient) }}</div>
      </div>
      <div>
        <div class="text-gray-400">Deposit Tx Hash</div>
        <div class="font-extralight underline break-all"><NuxtLink :to="useTxHashUrl(transaction.fromChainId, transaction.txHash)" external target="_blank" >{{ shortenAddress(transaction.txHash) }} <UIcon name="i-lucide-square-arrow-out-up-right" /></NuxtLink></div>
      </div>
      <div>
        <div class="text-gray-400">Deposit Time</div>
        <div>{{ new Date(transaction.timestamp).toLocaleString() }}</div>
      </div>
    </div>
  </div>
</template>