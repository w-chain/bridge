<script lang="ts" setup>
import { useBridgeStatesStore } from '~~/stores';

const bridgeStates = useBridgeStatesStore();
const isTestnet = useRuntimeConfig().public.network === 'testnet';

onMounted(async () => {
  if (import.meta.client) {
    bridgeStates.init(isTestnet);
  }
})
</script>

<template>
  <div class="mt-4 lg:mt-12 md:min-w-md md:max-w-md">
    <div class="flex justify-end py-4">
      <UButton
        variant="ghost"
        size="xl"
        icon="i-lucide-history"
        @click="navigateTo('/history')"
      />
    </div>
    
    <BridgeWrapper />
  </div>
</template>