<script lang="ts">
    import * as Item from "$lib/components/ui/item/index.js";
    import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
    import type { CollectionEntry } from "astro:content";

    type Props = {
        article: CollectionEntry<"articles">;
        abstract: string | undefined;
    };

    let { article, abstract }: Props = $props();
</script>

<Item.Root variant="outline">
    {#snippet child({ props })}
        <a href={`/${article.id}`} {...props}>
            <Item.Content>
                <Item.Title>{article.data.title}</Item.Title>
                {#if abstract}
                    <Item.Description>{abstract}</Item.Description>
                {/if}
            </Item.Content>
            <Item.Actions>
                <ChevronRightIcon class="size-4" />
            </Item.Actions>
        </a>
    {/snippet}
</Item.Root>
