<script lang="ts" setup>
import { useVueDapp } from '@vue-dapp/core'
import { MaxUint256, parseUnits } from 'ethers';
import { useBridgeContractStore, useBridgeStatesStore } from '~~/stores';

const { wallet, watchWalletChanged } = useVueDapp();
const bridgeContract = useBridgeContractStore();
const bridgeStates = useBridgeStatesStore();

const amount = ref<number>();

const needToApprove = computed(() => {
  if (bridgeStates.handlerAllowance === MaxUint256) return false;
  return bridgeStates.handlerAllowance < parseUnits(amount.value?.toString() ?? '0', bridgeStates.selectedToken?.decimals ?? 0);
});

const handleAction = async () => {
  const token = bridgeStates.selectedToken;
  if (!token || !amount.value || !wallet.address || !wallet.chainId) return;
  if (token.chainId !== wallet.chainId || !bridgeStates.toChainId) return;
  
  if (needToApprove.value) {
    await bridgeContract.approve(token);
    await bridgeStates.fetchHandlerAllowance();
  } else {
    await bridgeContract.deposit(amount.value, wallet.address, token, bridgeStates.toChainId);
  }
};

watchWalletChanged(() => bridgeStates.resetTokens())

</script>

<template>
  <div class="px-2">
    <div class="p-2 sm:p-4 rounded-xl light:bg-gradient-to-br light:from-blue-50 light:to-80% light:to-blue-300/80 bg-neutral-800">
      <div class="flex flex-col items-center gap-8 p-2 sm:p-4">
        <BridgeNetworkSelectors />
        <BridgeTokenAmount v-model="amount" />
        <UButton 
          :label="needToApprove ? 'Approve' : `Move ${bridgeStates.fromToken ?? 'Funds'} to ${bridgeStates.to}`"
          block
          size="xl"
          loading-auto
          @click="handleAction"
        />
      </div>
    </div>
    <!-- Bridge Fee Display -->
    <div v-if="bridgeContract.formattedFee && bridgeContract.feeCurrencyName" class="mt-4 p-3 rounded-lg bg-neutral-100 dark:bg-neutral-700">
      <div class="flex justify-between items-center text-sm">
        <span class="text-neutral-600 dark:text-neutral-400">Bridge Fee:</span>
        <span class="font-medium text-neutral-900 dark:text-neutral-100">
          {{ bridgeContract.formattedFee }} {{ bridgeContract.feeCurrencyName }}
        </span>
      </div>
    </div>
    
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="transform -translate-y-full opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-full opacity-0"
    >
      <BridgeEstimatedAmounts
        v-if="amount && bridgeStates.fromToken"
        :amount="amount"
        :fee="bridgeContract.formattedFee"
        :token-symbol="bridgeStates.fromToken ?? ''"
        :currency="bridgeContract.feeCurrencyName"
      />
    </Transition>
  </div>
</template>