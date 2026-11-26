<script lang="ts">
    import type { CollectionEntry } from "astro:content";
    import PaginatedHandouts from "./paginated-handouts.svelte";
    import PaginationSearch from "./pagination-search.svelte";

    type Props = {
        placeholder: string;
        handouts: (CollectionEntry<"handouts"> & { url: string })[];
    };

    let { placeholder, handouts }: Props = $props();
    let query = $state("");
</script>

<PaginationSearch bind:query={query} {placeholder} />
<PaginatedHandouts {handouts} query={query} />
