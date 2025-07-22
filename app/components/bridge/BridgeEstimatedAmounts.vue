<script lang="ts" setup>
defineProps({
  amount: {
    type: Number,
    required: true
  },
  fee: {
    type: String,
    required: true
  },
  tokenSymbol: {
    type: String,
    required: true
  },
  currency: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="py-4 px-8">
    <div class="grid grid-cols-2 gap-2">
      <div>You will receive:</div>
      <div class="text-right">{{ amount }} {{ tokenSymbol }}</div>
      <div>Estimated Fee:</div>
      <div class="text-right">{{ fee }} {{ currency }}</div>
      <div>Estimated Time:</div>
      <div class="text-right">~10 minutes</div>
    </div>
  </div>
</template>