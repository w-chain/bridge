<script lang="ts" setup>
import { getEnumValues } from '~~/shared/types';

const token = defineModel<Tokens>('token', { default: Tokens.USDT })
const open = ref(false);

const tokens = getEnumValues(Tokens) as Tokens[];
</script>

<template>
  <UModal 
    v-model:open="open" 
    title="Select Token" 
    description="Select the token you want to move from Source Chain."
    :ui="{ content: 'max-w-md' }"
  >
    <UButton
      variant="ghost" 
      :avatar="{ src: `/images/tokens/${token.toLowerCase()}.webp`, alt: `${token} logo`  }"
      :label="token"
      trailing-icon="i-lucide-chevron-down"
      class="text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700"
    />

    <template #body>
      <ul class="space-y-2">
        <li
          v-for="token_ in tokens"
          :key="token_">
            <UButton
              size="xl"
              variant="ghost" 
              class="cursor-pointer text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700"
              :avatar="{ src: `/images/tokens/${token_.toLowerCase()}.webp`, alt: `${token_} logo`  }"
              :label="token_"
              @click="token = token_; open = false"
            />
        </li>
      </ul>
    </template>
  </UModal>
</template>