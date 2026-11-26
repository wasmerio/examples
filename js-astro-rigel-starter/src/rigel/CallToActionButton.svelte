<script lang="ts">
  import type { ExtensionButtonProps } from "@rigel-cms/rigel/extensions";
  let { label, disabled, onclick }: ExtensionButtonProps = $props();
</script>

<button type="button" aria-label={label} data-tooltip={label} {disabled} {onclick} onpointerdown={event => event.preventDefault()}>
  <span aria-hidden="true">CTA</span>
</button>
