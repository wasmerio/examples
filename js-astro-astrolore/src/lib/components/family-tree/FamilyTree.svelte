<script lang="ts">
    import * as f3 from "family-chart";
    import "family-chart/styles/family-chart.css";
    import { cn } from "$lib/utils";
    import { onMount } from "svelte";

    type Props = {
        persons: f3.Datum[];
        class?: string;
    };
    let { persons, class: className }: Props = $props();

    let container: HTMLElement;

    function cardHtml(d: f3.TreeDatum): string {
        const name: string = d.data.data.name ?? "";
        const avatar: string | undefined = d.data.data.avatar;
        const birth: string | undefined = d.data.data.birth;
        const death: string | undefined = d.data.data.death;

        const avatarHtml = avatar
            ? `<img src="${avatar}" class="w-12 h-12 rounded-md object-cover shrink-0" />`
            : `<div class="w-12 h-12 rounded-md bg-muted"></div>`;

        const birthHtml =
            birth || death
                ? `<div class="text-sm overflow-hidden line-clamp-1">${birth ?? ""} - ${death ?? ""}</div>`
                : ``;

        return `<div class="card-inner bg-card text-card-foreground rounded-md border-border-1 flex items-center gap-2.5 px-3 py-2.5 overflow-hidden pointer-cursor"
        >
            ${avatarHtml}
            <div class="flex-1 overflow-hidden">
                <div class="text-sm overflow-hidden line-clamp-2">${name}</div>
                ${birthHtml}
            </div>
        </div>`;
    }

    onMount(() => {
        if (!container || persons.length === 0) return;

        const chart = f3
            .createChart("#FamilyChart", persons as f3.Data)
            .setTransitionTime(500)
            .setSingleParentEmptyCard(false)
            .setShowSiblingsOfMain(true);
        chart
            .setCardHtml()
            .setCardDim({ w: 160, h: 64 })
            .setMiniTree(false)
            .setCardInnerHtmlCreator(cardHtml)
            .setOnCardClick((_e: any, d: any) => {
                chart.updateMainId(d.data.id);
                chart.updateTree({});
            })
            .setOnHoverPathToMain();
        chart.updateTree({ initial: true });
    });
</script>

<div
    id="FamilyChart"
    bind:this={container}
    class={cn("f3 w-full aspect-16/9 bg-muted rounded-lg", className)}
    style="--background-color:var(--muted); --text-color:var(--foreground); --female-color:var(--card); --male-color:var(--card); --genderless-color:var(--card); font-family:'Space Grotesk Variable'"
></div>

<style>
    /* override default white outline on the main/active card */
    :global(.f3 .card-inner) {
        box-shadow: none !important;
    }
    :global(.f3 div.card-main .card-inner) {
        font-weight: 500;
        outline: 1px solid var(--foreground) !important;
        box-shadow: none !important;
    }
    :global(.f3 div.card-inner.f3-path-to-main) {
        outline: 2px solid var(--foreground) !important;
    }
    :global(.f3 .link) {
        stroke: var(--foreground);
    }
</style>
