<script lang="ts">
    import type { CollectionEntry } from "astro:content";
    import PaginatedItems from "./paginated-items.svelte";
    import BinderTable from "./binder-table.svelte";

    type ItemType = CollectionEntry<"tables">
    type Props = {
        tables: ItemType[];
        perPage?: number;
        query?: string;
    };
    let { tables, perPage, query }: Props = $props();
</script>

<PaginatedItems
    items={query
        ? tables.filter((t) => {
              const q = query.toLowerCase();
              return (
                  t.data.title.toLowerCase().includes(q)
                  || t.data.tags?.some(tag => tag.toLowerCase().includes(q))
              );
          })
        : tables}
    {perPage}
    class="columns lg:columns-2"
>
    {#snippet child(item: ItemType)}
        <BinderTable table={item.data} />
    {/snippet}
</PaginatedItems>
