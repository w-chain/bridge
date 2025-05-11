<script lang="ts" setup>
const props = defineProps<{ direction: 'from' | 'to' }>();

const network = defineModel<Networks>('network', { default: Networks.ETH });
const open = ref(false);

const networks = getEnumValues(Networks) as Networks[];
</script>

<template>
  <UModal 
    v-model:open="open" 
    title="Select Token" 
    description="Select the token you want to move from Source Chain."
    :ui="{ content: 'max-w-md' }"
  >
    <UButton
      :class="[props.direction === 'from' ? 'bg-gray-100 dark:bg-neutral-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-neutral-700' : 'bg-blue-100 dark:bg-blue-800/70 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700']"
      :label="`${props.direction.charAt(0).toUpperCase() + props.direction.slice(1)}: ${network.toUpperCase()}`"
      trailing-icon="i-lucide-chevron-down"
    />

    <template #body>
      <ul class=" space-y-2">
        <li
          v-for="network_ in networks"
          :key="network_">
            <UButton
              size="xl"
              variant="ghost" 
              class="cursor-pointer text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700"
              :avatar="{ src: `/images/networks/${network_}.webp`, alt: `${network_} logo`  }"
              :label="network_"
              :disabled="network === network_"
              @click="network = network_; open = false"
            />
        </li>
      </ul>
    </template>
  </UModal>
</template>