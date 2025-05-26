<script lang="ts" setup>
import { useVueDapp } from '@vue-dapp/core'
import { MaxUint256, parseUnits } from 'ethers';
import { getNetworkNativeToken } from '~~/shared/utils';
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
        :fee="bridgeStates.fee"
        :token-symbol="bridgeStates.fromToken ?? ''"
        :currency="getNetworkNativeToken(bridgeStates.from)"
      />
    </Transition>
  </div>
</template>