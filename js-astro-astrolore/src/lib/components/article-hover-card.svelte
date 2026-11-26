<script lang="ts">
  import * as HoverCard from "$lib/components/ui/hover-card/index.js";
    import type { CollectionEntry } from "astro:content";

  type Props = {
    article: CollectionEntry<"articles"> | undefined,
    abstract: string,
    children: any,
  }
  const { article, abstract, children }: Props = $props();
</script>

{#if article}
<HoverCard.Root>
  <HoverCard.Trigger>
    {@render children?.()}
  </HoverCard.Trigger>
  <HoverCard.Content class="w-80">
    <div>
      <span class="text-sm font-semibold">{article.data.title}</span>
      <p class="text-sm text-foreground-text">{abstract}</p>
    </div>
  </HoverCard.Content>
</HoverCard.Root>
{:else}
  {@render children?.()}
{/if}
