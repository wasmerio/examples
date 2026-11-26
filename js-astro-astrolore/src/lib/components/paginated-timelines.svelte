<script lang="ts">
  import * as Item from "$lib/components/ui/item/index.js";
  import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
  import type { CollectionEntry } from "astro:content";
  import PaginatedItems from "./paginated-items.svelte";

  type ItemType = CollectionEntry<"timelines">;
  type Props = {
    timelines: CollectionEntry<"timelines">[];
    query?: string;
  };
  let { timelines, query }: Props = $props();
</script>

<PaginatedItems
  items={query
    ? timelines.filter((t) => {
        return (
          t.data.name?.toLowerCase().includes(query.toLowerCase()) ?? false
        );
      })
    : timelines}
>
  {#snippet child(timeline: ItemType)}
    <Item.Root variant="outline">
      {#snippet child({ props })}
        <a href={`/${timeline.id}`} {...props}>
          <Item.Content>
            <Item.Title class="flex flex-row">
              {timeline.data.name}
            </Item.Title>
            {#if timeline.data.description}
              <Item.Description>
                {timeline.data.description}
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
