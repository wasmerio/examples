<script setup lang="ts">
defineProps<{ count: number }>()
</script>

<template>
  <span id="nested-vue-count">Vue count {{ count }}</span>
</template>
