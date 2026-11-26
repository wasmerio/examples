<script lang="ts">
    import type { DocumentKind } from "$lib/schema/codex-document";
    import { FileTextIcon, BookOpenIcon, ScrollTextIcon } from "@lucide/svelte";

    type Props = {
        kind?: DocumentKind;
        class?: string;
    };
    const { kind, class: className }: Props = $props();
</script>

{#if kind === "diary"}
    <BookOpenIcon class={className} />
{:else if kind === "letter"}
    <ScrollTextIcon class={className} />
{:else}
    <FileTextIcon class={className} />
{/if}
