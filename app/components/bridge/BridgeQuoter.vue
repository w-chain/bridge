<script lang="ts" setup>
import { useVueDapp } from '@vue-dapp/core';
import { useDebounceFn } from '#imports';
import { formatUnits } from 'ethers';
import { Networks, Tokens, type SupportedChainId } from '~~/shared/types';
import { useBridgeContractStore, useNetworkStore, useTokenStore } from '~~/stores';

const { isConnected, wallet, chainId, watchWalletChanged } = useVueDapp();
const route = useRoute();
const router = useRouter();
const networkStore = useNetworkStore();
const tokenStore = useTokenStore();
const bridgeStore = useBridgeContractStore();

const supportedTokens = computed(() => tokenStore.tokens);

const recipient = ref(wallet.address)
const amount = ref<number>();
const sourceChain = ref<Networks>(Networks.ETH);
const destinationChain = ref<Networks>(Networks.WCHAIN);
const token = ref(supportedTokens.value[0]?.symbol || Tokens.USDT);
const selectedToken = computed(() => supportedTokens.value.find(t => t.symbol === token.value));

const validateAmount = (value: string | number | null) => {
  if (value === null || value === '') return undefined;
  const numStr = String(value).replace(/^0+(?=\d)/, '');
  const num = Number(numStr);
  return isNaN(num) ? undefined : num;
};

const selectedTokenBalance = ref('0');

const handleNewSourceChain = (newSourceChain: Networks) => {
  networkStore.switchNetwork(newSourceChain);
}

const updateSelectedTokenBalance = useDebounceFn(async () => {
  if (isConnected.value && selectedToken.value && selectedToken.value.address && chainId.value) {
    if (getNetworkFromChainId(chainId.value) !== sourceChain.value) {
      handleNewSourceChain(sourceChain.value);
      await useWait(500);
    }
    const balance = await tokenStore.getUserTokenBalance(selectedToken.value.address);
    selectedTokenBalance.value = formatUnits(balance, selectedToken.value.decimals);
  }
}, 500);

watch(selectedToken, () => {
  updateSelectedTokenBalance();
  amount.value = undefined;
}, { immediate: true });

// Initialize from route query
watchEffect(() => {
  const querySourceChain = route.query.sourceChain as string;
  const queryDestinationChain = route.query.destinationChain as string;
  const queryToken = route.query.token as string;

  if (Object.values(Networks).includes(querySourceChain as Networks)) {
    sourceChain.value = querySourceChain as Networks;
  }
  if (Object.values(Networks).includes(queryDestinationChain as Networks)) {
    destinationChain.value = queryDestinationChain as Networks;
  }
  if (Object.values(Tokens).includes(queryToken as Tokens)) {
    token.value = queryToken as Tokens;
  }
});

// Update route query when values change
watch([sourceChain, destinationChain, token], ([newSourceChain, newDestinationChain, newToken], [oldSourceChain, oldDestinationChain]) => {
  if (newSourceChain === newDestinationChain) {
    const availableNetworks = getEnumValues(Networks) as Networks[];
    // If destination chain was changed, update source chain
    if (newDestinationChain !== oldDestinationChain) {
      sourceChain.value = availableNetworks.find(n => n !== oldSourceChain) || availableNetworks[0] as Networks;
    } else {
      // If source chain was changed, update destination chain
      destinationChain.value = availableNetworks.find(n => n !== newSourceChain) || availableNetworks[0] as Networks;
      handleNewSourceChain(newSourceChain);
    }
  }
  
  router.push({
    query: {
      ...route.query,

      tab: 'bridge',
      sourceChain: sourceChain.value,
      destinationChain: destinationChain.value,
      token: newToken
    }
  });
}, { immediate: true });

const handleSwapChains = () => {
  const temp = sourceChain.value;
  sourceChain.value = destinationChain.value;
  destinationChain.value = temp;
  handleNewSourceChain(sourceChain.value);
};

const allowance = ref<number>(0);
const shouldApprove = computed(() => {
  if (amount.value) {
    return amount.value > allowance.value;
  }
  return false;
});

const updateAllowance = useDebounceFn(async (newAmount: number) => {
  if (newAmount && selectedToken.value?.address) {
    const allowanceBig = await bridgeStore.getHandlerAllowance(selectedToken.value?.address);
    if (allowanceBig !== undefined && selectedToken.value?.decimals) {
      allowance.value = Number(formatUnits(allowanceBig, selectedToken.value?.decimals));
    }
  }
}, 500);

watch(amount, (newAmount) => {
  if (typeof newAmount === 'number') {
    updateAllowance(newAmount);
  }
});

async function handleApprove() {
  if (amount.value && selectedToken.value?.address) {
    const { approve } = bridgeStore;
    await approve(selectedToken.value?.address);
    updateAllowance(amount.value);
  }
}

async function handleBridge() {
  if (amount.value && selectedToken.value?.address && recipient.value) {
    const { deposit } = bridgeStore;
    await deposit(amount.value, recipient.value, token.value, getNetworkChainId(destinationChain.value, networkStore.isTestnet) as SupportedChainId);
  }
}

watchWalletChanged((wallet) => {
  updateSelectedTokenBalance();
  recipient.value = wallet.address;
  if (getNetworkFromChainId(wallet.chainId) !== sourceChain.value) {
    handleNewSourceChain(sourceChain.value);
  }
}, { immediate: true });
</script>

<template>
  <UCard class="p-2 bg-white dark:bg-neutral-900">
    <!-- From -->
    <UCard class="p-2 bg-gray-100 dark:bg-neutral-800">
      <div class="flex justify-between gap-2 items-center">
        <div>
          <ModalBridgeNetworkSelect v-model:network="sourceChain" direction="from" @update:network="handleSwapChains" />
        </div>
        <div>
          <img class="w-12" :src="`/images/networks/${sourceChain.toLowerCase()}.webp`" alt="Source Chain Logo" loading="lazy">
        </div>
      </div>

      <div class="mt-4 flex justify-between gap-2 items-center bg-gray-50 dark:bg-neutral-900 p-2 lg:p-4 rounded-md border border-gray-200 dark:border-neutral-700">
        <UInput 
          :model-value="amount"
          class="w-full"
          size="xl"
          variant="ghost"
          placeholder="0"
          min="0"
          @update:model-value="amount = validateAmount($event)"
        />
        <div class="flex flex-col items-center">
          <ModalBridgeTokenSelect v-model:token="token" />
          <USkeleton v-if="tokenStore.tokenBalanceLoading" class="w-24 h-5" />
          <div v-else class="text-xs text-gray-600 dark:text-gray-300">Balance: {{ selectedTokenBalance }}</div>
        </div>
      </div>
    </UCard>

    <!-- Switch Button -->
    <div class="flex justify-center items-center -my-2">
      <UButton
        variant="soft"
        class="hover:rotate-180 transition-transform duration-300 bg-gray-200 dark:bg-neutral-900 cursor-pointer"
        icon="i-lucide-arrow-up-down"
        @click="handleSwapChains"
      />
    </div>
    <!-- To -->
    <UCard class="p-4 bg-blue-100 dark:bg-blue-800/70">
      <div class="flex justify-between items-center">
        <div>
          <ModalBridgeNetworkSelect v-model:network="destinationChain" direction="to" @update:network="handleSwapChains" />
        </div>
        <div>
          <img class="w-12" :src="`/images/networks/${destinationChain.toLowerCase()}.webp`" alt="Destination Chain Logo" loading="lazy">
        </div>
      </div>
      <div class="mt-4 flex bg-gray-50 dark:bg-neutral-900 p-2 lg:p-4 rounded-md border border-gray-200 dark:border-neutral-700">
        <UInput
          v-model:model-value="amount"
          class="w-full"
          size="xl"
          variant="ghost"
          placeholder="0"
          disabled
        />
      </div>
    </UCard>

    <UCard v-if="amount && !shouldApprove" class="my-4 border border-yellow-400 dark:border-yellow-500 bg-yellow-50 dark:bg-neutral-800">
      <template #header>
        <div class="text-sm text-gray-800 dark:text-gray-200">
          Transaction Review
        </div>
      </template>
      <div class="flex justify-end text-sm text-gray-700 dark:text-gray-300">
        <div class="grid grid-cols-2 gap-1">
          <div class="text-right">You will receive: </div>
          <div>{{ amount }} {{ token }}</div>
          <div class="text-right">Destination Chain: </div>
          <div>{{ destinationChain }}</div>
          <div class="text-right">Fee: </div>
          <div>0.0 {{ sourceChain === Networks.ETH ? 'ETH' : 'WCO' }}</div>
        </div>
      </div>
    </UCard>
    <!-- Bridge Button -->
    <div class="flex flex-col gap-4 justify-center items-center mt-4">
      <UButton 
        v-if="Number(selectedTokenBalance) >= Number(amount) && shouldApprove"
        block
        size="xl"
        class="w-full"
        label="Approve Bridge"
        :loading="tokenStore.approveLoading"
        @click="handleApprove"
      />
      <UButton
        block
        size="xl"
        class="w-full cursor-pointer"
        :label="`Move Funds to ${destinationChain.toUpperCase()}`"
        :disabled="!amount || Number(amount) > Number(selectedTokenBalance) || shouldApprove"
        :loading="bridgeStore.loading"
        @click="handleBridge"
      />
    </div>

  </UCard>
</template>