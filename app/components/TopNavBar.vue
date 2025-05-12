<script lang="ts" setup>

</script>

<template>
  <div class="absolute top-1 left-1 flex justify-between items-center px-4 py-2 w-full">
    <nav class="flex items-center gap-8">
      <NuxtLink to="/" class="flex items-center gap-2">
        <img src="/apple-touch-icon.png" alt="logo" class="size-10">
        <span class="text-xl font-semibold">W Bridge</span>
      </NuxtLink>
      <NuxtLink to="https://legacy-bridge.w-chain.com/bridge" external target="_blank">WCO Bridge <UIcon name="i-lucide-square-arrow-out-up-right" /></NuxtLink>
      <NuxtLink to="https://legacy-bridge.w-chain.com/migration" external target="_blank">WCO Migration <UIcon name="i-lucide-square-arrow-out-up-right" /></NuxtLink>
    </nav>
    <div class="flex gap-2 items-center">
      <ColorModeButton />
      <ConnectButton />
    </div>
  </div>
</template>