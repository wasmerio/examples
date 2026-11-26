<script lang="ts">
    import type { HandoutKind } from "$lib/schema/binder-handout";
    import {
        BookOpenIcon,
        BookTextIcon,
        FileTextIcon,
        NewspaperIcon,
    } from "@lucide/svelte";

    type Props = {
        kind?: HandoutKind;
        class?: string;
    };
    const { kind, class: className }: Props = $props();
</script>

{#if kind === "guide"}
    <BookOpenIcon class={className} />
{:else if kind === "book"}
    <BookTextIcon class={className} />
{:else if kind === "newspaper"}
    <NewspaperIcon class={className} />
{:else}
    <FileTextIcon class={className} />
{/if}
