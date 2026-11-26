<script lang="ts">
    import type { CollectionEntry } from "astro:content";
    import PaginatedMaps from "./paginated-maps.svelte";
    import PaginationSearch from "./pagination-search.svelte";

    type Props = {
        placeholder: string;
        maps: CollectionEntry<"maps">[];
    };

    let { placeholder, maps }: Props = $props();
    let query = $state("");
</script>

<PaginationSearch bind:query={query} {placeholder} />
<PaginatedMaps {maps} query={query} />
