<script lang="ts" setup>
import { useTransactionStore } from '~~/stores/Transaction';

const transactionStore = useTransactionStore();
const completedTransactions = computed(() => transactionStore.completedTransactions);
const pendingTransactions = computed(() => transactionStore.pendingTransactions);

const clearLoading = ref(false);
const handleClearCompletedTransactions = async () => {
  clearLoading.value = true;
  transactionStore.clearCompletedTransactions();
  await useWait(200);
  clearLoading.value = false;
};
</script>

<template>
  <div class="space-y-4">
    
    <h2 class="text-xl font-semibold mb-4">Pending Transactions</h2>
    <div v-if="pendingTransactions.length === 0" class="text-center text-gray-400 py-8">
      No pending transactions
    </div>
    <BridgeHistoryItem
      v-else
      v-for="transaction in pendingTransactions"
      :key="transaction.txHash"
      :transaction="transaction"
    />

    <USeparator />
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-semibold mb-4">Completed Transactions</h2>
      <UButton 
        variant="outline"
        size="sm"
        icon="i-lucide-trash"
        :loading="clearLoading"
        @click="handleClearCompletedTransactions"
      >
        Clear Completed Txs
      </UButton>
    </div>
    <div v-if="completedTransactions.length === 0" class="text-center text-gray-400 py-8">
      No completed transactions
    </div>
    <BridgeHistoryItem
      v-else
      v-for="transaction in completedTransactions"
      :key="transaction.txHash"
      :transaction="transaction"
    />
  </div>
</template>