<script lang="ts" setup>

</script>

<template>
  <div class="absolute top-1 left-1 flex justify-between items-center px-4 py-2 w-full">
    <nav class="flex items-center gap-8">
      <NuxtLink to="/" class="flex items-center gap-2">
        <img src="/apple-touch-icon.png" alt="logo" class="size-10">
        <span class="text-base font-bold lg:text-lg text-transparent bg-clip-text bg-gradient-to-b from-blue-300 via-blue-500 to-blue-800">BRIDGE</span>
      </NuxtLink>
      <NuxtLink class="hidden lg:block" to="https://legacy-bridge.w-chain.com/bridge" external target="_blank">WCO Bridge <UIcon name="i-lucide-square-arrow-out-up-right" /></NuxtLink>
      <NuxtLink class="hidden lg:block" to="https://legacy-bridge.w-chain.com/migration" external target="_blank">WCO Migration <UIcon name="i-lucide-square-arrow-out-up-right" /></NuxtLink>
    </nav>
    <div class="flex gap-2 items-center">
      <ColorModeButton />
      <ConnectButton />
    </div>
  </div>
</template>