<script lang="ts" setup>
import { useBridgeStatesStore } from '~~/stores';

const { swapNetworks } = useBridgeStatesStore();

</script>

<template>
  <div class="grid grid-cols-7 gap-0 w-full">
    <ModalBridgeNetworkSelect class="col-span-3" direction="from" />
    <div class="flex flex-col items-center justify-center">
      <UButton
        variant="ghost"
        square
        class="mt-4 hover:rotate-180 transition-transform duration-300 cursor-pointer"
        icon="i-lucide-arrow-right-left"
        @click="swapNetworks"
      />
    </div>
    <ModalBridgeNetworkSelect class="col-span-3" direction="to" />
  </div>
</template>