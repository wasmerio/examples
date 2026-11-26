<script lang="ts">
    import * as Item from "$lib/components/ui/item/index.js";
    import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
    import type { CollectionEntry } from "astro:content";
    import PaginatedItems from "./paginated-items.svelte";
    import { getImageSrc } from "$lib/content-utils";

    type ItemType = CollectionEntry<"statblocks">;
    type Props = {
        statblocks: ItemType[];
        query?: string;
    };
    let { statblocks, query }: Props = $props();
</script>

<PaginatedItems
    items={query
        ? statblocks.filter((d) => {
              return (
                  d.data.name?.toLowerCase().includes(query.toLowerCase()) ??
                  false
              );
          })
        : statblocks}
>
    {#snippet child(statblock: ItemType)}
        <Item.Root variant="outline">
            {#snippet child({ props })}
                <a href={`/${statblock.id}`} {...props}>
                    {#if statblock.data.image}
                        <Item.Media variant="image">
                            <img
                                src={getImageSrc(statblock.data.image)}
                                alt={statblock.data.name}
                                width="32"
                                height="32"
                                class="size-8 rounded object-cover"
                            />
                        </Item.Media>
                    {/if}
                    <Item.Content>
                        <Item.Title class="flex flex-row">
                            <span class="line-clamp-1"
                                >{statblock.data.name}</span
                            >
                        </Item.Title>
                        {#if statblock.data.description}
                            <Item.Description
                                >{statblock.data.description}</Item.Description
                            >
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
