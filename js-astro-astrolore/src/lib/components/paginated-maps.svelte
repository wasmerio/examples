<script lang="ts">
  import * as Item from "$lib/components/ui/item/index.js";
  import type { CollectionEntry } from "astro:content";
  import PaginatedItems from "./paginated-items.svelte";
  import { ChevronRightIcon } from "@lucide/svelte";

  type ItemType = CollectionEntry<"maps">;
  type Props = {
    maps: ItemType[];
    query?: string;
  };
  let { maps, query }: Props = $props();
</script>

<PaginatedItems
  items={query
    ? maps.filter((m) => {
        const q = query.toLowerCase();
        return (
          (m.data.name?.toLowerCase().includes(q) ?? false) ||
          (m.data.description?.toLowerCase().includes(q) ?? false)
        );
      })
    : maps}
>
  {#snippet child(map: ItemType)}
    <Item.Root variant="outline">
      {#snippet child({ props })}
        <a href={`/${map.id}`} {...props}>
          <Item.Content>
            <Item.Title class="flex flex-row">
              {map.data.name}
            </Item.Title>
            {#if map.data.description}
              <Item.Description>
                {map.data.description}
              </Item.Description>
            {/if}
          </Item.Content>
          <Item.Actions>
            <ChevronRightIcon class="size-4" />
          </Item.Actions>
        </a>
      {/snippet}
    </Item.Root>
  {/snippet}
</PaginatedItems>
