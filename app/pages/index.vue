<script lang="ts" setup>
import type { TabsItem } from '@nuxt/ui';

const route = useRoute();
const router = useRouter();

const activeTab = ref(route.query.tab?.toString() || 'bridge');

watch(activeTab, (newTab) => {
  router.push({ query: { ...route.query, tab: newTab } });
});

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

</script>

<template>
  <main class="flex flex-col items-center px-2 pt-16 gap-4 h-screen">
    <div class="lg:min-w-xl">
      <UTabs v-model="activeTab" :items="tabs" >
        <template #bridge>
          <BridgeQuoter />
        </template>
        <template #history>
          <h1>Here Lies History</h1>
        </template>
      </UTabs>
    </div>
  </main>
</template>
