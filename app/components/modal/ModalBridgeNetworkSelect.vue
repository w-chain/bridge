<script lang="ts" setup>
import { getNetworkImage } from '~~/shared/utils';
import { useBridgeStatesStore } from '~~/stores';

const props = defineProps<{ direction: 'from' | 'to' }>();

const bridgeStates = useBridgeStatesStore();
const open = ref(false);

const network = computed(() => (props.direction === 'from' ? bridgeStates.from : bridgeStates.to));

const networks = getEnumValues(Networks) as Networks[];

function handleSelect(network_: Networks) {
  if (props.direction === 'from') {
    bridgeStates.from = network_;
  } else {
    bridgeStates.to = network_;
  }
  open.value = false;
}

const isNetworkDisabled = (network_: Networks) => {
  // If current network is the same as selected, it should be disabled
  if (network.value === network_) return true;

  if (props.direction === 'from') {
    // If selecting source network
    const targetNetwork = bridgeStates.to;
    // Only allow WCHAIN -> ETH/BSC or ETH/BSC -> WCHAIN
    if (network_ === Networks.WCHAIN) {
      return targetNetwork === Networks.WCHAIN;
    } else {
      return targetNetwork !== Networks.WCHAIN;
    }
  } else {
    // If selecting target network
    const sourceNetwork = bridgeStates.from;
    // Only allow WCHAIN -> ETH/BSC or ETH/BSC -> WCHAIN
    if (sourceNetwork === Networks.WCHAIN) {
      return network_ === Networks.WCHAIN;
    } else {
      return network_ !== Networks.WCHAIN;
    }
  }
};
</script>

<template>
  <UModal 
    v-model:open="open" 
    title="Select Network" 
    :description="`Select Network you want to transfer ${props.direction}`"
    :ui="{ content: 'max-w-md' }"
  >
    <div>
      <div class="text-sm font-light">
        {{ `${props.direction.charAt(0).toUpperCase() + props.direction.slice(1)}: ` }}
      </div>
      <UButton
        :avatar="network ? { src: getNetworkImage(network), alt: `${network} logo`  } : undefined"
        :class="[props.direction === 'from' ? 'bg-gray-100 dark:bg-neutral-800 text-gray-800 dark:text-gray-200' : 'bg-blue-100 dark:bg-royal-blue text-blue-800 dark:text-blue-200']"
        class="border border-gray-200 dark:border-neutral-700"
        :label="network"
        trailing-icon="i-lucide-chevron-down"
        block
        size="xl"
      />
    </div>

    <template #body>
      <ul class=" space-y-2">
        <li
          v-for="network_ in networks"
          :key="network_">
            <UButton
              size="xl"
              variant="ghost" 
              class="cursor-pointer text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-neutral-900"
              :avatar="{ src: getNetworkImage(network_), alt: `${network_} logo`  }"
              :label="network_"
              :disabled="isNetworkDisabled(network_)"
              @click="handleSelect(network_)"
            />
        </li>
      </ul>
    </template>
  </UModal>
</template>