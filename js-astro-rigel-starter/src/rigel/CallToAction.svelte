<script lang="ts">
  import type { BlockData } from "@rigel-cms/rigel/extensions";
  let { data }: { data: BlockData } = $props();
</script>

<p class="call-to-action"><a href={String(data.href)}>{data.text}</a></p>

<style>
  .call-to-action { margin-block: 1.5rem; }
  a { display: inline-block; padding: 0.75rem 1.25rem; border-radius: 0.375rem; background: #164e63; color: white; font-weight: 600; text-decoration: none; }
  a:hover { background: #0e7490; }
</style>
