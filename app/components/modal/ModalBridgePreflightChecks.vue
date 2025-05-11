<script lang="ts" setup>
import type { CheckboxGroupItem, CheckboxGroupValue } from '@nuxt/ui'
import { useBridgeContractStore } from '~~/stores';

const items = ref<CheckboxGroupItem[]>([
  {
    label: 'I acknowledge that the service will not store any of my funds on its platform.',
    value: 'acknowledgement'
  },
  {
    label: 'I understand that once the transaction submitted, it cannot be cancelled or reversed.',
    value: 'cancel'
  },
  {
    label: 'I understand that funds cannot be returned if they are sent to the wrong address.',
    value: 'wrong'
  },
  {
    label: 'I understand that the service is provided as-is and that I am responsible for any damages that may occur.',
    value: 'understand'
  }
]);

const value = ref<CheckboxGroupValue[]>([]);

const emit = defineEmits<{ close: [boolean] }>();

const bridgeStore = useBridgeContractStore();

function handleAgree() {
  bridgeStore.agreedToTerms = true;
  emit('close', true);
}
</script>

<template>
  <UModal 
    :close="{ onClick: () => emit('close', false) }"
    :title="`Service Acknowledgement`"
  >
    <template #body>
      <UCheckboxGroup v-model="value" :items="items" />
    </template>
    <template #footer>
      <div class="flex gap-4 ml-auto">
        <UButton
          variant="outline"
          color="error"
          @click="emit('close', false)"
        >
          Cancel
        </UButton>
        <UButton
          :disabled="value.length !== items.length"
          class="w-full"
          color="primary"
          @click="handleAgree"
        >
          Agree & Continue
        </UButton>
      </div>
    </template>
  </UModal>
</template>