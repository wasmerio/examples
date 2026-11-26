<script setup lang="ts">
import { ref } from 'vue'
import CounterLabel from './CounterLabel.vue'

const count = ref(0)
</script>

<template>
  <button id="embedded-vue-count" type="button" @click="count += 1">
    <CounterLabel :count="count" />
  </button>
</template>

<style scoped>
button {
  padding: 8px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
}
</style>
