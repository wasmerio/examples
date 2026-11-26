<script lang="ts">
    import * as Item from "$lib/components/ui/item/index.js";
    import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
    import type { CollectionEntry } from "astro:content";
    import PaginatedItems from "./paginated-items.svelte";
    import DocumentKindIcon from "./document-kind-icon.svelte";

    type Props = {
        documents: CollectionEntry<"documents">[];
        query?: string;
    };
    let { documents, query }: Props = $props();
</script>

<PaginatedItems
    items={query
        ? documents.filter((d) => {
              return (
                  d.data.title?.toLowerCase().includes(query.toLowerCase()) ??
                  false
              );
          })
        : documents}
>
    {#snippet child(document: any)}
        <Item.Root variant="outline">
            {#snippet child({ props })}
                <a href={`/${document.id}`} {...props}>
                    <Item.Media>
                        <DocumentKindIcon kind={document.data.kind} class="size-4" />
                    </Item.Media>
                    <Item.Content>
                        <Item.Title class="flex flex-row">
                            <span class="line-clamp-1"
                                >{document.data.title}</span
                            >
                            {#if document.data.author}
                                <span class="text-muted-foreground"
                                    >by {document.data.author}</span
                                >
                            {/if}
                        </Item.Title>
                        {#if document.data.description}
                            <Item.Description
                                >{document.data.description}</Item.Description
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
