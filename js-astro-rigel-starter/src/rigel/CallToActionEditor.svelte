<script lang="ts">
  import type { ExtensionBlockProps } from "@rigel-cms/rigel/extensions";
  import CallToAction from "./CallToAction.svelte";
  let { data, onchange }: ExtensionBlockProps = $props();
</script>

<div class="cta-editor">
  <label>Button text <input aria-label="CTA text" value={String(data.text)} oninput={event => onchange({ ...data, text: event.currentTarget.value })} /></label>
  <label>Destination <input aria-label="CTA destination" value={String(data.href)} oninput={event => onchange({ ...data, href: event.currentTarget.value })} /></label>
  <CallToAction {data} />
</div>

<style>
  .cta-editor { display: grid; gap: 0.75rem; padding: 1rem; border: 1px solid #94a3b8; }
  label { display: grid; gap: 0.375rem; font: 0.875rem/1.5 system-ui; }
  input { width: 100%; box-sizing: border-box; padding: 0.5rem; color: inherit; background: transparent; border: 1px solid #94a3b8; font: inherit; }
</style>
