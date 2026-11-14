<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps<{ error: NuxtError }>();
const notFound = computed(() => props.error.statusCode === 404);
</script>

<template>
  <wasmer-starter>
    <wasmer-card>
      <wasmer-stack slot="header" vertical>
        <wasmer-badge>Nuxt</wasmer-badge>
        <wasmer-title>{{ notFound ? "Page not found" : "This page couldn't load" }}</wasmer-title>
      </wasmer-stack>
      <wasmer-text>
        {{ notFound ? "Check the address or return to the homepage." : "Try again, or return to the homepage." }}
      </wasmer-text>
      <wasmer-stack><wasmer-action href="/">Back home</wasmer-action></wasmer-stack>
      <wasmer-text slot="footer">Nuxt starter for Wasmer Edge</wasmer-text>
    </wasmer-card>
  </wasmer-starter>
</template>
