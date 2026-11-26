<script lang="ts">
    import type { CollectionEntry } from "astro:content";
    import PaginatedArticles from "./paginated-articles.svelte";
    import PaginationSearch from "./pagination-search.svelte";

    type Props = {
        placeholder: string;
        project: CollectionEntry<"projects">;
        articles: CollectionEntry<"articles">[];
        perPage?: number;
    };

    let { placeholder, project, articles, perPage }: Props = $props();
    let query = $state("");
</script>

<PaginationSearch bind:query={query} {placeholder} />
<PaginatedArticles {project} {articles} query={query} {perPage} />
