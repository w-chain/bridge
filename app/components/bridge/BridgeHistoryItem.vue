<script lang="ts" setup>
import { shortenAddress } from '@vue-dapp/core';
import { UIcon } from '#components';
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

onMounted(async () => {
  await nextTick();

  let intervalId: NodeJS.Timeout | null = null

  // Start interval if isPending is true
  if (isPending.value) {
    intervalId = setInterval(handleCheckTransaction, 10_000) // 10 seconds
  }

  // Watch for changes in isPending
  const stopWatcher = watch(isPending, (newValue) => {
    if (newValue && !intervalId) {
      // Start interval when isPending becomes true
      intervalId = setInterval(handleCheckTransaction, 10_000)
    } else if (!newValue && intervalId) {
      // Clear interval when isPending becomes false
      clearInterval(intervalId)
      intervalId = null
    }
  })

  // Cleanup on component unmount
  onUnmounted(() => {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
    stopWatcher() // Stop the watcher
  })
})

</script>

<template>
  <div class="p-4 border rounded-lg mb-4 bg-white/5" :class="{ 'border-yellow-500': isPending }" >
    <div class="flex justify-between items-center mb-2">
      <div class="flex items-center gap-2">
        <span class="text-sm font-semibold">From: {{ getNetworkFromChainId(transaction.fromChainId) }}</span>
        <span>→</span>
        <span class="text-sm font-semibold">To: {{ getNetworkFromChainId(transaction.toChainId) }}</span>
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
      description="This may takes up-to 5 minutes to complete."
      color="warning"
      icon="i-lucide-clock-10"
      variant="outline"
    />
    
    <div class="grid grid-cols-2 gap-4 text-sm">
      <div>
        <div class="text-gray-400">Amount</div>
        <div class="flex gap-2 items-center">{{ transaction.amount }} <UBadge variant="outline" :label="transaction.tokenSymbol" :avatar="{ src: `/images/tokens/${transaction.tokenSymbol.toLowerCase()}.webp`, alt: `${transaction.tokenSymbol} logo` }" /></div>
      </div>
      <div>
        <div class="text-gray-400">Recipient</div>
        <div class="truncate">{{ shortenAddress(transaction.recipient) }}</div>
      </div>
      <div>
        <div class="text-gray-400">Deposit Tx Hash</div>
        <div class="font-extralight underline"><NuxtLink :to="useTxHashUrl(transaction.fromChainId, transaction.txHash)" external target="_blank" >{{ shortenAddress(transaction.txHash) }} <UIcon name="i-lucide-square-arrow-out-up-right" /></NuxtLink></div>
      </div>
      <div>
        <div class="text-gray-400">Deposit Time</div>
        <div>{{ new Date(transaction.timestamp).toLocaleString() }}</div>
      </div>
    </div>
  </div>
</template>