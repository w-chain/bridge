<script lang="ts" setup>
const router = useRouter();
const handleNavigateToBridge = () => {
  router.push({ path: '/', replace: true });
}
</script>

<template>
  <div class="mt-4 lg:mt-12 lg:min-w-lg lg:max-w-lg px-2">
    <div class="flex justify-end py-4">
      <UButton
        variant="ghost"
        size="xl"
        icon="i-lucide-send"
        @click="handleNavigateToBridge"
      />
    </div>
    
    <BridgeHistory />
  </div>
</template>