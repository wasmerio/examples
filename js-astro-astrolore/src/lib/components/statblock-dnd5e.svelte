<script lang="ts">
    import { Separator } from "$lib/components/ui/separator/index.js";
    import type { Translations } from "$lib/i18n";
    import { DotIcon } from "@lucide/svelte";
    import { StatblockDND5eData } from "$lib/schema/statblocks/dnd5e";

    type Props = {
        stats: StatblockDND5eData;
        translations: Translations["statblock"]["dnd5e"];
    };
    const { stats, translations: tr }: Props = $props();

    function modifier(score: number) {
        return Math.floor((score - 10) / 2);
    }
    function formatModifier(mod: number) {
        return mod >= 0 ? `+${mod}` : `${mod}`;
    }

    const ABILITIES: (keyof StatblockDND5eData["abilityScores"])[] = [
        "strength",
        "dexterity",
        "constitution",
        "intelligence",
        "wisdom",
        "charisma",
    ];

    const SKILLS: {
        key: keyof StatblockDND5eData["skills"];
        ability: keyof StatblockDND5eData["abilityScores"];
    }[] = [
        { key: "athletics", ability: "strength" },
        { key: "acrobatics", ability: "dexterity" },
        { key: "sleightOfHand", ability: "dexterity" },
        { key: "stealth", ability: "dexterity" },
        { key: "arcana", ability: "intelligence" },
        { key: "history", ability: "intelligence" },
        { key: "investigation", ability: "intelligence" },
        { key: "nature", ability: "intelligence" },
        { key: "religion", ability: "intelligence" },
        { key: "animalHandling", ability: "wisdom" },
        { key: "insight", ability: "wisdom" },
        { key: "medicine", ability: "wisdom" },
        { key: "perception", ability: "wisdom" },
        { key: "survival", ability: "wisdom" },
        { key: "deception", ability: "charisma" },
        { key: "intimidation", ability: "charisma" },
        { key: "performance", ability: "charisma" },
        { key: "persuasion", ability: "charisma" },
    ];

    const CR_XP: Record<StatblockDND5eData["challengeRating"], number> = {
        "0": 10,
        "1/8": 25,
        "1/4": 50,
        "1/2": 100,
        "1": 200,
        "2": 450,
        "3": 700,
        "4": 1100,
        "5": 1800,
        "6": 2300,
        "7": 2900,
        "8": 3900,
        "9": 5000,
        "10": 5900,
        "11": 7200,
        "12": 8400,
        "13": 10000,
        "14": 11500,
        "15": 13000,
        "16": 15000,
        "17": 18000,
        "18": 20000,
        "19": 22000,
        "20": 25000,
        "21": 33000,
        "22": 41000,
        "23": 50000,
        "24": 62000,
        "25": 75000,
        "26": 90000,
        "27": 105000,
        "28": 120000,
        "29": 135000,
        "30": 155000,
    };

    function skillBonus(
        ability: keyof StatblockDND5eData["abilityScores"],
        score: StatblockDND5eData["skills"][keyof StatblockDND5eData["skills"]],
    ) {
        if (typeof score === "number") return score;
        const multiplier = score === "e" ? 2 : score === "p" ? 1 : 0;
        return (
            modifier(stats.abilityScores[ability]) +
            multiplier * stats.proficiency
        );
    }

    const typeLine = $derived(
        [`${tr.sizes[stats.size]} ${stats.type}`, stats.alignment]
            .filter(Boolean)
            .join(", "),
    );

    const savingThrowsLine = $derived(
        ABILITIES.filter((a) => stats.savingThrows[a] !== "u")
            .map(
                (a) =>
                    `${tr.abilities[a]} ${formatModifier(skillBonus(a, stats.savingThrows[a]))}`,
            )
            .join(", "),
    );
    const skillsLine = $derived(
        SKILLS.filter((s) => stats.skills[s.key] !== "u")
            .map(
                (s) =>
                    `${tr.skillNames[s.key]} ${formatModifier(skillBonus(s.ability, stats.skills[s.key]))}`,
            )
            .join(", "),
    );

    function spellSaveDC(sc: StatblockDND5eData["spellcasting"][number]) {
        return (
            sc.saveDC ??
            8 + stats.proficiency + modifier(stats.abilityScores[sc.ability])
        );
    }
    function spellAttackBonus(sc: StatblockDND5eData["spellcasting"][number]) {
        return (
            sc.attackBonus ??
            stats.proficiency + modifier(stats.abilityScores[sc.ability])
        );
    }
</script>

<div class="flex flex-col gap-3">
    <div class="flex flex-col gap-1">
        <span class="text-sm italic text-muted-foreground">
            {typeLine}
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
            <span class="font-semibold">{tr.speed}</span>
            {stats.speed}
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
                    {stats.abilityScores[ability]}
                    ({formatModifier(modifier(stats.abilityScores[ability]))})
                </span>
            </div>
        {/each}
    </div>

    <Separator />

    <div class="flex flex-col gap-1">
        {#if savingThrowsLine}
            <div>
                <span class="font-semibold">{tr.savingThrows}</span>
                {savingThrowsLine}
            </div>
        {/if}
        {#if skillsLine}
            <div>
                <span class="font-semibold">{tr.skills}</span>
                {skillsLine}
            </div>
        {/if}
        {#if stats.vulnerabilities?.length}
            <div>
                <span class="font-semibold">{tr.damageVulnerabilities}</span>
                {stats.vulnerabilities.join(", ")}
            </div>
        {/if}
        {#if stats.resistances?.length}
            <div>
                <span class="font-semibold">{tr.damageResistances}</span>
                {stats.resistances.join(", ")}
            </div>
        {/if}
        {#if stats.immunities?.length}
            <div>
                <span class="font-semibold">{tr.damageImmunities}</span>
                {stats.immunities.join(", ")}
            </div>
        {/if}
        {#if stats.conditionImmunities?.length}
            <div>
                <span class="font-semibold">{tr.conditionImmunities}</span>
                {stats.conditionImmunities.join(", ")}
            </div>
        {/if}
        {#if stats.senses?.length}
            <div>
                <span class="font-semibold">{tr.senses}</span>
                {stats.senses.join(", ")}
            </div>
        {/if}
        {#if stats.languages?.length}
            <div>
                <span class="font-semibold">{tr.languages}</span>
                {stats.languages.join(", ")}
            </div>
        {/if}
        <div>
            <span class="font-semibold">{tr.challenge}</span>
            {stats.challengeRating} ({CR_XP[
                stats.challengeRating
            ].toLocaleString()} XP)
        </div>
    </div>

    {#if stats.traits.length}
        <Separator />
        <div class="flex flex-col gap-2">
            {#each stats.traits as trait}
                <p>
                    <span class="font-semibold italic">{trait.name}.</span>
                    {trait.description}
                </p>
            {/each}

            {#each stats.spellcasting as sc}
                <div class="flex flex-col gap-1">
                    <p>
                        <span class="font-semibold italic">{sc.name}.</span>
                        {sc.description}
                    </p>

                    <div
                        class="text-xs text-muted-foreground flex items-center"
                    >
                        <span>{tr.abilities[sc.ability]}</span>
                        <DotIcon class="size-4" />
                        <span>{tr.spellSaveDC} {spellSaveDC(sc)}</span>
                        <DotIcon class="size-4" />
                        <span
                            >{formatModifier(spellAttackBonus(sc))}
                            {tr.toHitWithSpellAttacks}</span
                        >
                    </div>

                    {#if sc.kind === "leveled"}
                        {#if sc.cantrips.length}
                            <p>
                                <span>{tr.cantripsAtWill}:</span>
                                {sc.cantrips.join(", ")}
                            </p>
                        {/if}
                        {#each sc.levels as levelGroup, i}
                            <p>
                                <span>{tr.spellLevels[i + 1]} ({levelGroup.slots}
                                    {levelGroup.slots > 1
                                        ? tr.slots
                                        : tr.slot}):</span
                                >
                                {levelGroup.spells.join(", ")}
                            </p>
                        {/each}
                    {:else}
                        {#each sc.groups as group}
                            <p>
                                <span>
                                    {group.perDay
                                        ? `${group.perDay}/${tr.perDaySuffix} ${group.each ? ` ${tr.each}` : ""}`
                                        : tr.atWill}:
                                </span>
                                {group.spells.join(", ")}
                            </p>
                        {/each}
                    {/if}
                </div>
            {/each}
        </div>
    {/if}

    {#if stats.actions.length}
        <Separator />
        <div class="flex flex-col gap-2">
            <span class="text-base font-semibold">{tr.actions}</span>
            {#each stats.actions as action}
                <p>
                    <span class="font-semibold italic">{action.name}.</span>
                    {action.description}
                </p>
            {/each}
        </div>
    {/if}

    {#if stats.bonusActions.length}
        <Separator />
        <div class="flex flex-col gap-2">
            <span class="text-base font-semibold">{tr.bonusActions}</span>
            {#each stats.bonusActions as action}
                <p>
                    <span class="font-semibold italic">{action.name}.</span>
                    {action.description}
                </p>
            {/each}
        </div>
    {/if}

    {#if stats.reactions.length}
        <Separator />
        <div class="flex flex-col gap-2">
            <span class="text-base font-semibold">{tr.reactions}</span>
            {#each stats.reactions as reaction}
                <p>
                    <span class="font-semibold italic">{reaction.name}.</span>
                    {reaction.description}
                </p>
            {/each}
        </div>
    {/if}

    {#if stats.legendaryActions && (stats.legendaryActions.description || stats.legendaryActions.actions.length)}
        <Separator />
        <div class="flex flex-col gap-2">
            <span class="text-base font-semibold">{tr.legendaryActions}</span>
            {#if stats.legendaryActions.description}
                <p>{stats.legendaryActions.description}</p>
            {/if}
            {#each stats.legendaryActions.actions as action}
                <p>
                    <span class="font-semibold italic"
                        >{action.name}{action.cost > 1
                            ? ` (${tr.costs} ${action.cost} ${tr.actionsWord})`
                            : ""}.</span
                    >
                    {action.description}
                </p>
            {/each}
        </div>
    {/if}

    {#if stats.lairActions && (stats.lairActions.description || stats.lairActions.actions.length)}
        <Separator />
        <div class="flex flex-col gap-2">
            <span class="text-base font-semibold">{tr.lairActions}</span>
            {#if stats.lairActions.description}
                <p>{stats.lairActions.description}</p>
            {/if}
            {#each stats.lairActions.actions as action}
                <p>{action.description}</p>
            {/each}
        </div>
    {/if}
</div>
