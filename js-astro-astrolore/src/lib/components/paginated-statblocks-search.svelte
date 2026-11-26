<script lang="ts">
    import type { CollectionEntry } from "astro:content";
    import PaginationSearch from "./pagination-search.svelte";
    import PaginatedStatblocks from "./paginated-statblocks.svelte";

    type Props = {
        placeholder: string;
        statblocks: CollectionEntry<"statblocks">[];
    };

    let { placeholder, statblocks }: Props = $props();
    let query = $state("");
</script>

<PaginationSearch bind:query={query} {placeholder} />
<PaginatedStatblocks {statblocks} query={query} />
