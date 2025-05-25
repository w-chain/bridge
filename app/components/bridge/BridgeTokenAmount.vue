<script lang="ts" setup>
import { useBridgeStatesStore } from '~~/stores';

const bridgeStates = useBridgeStatesStore();

const amount = defineModel<number>();

const validateAmount = (value: string | number | null) => {
  if (value === null || value === '') return undefined;
  const numStr = String(value).replace(/^0+(?=\d)/, '');
  const num = Number(numStr);
  return isNaN(num) ? undefined : num;
};

function handleMax(max: number) {
  amount.value = max;
}

</script>

<template>
  <div class="flex justify-between py-2 gap-2 w-full items-center rounded-xl border border-gray-200 dark:border-neutral-700">
    <UInput 
      :model-value="amount"
      class="w-full"
      size="xl"
      variant="ghost"
      placeholder="0"
      min="0"
      @update:model-value="amount = validateAmount($event)"
    />
    <div class="flex flex-col items-end gap-1 px-2">
      <ModalBridgeTokenSelect />
      <BridgeTokenBalance v-if="bridgeStates.selectedToken" :token="bridgeStates.selectedToken" :amount="amount" @max="handleMax" />
      <div v-else class="text-xs text-gray-600 dark:text-gray-300 text-right">Balance: 0.0</div>
    </div>
  </div>
</template>