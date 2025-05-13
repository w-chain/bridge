<script lang="ts" setup>
import { useClipboard } from '@vueuse/core'
import { useTokenStore } from '~~/stores';

const props = defineProps<{
  tokenAddress: string,
  toChainId: number,
}>();

const { copy, copied } = useClipboard({ source: () => props.tokenAddress })

const tokenStore = useTokenStore();
const token = computed(() => {
  return tokenStore.getTokenByAddress(props.tokenAddress);
});
const open = ref(false);

async function triggerAddToken() {
  if (token.value) {
    await useAddToken(token.value.address, token.value.symbol, token.value.decimals, props.toChainId);
  }
}

watch(open, newVal => {
  if (newVal) triggerAddToken()
})

</script>

<template>
  <UModal
    v-model:open="open" 
    title="Add Token Data" 
    description="Your wallet will be automatically add the token data to your wallet. In case it's not working, please input the data manually:"
  >
    <UButton variant="soft" size="sm" trailing-icon="i-lucide-wallet" >Add Token →</UButton>
    <template #body>
      <div class="grid grid-cols-4 gap-2 text-sm font-extralight font-sans">
        <div>Address: </div>
        <div class="col-span-3 underline cursor-pointer text-nowrap tracking-tighter" @click="copy()">{{ token?.address }} <UBadge variant="outline" size="sm" v-if="copied">Copied!</UBadge> <UIcon v-else name="i-lucide-copy" /></div>
        <div>Symbol: </div>
        <div class="col-span-3">{{ token?.symbol }}</div>
        <div>Decimals: </div>
        <div class="col-span-3">{{ token?.decimals }}</div>
        <div>Network: </div>
        <div class="col-span-3">{{ getNetworkFromChainId(toChainId) }}</div>
      </div>
    </template>
  </UModal>
</template>