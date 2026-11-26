<script lang="ts">
    import * as Item from "$lib/components/ui/item/index.js";
    import { Badge } from "$lib/components/ui/badge/index.js";
    import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
    import type { CollectionEntry } from "astro:content";
    import PaginatedItems from "./paginated-items.svelte";
    import { getTranslations } from "$lib/i18n";

    type ItemType = CollectionEntry<"articles">
    type Props = {
        project: CollectionEntry<"projects">;
        articles: ItemType[];
        perPage?: number;
        query?: string;
    };
    let { project, articles, perPage, query }: Props = $props();

    const translations = $derived(getTranslations(project.data.language));
</script>

<PaginatedItems
    items={query
        ? articles.filter((a) => {
              const q = query.toLowerCase();
              return (
                  a.data.title.toLowerCase().includes(q) ||
                  (a.data.aliases?.includes(q) ?? false)
              );
          })
        : articles}
    {perPage}
>
    {#snippet child(article: ItemType)}
        <Item.Root variant="outline">
            {#snippet child({ props })}
                <a href={`/${article.id}`} {...props}>
                    <Item.Content>
                        <Item.Title>{article.data.title}</Item.Title>
                        {#if article.data.meta?.type}
                            <Badge>
                                {translations.meta.types[article.data.meta.type]}
                            </Badge>
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
