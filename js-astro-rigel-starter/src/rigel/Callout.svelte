<script lang="ts">
  import type { BlockData } from "@rigel-cms/rigel/extensions";
  let { data }: { data: BlockData } = $props();
</script>

<aside class="article-callout" class:warning={data.tone === "warning"}>
  {#if data.title}<strong>{data.title}</strong>{/if}
  <p>{data.message}</p>
</aside>

<style>
  .article-callout { padding: 1rem; border: 1px solid currentColor; border-inline-start-width: 4px; }
  .warning { border-color: #b45309; }
  p { margin: 0.5rem 0 0; white-space: pre-wrap; }
</style>
