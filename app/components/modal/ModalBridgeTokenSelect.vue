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
      :avatar="{ src: `/images/tokens/${token}.webp`, alt: `${token} logo`  }"
      :label="token"
      trailing-icon="i-lucide-chevron-down"
    />

    <template #body>
      <ul>
        <li
          v-for="token_ in tokens"
          :key="token_">
            <UButton
              size="xl"
              variant="ghost" 
              class="cursor-pointer"
              :avatar="{ src: `/images/tokens/${token_}.webp`, alt: `${token_} logo`  }"
              :label="token_"
              @click="token = token_; open = false"
            />
        </li>
      </ul>
    </template>
  </UModal>
</template>