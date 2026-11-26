<script lang="ts">
    import type { CollectionEntry } from "astro:content";
    import PaginatedDocuments from "./paginated-documents.svelte";
    import PaginationSearch from "./pagination-search.svelte";

    type Props = {
        placeholder: string;
        documents: CollectionEntry<"documents">[];
    };

    let { placeholder, documents }: Props = $props();
    let query = $state("");
</script>

<PaginationSearch bind:query={query} {placeholder} />
<PaginatedDocuments {documents} query={query} />
