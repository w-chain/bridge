<script lang="ts" setup>
import { useTransactionStore } from '~~/stores/Transaction';
const emit = defineEmits<{ close: [boolean] }>();

const transactionStore = useTransactionStore();

const pendingTransactions = computed(() => transactionStore.pendingTransactions);

watch(pendingTransactions, (newVal, oldVal) => {
  // Force update when transactions change
  if (newVal.length !== oldVal?.length) {
    // Additional logic can be added here if needed
  }
}, { deep: true });

</script>

<template>
  <UModal
    :close="{ onClick: () => emit('close', false) }"
    :title="`Processing your Bridge Transaction`"
  >
    <template #body>
      <BridgeHistoryItem
        v-for="transaction in pendingTransactions"
        :key="transaction.txHash"
        :transaction="transaction"
      />
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton
          :disabled="pendingTransactions.length > 0"
          @click="emit('close', true)"
        >
          Close
        </UButton>
      </div>
    </template>
  </UModal>
</template>