<script lang="ts" setup>
import { Networks, TokenSymbols } from '~~/shared/types';
import { getTokenImage } from '~~/shared/utils';
import { useBridgeStatesStore } from '~~/stores';

const bridgeStates = useBridgeStatesStore();

const open = ref(false);

const availableFromTokens = ref([TokenSymbols.USDT, TokenSymbols.USDC]);

watch(open, newOpen => {
  if (newOpen) {
    if (bridgeStates.from === Networks.WCHAIN && bridgeStates.to === Networks.BSC) {
      availableFromTokens.value = [TokenSymbols.bUSDT, TokenSymbols.bUSDC];
    } else {
      availableFromTokens.value = [TokenSymbols.USDT, TokenSymbols.USDC];
    }
  }
})

</script>

<template>
  <UModal 
    v-model:open="open" 
    title="Select Token" 
    description="Select the token you want to move from Source Chain."
    :ui="{ content: 'max-w-md' }"
  >
    <UButton
      :variant="bridgeStates.fromToken ? 'ghost' : 'solid'" 
      :avatar="bridgeStates.fromToken ? { src: getTokenImage(bridgeStates.fromToken), alt: `${bridgeStates.fromToken} logo`  } : undefined"
      :label="bridgeStates.fromToken || 'Select Token'"
      trailing-icon="i-lucide-chevron-down"
    />

    <template #body>
      <ul class="space-y-2">
        <li
          v-for="token_ in availableFromTokens"
          :key="token_">
            <UButton
              size="xl"
              variant="ghost" 
              class="cursor-pointer text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-neutral-900"
              :avatar="{ src: getTokenImage(token_), alt: `${token_} logo`  }"
              :label="token_"
              @click="bridgeStates.fromToken = token_; open = false"
            />
        </li>
      </ul>
    </template>
  </UModal>
</template>