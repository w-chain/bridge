<script lang="ts" setup>
import type { TabsItem } from '@nuxt/ui';
import { useNetworkStore } from '~~/stores/Network';

const route = useRoute();
const router = useRouter();

const tabs: TabsItem[] = [
  {
    label: 'Bridge',
    icon: 'i-lucide-send',
    slot: 'bridge' as const,
    value: 'bridge'
  },
  {
    label: 'Tx History',
    icon: 'i-lucide-history',
    slot: 'history' as const,
    value: 'history'
  },
];
const activeTab = ref(route.query.tab?.toString() || 'bridge');

watch(activeTab, (newTab) => {
  if (newTab === 'history') {
    router.push({ query: { tab: newTab } });
  } else {
    router.push({ query: { ...route.query, tab: newTab } });
  }
});

watch(route, (newRoute) => {
  if (newRoute.query.tab?.toString() === 'history' && activeTab.value !== 'history') {
    activeTab.value = 'history';
  }
})


const networkStore = useNetworkStore();

</script>

<template>
  <main class="relative flex flex-col items-center px-2 pt-16 gap-4 h-screen">
    <div class="absolute top-2 right-2">
      <ConnectButton />
    </div>
    <div class="lg:min-w-xl">
      <UAlert v-if="!networkStore.isAllowedChain" class="my-2" title="Unsupported Network!" description="We currently only support W Chain and ETH" icon="i-lucide-triangle-alert" color="error" />
      <UTabs v-model="activeTab" :items="tabs" >
        <template #bridge>
          <BridgeQuoter />
        </template>
        <template #history>
          <BridgeHistory />
        </template>
      </UTabs>
    </div>
  </main>
</template>
