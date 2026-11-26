<script lang="ts">
    import * as Table from "$lib/components/ui/table/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import { Badge } from "$lib/components/ui/badge";
    import type { TableData, TableItem } from "$lib/schema/binder-table";
    import { DicesIcon } from "@lucide/svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import { cn } from "$lib/utils";

    type Props = {
        table: TableData;
        class?: string;
        hideTags?: boolean;
    };
    const { table, class: className, hideTags }: Props = $props();
    const { title, caption, tags, header, items } = $derived(table);

    type Row = {
        label: string;
        value: string;
        start: number;
        end: number;
    };
    function buildRows(items: TableItem[]) {
        const rows: Row[] = [];
        let start = 1;
        for (let i = 0; i < items.length; i++) {
            const end = start + items[i].weight - 1;

            rows.push({
                label: start == end ? `${start}` : `${start}-${end}`,
                value: items[i].value,
                start: start,
                end: end,
            });

            start = end + 1;
        }
        return rows;
    }

    const total = $derived(
        items.reduce((prev, curr) => (prev += curr.weight), 0),
    );
    let rows = $derived(buildRows(items));

    let selected: number | null = $state(null);
    function roll() {
        selected = 1 + Math.floor(Math.random() * total);
    }
    function isSelected(row: Row) {
        return selected && selected >= row.start && selected <= row.end;
    }
</script>

<Card.Root class={cn("gap-0", className)}>
    <Card.Header>
        <Card.Title>
            {title}
        </Card.Title>
        <Card.Action class="my-0 py-0">
            <Button variant="default" onclick={roll}>
                <DicesIcon />
                Roll
                {#if selected}
                    ({selected})
                {/if}
            </Button>
        </Card.Action>
    </Card.Header>
    <Card.Content>
        <Table.Root>
            <Table.Caption class="text-xs mt-2">
                {caption}
            </Table.Caption>
            <Table.Header>
                <Table.Row class="">
                    <Table.Head class="w-auto text-end h-8">
                        d{total}
                    </Table.Head>
                    <Table.Head class="w-full h-8">{header}</Table.Head>
                </Table.Row>
            </Table.Header>
            <Table.Body class="max-h-[400px]">
                {#each rows as row}
                    <Table.Row
                        data-selected={isSelected(row)}
                        class="data-[selected=true]:bg-muted/80 transition-colors duration-300"
                    >
                        <Table.Cell class="font-medium text-end py-1"
                            >{row.label}</Table.Cell
                        >
                        <Table.Cell class="py-1">{row.value}</Table.Cell>
                    </Table.Row>
                {/each}
            </Table.Body>
        </Table.Root>
        {#if !hideTags}
            <div class="flex flex-row flew-wrap gap-2 mt-2">
                {#each tags as tag}
                    <Badge>{tag}</Badge>
                {/each}
            </div>
        {/if}
    </Card.Content>
</Card.Root>
