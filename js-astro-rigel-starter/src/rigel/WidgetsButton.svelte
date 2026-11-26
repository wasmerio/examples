<script lang="ts">
  import type { ExtensionButtonProps } from "@rigel-cms/rigel/extensions";
  let { label, disabled, onclick }: ExtensionButtonProps = $props();
</script>

<button type="button" {disabled} {onclick} aria-label={label} data-tooltip={label} onpointerdown={event => event.preventDefault()}>
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
</button>
