<script lang="ts" setup>
import { useVueDapp } from '@vue-dapp/core';
import type { ConnectorName, ConnectOptions } from '@vue-dapp/core';

const { wallet, connectTo, isConnected, providerDetails, disconnect, chainId } =
	useVueDapp();

const emit = defineEmits<{ close: [boolean] }>()

const toast = useToast();

async function onClickWallet<T extends ConnectorName>(connName: T, options?: ConnectOptions<T>) {
	try {
		await connectTo<ConnectorName>(connName, options);
		emit('close', true);
	} catch (err) {
		toast.add({ title: 'Failed to connect', description: String(err), color: 'error'});
	}
}

const isNoWalletFound = computed(() => providerDetails.value.length === 0);
const networkImage = computed(() => chainId.value ? useNetworkLogo(chainId.value) : '');

const onDisconnect = () => {
  emit('close', true);
  disconnect();
}

</script>

<template>
  <UModal
    :close="{ onClick: () => emit('close', false) }"
    :ui="{ content:'max-w-md'  }"
    title="Connect Wallet"
    description="Click on the Wallet app you want to use."
  >
    <template #body>
      <div v-if="!isConnected" class="space-y-4 px-4 py-8" >
        <div class="grid grid-cols-1 gap-4 px-4">
          <UButton
            v-for="detail in providerDetails"
            :key="detail.info.uuid"
            :avatar="{ src: detail.info.icon, alt: detail.info.name }"
            variant="soft"
            size="xl"
            :label="detail.info.name"
            @click="
              onClickWallet('BrowserWallet', {
                target: 'rdns',
                rdns: detail.info.rdns,
              })
            "
          />
        </div>
      </div>

      <div v-else class="space-y-4 px-4 py-8">
        <img v-if="networkImage !== ''" :src="networkImage" alt="network logo" class="w-6 mx-auto" />
        <div class="text-xs sm:text-md sm:font-medium text-center">{{ wallet.address }}</div>
        <div class="flex justify-between">
          <div class="text-sm text-muted">Connected</div>
          <UButton variant="outline" color="error" label="Disconnect" @click="onDisconnect" />
        </div>
      </div>

      <div v-if="isNoWalletFound" class="flex justify-center items-center">No wallet installed in this browser</div>
    </template>
  </UModal>
</template>