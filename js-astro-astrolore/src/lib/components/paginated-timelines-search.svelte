<script lang="ts">
    import type { CollectionEntry } from "astro:content";
    import PaginatedTimelines from "./paginated-timelines.svelte";
    import PaginationSearch from "./pagination-search.svelte";

    type Props = {
        placeholder: string;
        timelines: CollectionEntry<"timelines">[];
    };

    let { placeholder, timelines }: Props = $props();
    let query = $state("");
</script>

<PaginationSearch bind:query={query} {placeholder} />
<PaginatedTimelines {timelines} query={query} />
