<script setup lang="ts">
useHead({ title: "About · Nuxt on Wasmer Edge" });
</script>

<template>
  <wasmer-stack slot="header" vertical>
    <wasmer-badge>Nuxt</wasmer-badge>
    <wasmer-title>About this starter</wasmer-title>
  </wasmer-stack>
  <wasmer-text>Every <code>.vue</code> file in <code>app/pages/</code> becomes a route. This page lives at <code>app/pages/about.vue</code>.</wasmer-text>
  <wasmer-stack>
    <wasmer-action variant="outline" href="/">Back home</wasmer-action>
    <wasmer-action variant="outline" href="https://docs.wasmer.io/edge" target="_blank">Wasmer Edge docs</wasmer-action>
  </wasmer-stack>
</template>
