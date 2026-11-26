<script lang="ts">
    import * as Select from "$lib/components/ui/select/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import StatblockDND5e from "./statblock-dnd5e.svelte";
    import StatblockShadowdark from "./statblock-shadowdark.svelte";
    import StatblockPathfinder1e from "./statblock-pathfinder1e.svelte";
    import type { StatblockData, GameSystem } from "$lib/schema/binder-statblock";
    import type { Translations } from "$lib/i18n";
    import { getImageSrc } from "$lib/content-utils";

    type Props = {
        data: StatblockData;
        translations: Translations;
        preferredSystem?: GameSystem;
        showImage?: boolean;
    };
    const { data, translations: t, preferredSystem, showImage }: Props =
        $props();

    const imgSrc = $derived(data.image ? getImageSrc(data.image) : undefined);

    let selected = $state<GameSystem>();
    const availableSystems = $derived(
        Object.keys(data.systems),
    ) as GameSystem[];

    $effect(() => {
        if (!selected && availableSystems.length) {
            selected =
                preferredSystem && availableSystems.includes(preferredSystem)
                    ? preferredSystem
                    : availableSystems[0];
        }
    });
</script>

<Card.Root class="text-sm">
    {#if imgSrc && showImage}
        <img
            src={imgSrc}
            alt={data.name}
            class="relative z-20 aspect-video object-center w-full object-cover"
        />
    {/if}

    <Card.Header>
        <Card.Title class="">{data.name}</Card.Title>
        {#if data.description}
            <Card.Description>{data.description}</Card.Description>
        {/if}

        {#if availableSystems.length > 0}
            <Card.Action>
                <Select.Root
                    type="single"
                    value={selected}
                    onValueChange={(value) =>
                        (selected = value as GameSystem)}
                >
                    <Select.Trigger class="w-40">
                        {selected
                            ? t.statblock.systems[selected]
                            : t.statblock.selectSystem}
                    </Select.Trigger>
                    <Select.Content>
                        {#each availableSystems as system}
                            <Select.Item
                                value={system}
                                label={t.statblock.systems[system]}
                            />
                        {/each}
                    </Select.Content>
                </Select.Root>
            </Card.Action>
        {/if}
    </Card.Header>

    <Card.Content class="text-sm">
        {#if selected === "dnd5e" && data.systems.dnd5e}
            <StatblockDND5e
                stats={data.systems.dnd5e}
                translations={t.statblock.dnd5e}
            />
        {:else if selected === "shadowdark" && data.systems.shadowdark}
            <StatblockShadowdark
                stats={data.systems.shadowdark}
                translations={t.statblock.shadowdark}
            />
        {:else if selected === "pathfinder1e" && data.systems.pathfinder1e}
            <StatblockPathfinder1e
                stats={data.systems.pathfinder1e}
                translations={t.statblock.pathfinder1e}
            />
        {/if}
    </Card.Content>
</Card.Root>
