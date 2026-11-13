<script setup lang="ts">
useHead({ title: "About · Nuxt on Wasmer Edge" });
</script>

<template>
  <span class="badge">Nuxt</span>
  <h1>About this starter</h1>
  <p>Every <code>.vue</code> file in <code>app/pages/</code> becomes a route. This page lives at <code>app/pages/about.vue</code>.</p>
  <div class="actions">
    <NuxtLink class="button secondary" to="/">Back home</NuxtLink>
    <a class="button secondary" href="https://docs.wasmer.io/edge" target="_blank" rel="noreferrer">Wasmer Edge docs</a>
  </div>
</template>
