<script lang="ts" setup>
import type Token from '~~/shared/objects/token';
import { formatBalance, roundDownLastDecimal } from '~~/shared/utils';

const props = defineProps<{
  token: Token,
  amount: number | undefined
}>();

const emit = defineEmits<{
  (e: 'max', amount: number): void
}>();

const tokenRef = toRef(props, 'token');
const { balance, isLoading } = useTokenBalance(tokenRef);

const handleMax = () => {
  emit('max', roundDownLastDecimal(balance.value));
};

watch(() => props.amount, amount => {
  if (amount && amount > balance.value) {
    emit('max', roundDownLastDecimal(balance.value));
  }
})

</script>

<template>
  <div class="pr-2">
    <USkeleton v-if="isLoading" class="w-24 h-4" />
    <div v-else class="text-xs flex items-center gap-1 text-gray-600 dark:text-gray-300 text-right text-nowrap">
      <UButton 
        variant="outline"
        size="xs"
        :ui="{ label: 'text-[8px]' }"
        label="MAX"
        @click="handleMax"
      />
      Balance: {{ formatBalance(balance) }}
    </div>
  </div>
</template>