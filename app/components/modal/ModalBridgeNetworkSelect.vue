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
      :class="props.direction === 'from'? 'bg-neutral-400' : 'bg-blue-400'"
      :label="`${props.direction.charAt(0).toUpperCase() + props.direction.slice(1)}: ${network.toUpperCase()}`"
      trailing-icon="i-lucide-chevron-down"
    />

    <template #body>
      <ul>
        <li
          v-for="network_ in networks"
          :key="network_">
            <UButton
              size="xl"
              variant="ghost" 
              class="cursor-pointer"
              :avatar="{ src: `/images/networks/${network_}.webp`, alt: `${network_} logo`  }"
              :label="network_.toUpperCase()"
              :disabled="network === network_"
              @click="network = network_; open = false"
            />
        </li>
      </ul>
    </template>
  </UModal>
</template>