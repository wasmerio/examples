<script setup lang="ts">
const count = ref(0);
</script>

<template>
  <span class="badge">Nuxt</span>
  <h1>Your Nuxt app is live on Wasmer Edge</h1>
  <p>
    <code>nuxt generate</code> prerenders every page to <code>.output/public</code>, and Wasmer Edge serves the result.
    Edit <code>app/pages/index.vue</code> and push to redeploy.
  </p>
  <ul>
    <li>Nuxt 4 with Vue 3 and TypeScript</li>
    <li>File-based routing in <code>app/pages/</code></li>
    <li>Vue reactivity still works in the browser</li>
  </ul>
  <div class="actions">
    <button type="button" @click="count++">Clicked {{ count }} {{ count === 1 ? "time" : "times" }}</button>
    <NuxtLink class="button secondary" to="/about">About this starter</NuxtLink>
  </div>
</template>
