<script setup lang="ts">
const count = ref(0);
</script>

<template>
  <wasmer-stack slot="header" vertical>
    <wasmer-badge>Nuxt</wasmer-badge>
    <wasmer-title>Your Nuxt app is live on Wasmer Edge</wasmer-title>
  </wasmer-stack>
  <wasmer-text>
    <code>nuxt generate</code> prerenders every page to <code>.output/public</code>, and Wasmer Edge serves the result.
    Edit <code>app/pages/index.vue</code> and push to redeploy.
  </wasmer-text>
  <ul>
    <li>Nuxt 4 with Vue 3 and TypeScript</li>
    <li>File-based routing in <code>app/pages/</code></li>
    <li>Vue reactivity still works in the browser</li>
  </ul>
  <wasmer-stack>
    <wasmer-action type="button" @click="count++">Clicked {{ count }} {{ count === 1 ? "time" : "times" }}</wasmer-action>
    <wasmer-action variant="outline" href="/about/">About this starter</wasmer-action>
  </wasmer-stack>
</template>
