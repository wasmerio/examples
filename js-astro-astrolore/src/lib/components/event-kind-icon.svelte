<script lang="ts">
    import type { HistoricKind } from "$lib/schema/codex-article";
    import { Castle, ChessQueen, Circle, Swords, Leaf, MoonStar } from "@lucide/svelte";

    type Props = {
      kind?: HistoricKind,
      class?: string,
    }
    const { kind, class: className }: Props = $props();
</script>

{#if kind === "celestial"}
  <MoonStar class={className} />
{:else if kind === "natural"}
  <Leaf class={className} />
{:else if kind === "settlement"}
  <Castle class={className} />
{:else if kind === "political"}
  <ChessQueen class={className} />
{:else if kind === "conflict"}
  <Swords class={className} />
{:else}
  <Circle class={className} />
{/if}
