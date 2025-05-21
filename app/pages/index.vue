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
const { isTestnetDomain } = useDomain();
const { addWChainTestnet, addWChainMainnet } = useAddNetwork();

const domainAlertDesciption = computed(() => {
  if (isTestnetDomain.value) {
    return 'This is a Testnet domain. Only W Chain Testnet and ETH Sepolia are supported.'
  } else {
    return 'This Bridge currently only support W Chain and ETH, please make sure you have the networks RPC settings.'}
});

const alertActions = computed(() => {
  if (isTestnetDomain.value) {
    return [{
      label: 'Add W Chain Testnet RPC',
      click: () => addWChainTestnet()
    }]
  } else {
    return [{
      label: 'Add W Chain Mainnet RPC',
      click: () => addWChainMainnet()
    }]
  }
});

</script>

<template>
  <main class="relative flex flex-col items-center px-2 pt-16 gap-4 h-screen">
    <TopNavBar />
    <div class="mt-4 lg:mt-8 lg:min-w-lg lg:max-w-lg">
      <UAlert v-if="!networkStore.isAllowedChain" class="my-2" title="Unsupported Network!" :description="domainAlertDesciption" icon="i-lucide-triangle-alert" color="error" :actions="alertActions" />
      <UTabs v-else v-model="activeTab" :items="tabs" >
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
