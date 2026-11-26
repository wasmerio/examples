<script lang="ts">
    import { Separator } from "$lib/components/ui/separator/index.js";
    import type { Translations } from "$lib/i18n";
    import type { StatblockShadowdarkData } from "$lib/schema/statblocks/shadowdark";

    type Props = {
        stats: StatblockShadowdarkData;
        translations: Translations["statblock"]["shadowdark"];
    };
    const { stats, translations: tr }: Props = $props();

    function formatModifier(mod: number) {
        return mod >= 0 ? `+${mod}` : `${mod}`;
    }

    const ABILITIES: (keyof StatblockShadowdarkData["abilityModifiers"])[] = [
        "strength",
        "dexterity",
        "constitution",
        "intelligence",
        "wisdom",
        "charisma",
    ];

    function formatAttack(attack: StatblockShadowdarkData["attacks"][number]) {
        const parts = [
            `${attack.count}`,
            attack.name,
            attack.range && tr.ranges[attack.range],
            attack.bonus && formatModifier(attack.bonus),
            attack.damage && `(${attack.damage})`,
        ].filter(Boolean);
        return parts.join(" ");
    }
</script>

<div class="flex flex-col gap-3">
    <div class="flex flex-col gap-1">
        <span class="text-sm italic text-muted-foreground">
            {tr.level}
            {stats.level}, {tr.alignments[stats.alignment]}
        </span>

        <div>
            <span class="font-semibold">{tr.armorClass}</span>
            {stats.armorClass}
            {#if stats.armorClassDescription}
                {" "}({stats.armorClassDescription})
            {/if}
        </div>
        <div>
            <span class="font-semibold">{tr.hitPoints}</span>
            {stats.hp}
        </div>
        <div>
            <span class="font-semibold">{tr.movement}</span>
            {stats.movement}
        </div>
    </div>

    <Separator />

    <div class="grid grid-cols-6 gap-1 text-center">
        {#each ABILITIES as ability}
            <div class="flex flex-col rounded-md">
                <span class="text-xs font-semibold text-muted-foreground">
                    {tr.abilities[ability].toUpperCase()}
                </span>
                <span class="text-sm">
                    {formatModifier(stats.abilityModifiers[ability])}
                </span>
            </div>
        {/each}
    </div>

    {#if stats.attacks.length}
        <Separator />
        <div>
            <span class="font-semibold">{tr.attacks}</span>
            {stats.attacks.map(formatAttack).join(", ")}
        </div>
    {/if}

    {#if stats.traits.length}
        <Separator />
        <div class="flex flex-col gap-2">
            {#each stats.traits as trait}
                <p>
                    <span class="font-semibold italic">{trait.name}.</span>
                    {trait.description}
                </p>
            {/each}
        </div>
    {/if}
</div>
