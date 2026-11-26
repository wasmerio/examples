<script lang="ts">
  import type { ExtensionBlockProps } from "@rigel-cms/rigel/extensions";
  import Callout from "./Callout.svelte";
  let { data, onchange }: ExtensionBlockProps = $props();
</script>

<div class="callout-editor">
  <label>Title <input aria-label="Callout title" maxlength="140" value={String(data.title)} oninput={event => onchange({ ...data, title: event.currentTarget.value })} /></label>
  <label>Message <textarea aria-label="Callout message" maxlength="2000" rows="3" value={String(data.message)} oninput={event => onchange({ ...data, message: event.currentTarget.value })}></textarea></label>
  <label>Tone <select aria-label="Callout tone" value={String(data.tone)} onchange={event => onchange({ ...data, tone: event.currentTarget.value })}><option value="info">Info</option><option value="warning">Warning</option></select></label>
  <Callout {data} />
</div>

<style>
  .callout-editor { display: grid; gap: 0.75rem; padding: 1rem; border: 1px solid #94a3b8; }
  label { display: grid; gap: 0.375rem; font: 0.875rem/1.5 system-ui; }
  input, textarea, select { width: 100%; box-sizing: border-box; padding: 0.5rem; color: inherit; background: transparent; border: 1px solid #94a3b8; font: inherit; }
</style>
