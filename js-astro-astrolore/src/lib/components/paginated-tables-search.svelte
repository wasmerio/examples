<script lang="ts">
    import type { CollectionEntry } from "astro:content";
    import PaginatedTables from "./paginated-tables.svelte";
    import PaginationSearch from "./pagination-search.svelte";

    type Props = {
        placeholder: string;
        tables: CollectionEntry<"tables">[];
        perPage?: number;
    };

    let { placeholder, tables, perPage }: Props = $props();
    let query = $state("");
</script>

<PaginationSearch bind:query={query} {placeholder} />
<PaginatedTables {tables} {perPage} query={query} />
