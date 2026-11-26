<script lang="ts">
  import * as Item from "$lib/components/ui/item/index.js";
  import type { CollectionEntry } from "astro:content";
  import PaginatedItems from "./paginated-items.svelte";
  import { PaperclipIcon } from "@lucide/svelte";
  import HandoutKindIcon from "./handout-kind-icon.svelte";

  type Props = {
    handouts: (CollectionEntry<"handouts"> & { url: string })[];
    query?: string;
  };
  let { handouts, query }: Props = $props();
</script>

<PaginatedItems
  items={query ? handouts.filter((h) => {
    let q = query.toLowerCase();
    return (
      h.data.title.toLowerCase().includes(q) ||
      h.data.description?.toLowerCase().includes(q)
    );
  }) : handouts}
>
  {#snippet child(handout: any)}
      <Item.Root variant="outline">
        {#snippet child({ props })}
          <a href={handout.url} target="_blank" {...props}>
            <Item.Media>
              <HandoutKindIcon kind={handout.data.kind} class="size-4" />
            </Item.Media>
            <Item.Content>
              <Item.Title>{handout.data.title}</Item.Title>
              {#if handout.data.description}
                <Item.Description>{handout.data.description}</Item.Description>
              {/if}
            </Item.Content>
            <Item.Actions>
              <PaperclipIcon class="size-4" />
            </Item.Actions>
          </a>
        {/snippet}
      </Item.Root>
  {/snippet}
</PaginatedItems>
