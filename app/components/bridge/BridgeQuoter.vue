<script lang="ts" setup>
import { Networks, Tokens } from '~~/shared/types';

const route = useRoute();
const router = useRouter();

const sourceChain = ref<Networks>(Networks.ETH);
const destinationChain = ref<Networks>(Networks.WCHAIN);
const token = ref<Tokens>(Tokens.USDT);

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
    }
  }
  
  router.push({
    query: {
      ...route.query,
      sourceChain: sourceChain.value,
      destinationChain: destinationChain.value,
      token: newToken
    }
  });
});

const handleSwapChains = () => {
  const temp = sourceChain.value;
  sourceChain.value = destinationChain.value;
  destinationChain.value = temp;
};
</script>

<template>
  <UCard class="p-2">
    <!-- From -->
    <UCard class="p-4 bg-neutral-800">
      <div class="flex justify-between gap-2 items-center">
        <div>
          <ModalBridgeNetworkSelect v-model:network="sourceChain" direction="from" @update:network="handleSwapChains" />
        </div>
        <div>
          <img class="w-12" :src="`/images/networks/${sourceChain}.webp`" alt="Source Chain Logo" loading="lazy">
        </div>
      </div>

      <div class="mt-4 flex justify-between gap-2 items-center bg-neutral-900 p-2 lg:p-4 rounded-md">
        <UInput 
          class="w-full"
          size="xl"
          variant="ghost"
          placeholder="0"
        />
        <div class="flex flex-col items-center">
          <ModalBridgeTokenSelect v-model:token="token" />
          <div class="text-xs">Balance: 1000</div>
        </div>
      </div>
    </UCard>

    <!-- Switch Button -->
    <div class="flex justify-center items-center -my-2">
      <UButton
        variant="soft"
        class="hover:rotate-180 transition-transform duration-300 bg-neutral-900 cursor-pointer"
        icon="i-lucide-arrow-up-down"
        @click="handleSwapChains"
      />
    </div>
    <!-- To -->
    <UCard class="p-4 bg-blue-800/70">
      <div class="flex justify-between items-center">
        <div>
          <ModalBridgeNetworkSelect v-model:network="destinationChain" direction="to" @update:network="handleSwapChains" />
        </div>
        <div>
          <img class="w-12" :src="`/images/networks/${destinationChain}.webp`" alt="Destination Chain Logo" loading="lazy">
        </div>
      </div>
      <div class="mt-4 flex justify-between gap-2 items-center bg-neutral-900 p-2 lg:p-4 rounded-md">
        <UInput
          class="w-full"
          size="xl"
          variant="ghost"
          placeholder="0"
        />
        <div>
          <div class="text-xs text-nowrap">Balance: 1000</div>
        </div>
      </div>
    </UCard>
    <!-- Bridge Button -->
    <div class="flex justify-center items-center mt-4">
      <UButton
        block
        size="xl"
        class="w-full"
        :label="`Move Funds to ${destinationChain.toUpperCase()}`"
      />
    </div>

  </UCard>
</template>