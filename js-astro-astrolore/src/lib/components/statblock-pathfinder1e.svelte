<script lang="ts">
    import { Separator } from "$lib/components/ui/separator/index.js";
    import type { Translations } from "$lib/i18n";
    import type {
        StatblockPathfinder1eData,
        StatblockPathfinder1eFeature,
    } from "$lib/schema/statblocks/pathfinder1e";

    type Props = {
        stats: StatblockPathfinder1eData;
        translations: Translations["statblock"]["pathfinder1e"];
    };
    const { stats, translations: tr }: Props = $props();

    function modifier(score: number) {
        return Math.floor((score - 10) / 2);
    }
    function formatModifier(mod: number) {
        return mod >= 0 ? `+${mod}` : `${mod}`;
    }

    const ABILITIES: (keyof StatblockPathfinder1eData["abilityScores"])[] = [
        "strength",
        "dexterity",
        "constitution",
        "intelligence",
        "wisdom",
        "charisma",
    ];

    const skillsLine = $derived(
        (
            Object.keys(
                stats.skills,
            ) as (keyof StatblockPathfinder1eData["skills"])[]
        )
            .map(
                (key) =>
                    `${tr.skillNames[key]} ${formatModifier(stats.skills[key]!)}`,
            )
            .join(", "),
    );

    const perceptionModifier = $derived(
        stats.skills.perception ?? modifier(stats.abilityScores.wisdom),
    );

    const specials = $derived(
        [
            ...stats.specialAbilities,
            ...stats.specialQualities,
            ...stats.specialAttacks,
        ]
            .filter((s) => s.description)
            .sort((a, b) => a.name.localeCompare(b.name)),
    );

    const CR_XP: Record<StatblockPathfinder1eData["challengeRating"], number> =
        {
            "1/8": 50,
            "1/6": 65,
            "1/4": 100,
            "1/3": 135,
            "1/2": 200,
            "1": 400,
            "2": 600,
            "3": 800,
            "4": 1200,
            "5": 1600,
            "6": 2400,
            "7": 3200,
            "8": 4800,
            "9": 6400,
            "10": 9600,
            "11": 12800,
            "12": 19200,
            "13": 25600,
            "14": 38400,
            "15": 51200,
            "16": 76800,
            "17": 102400,
            "18": 153600,
            "19": 204800,
            "20": 307200,
            "21": 409600,
            "22": 614400,
            "23": 819200,
            "24": 1228800,
            "25": 1638400,
        };

    const typeLine = $derived(
        [
            stats.alignment,
            tr.sizes[stats.size],
            stats.type,
            ...stats.subtypes.map((s) => `(${s})`),
        ]
            .filter(Boolean)
            .join(" "),
    );

    function formatAttack(
        attack: StatblockPathfinder1eData["meleeAttacks"][number],
    ) {
        const parts = [
            `${attack.count}`,
            attack.name,
            attack.bonus,
            `(${attack.damage})`,
        ];
        return parts.join(" ");
    }

    function formatFeatureName(feature: StatblockPathfinder1eFeature) {
        return feature.type
            ? `${feature.name} (${feature.type})`
            : feature.name;
    }

    const defenseEntries = $derived(
        (
            [
                stats.damageReduction && {
                    label: tr.damageReduction,
                    value: stats.damageReduction,
                },
                stats.immunities?.length && {
                    label: tr.immunities,
                    value: stats.immunities.join(", "),
                },
                stats.resistances?.length && {
                    label: tr.resistances,
                    value: stats.resistances.join(", "),
                },
                stats.weaknesses?.length && {
                    label: tr.weaknesses,
                    value: stats.weaknesses.join(", "),
                },
                stats.spellResistance !== undefined && {
                    label: tr.spellResistance,
                    value: `${stats.spellResistance}`,
                },
            ] as const
        ).filter((entry): entry is { label: string; value: string } =>
            Boolean(entry),
        ),
    );
</script>

<div class="flex flex-col gap-3">
    <div class="flex flex-col gap-1">
        <span class="text-sm italic text-muted-foreground">
            {typeLine} — {tr.challenge}
            {stats.challengeRating}
            ({CR_XP[stats.challengeRating].toLocaleString()} XP)
        </span>
        <div>
            <span class="font-semibold">{tr.initiative}</span>
            {`${formatModifier(stats.initiative)}${stats.senses ? ";" : ""}`}
            {#if stats.senses?.length}
                <span class="font-semibold">{tr.senses}</span>
                {`${stats.senses.join(", ")}; ${tr.skillNames.perception} ${formatModifier(perceptionModifier)}`}
            {/if}
        </div>
    </div>

    <div class="flex gap-2 items-center">
        <span class="text-xs text-muted-foreground font-semibold shrink-0">
            {tr.defence.toUpperCase()}
        </span>
        <Separator class="shrink-1" />
    </div>

    <div class="flex flex-col gap-1">
        <div>
            <span class="font-semibold">{tr.armorClass}</span>
            {`
                ${stats.armorClass},
                ${tr.touchArmorClass} ${stats.touchArmorClass ?? stats.armorClass},
                ${tr.flatFootedArmorClass} ${stats.flatFootedArmorClass ?? stats.armorClass}
            `}
            {#if stats.armorClassDescription}
                {" "}({stats.armorClassDescription})
            {/if}
        </div>
        <div>
            <span class="font-semibold">{tr.hitPoints}</span>
            {stats.hp}
        </div>
        <div>
            <span class="font-semibold">{tr.fortitude}</span>
            {formatModifier(stats.saves.fortitude)},
            <span class="font-semibold">{tr.reflex}</span>
            {formatModifier(stats.saves.reflex)},
            <span class="font-semibold">{tr.will}</span>
            {formatModifier(stats.saves.will)}
            {#if stats.saves.description}
                {" "}({stats.saves.description})
            {/if}
        </div>
        {#if stats.defensiveAbilities?.length}
            <div>
                <span class="font-semibold">{tr.defensiveAbilities}</span>
                {stats.defensiveAbilities.join(", ")}
            </div>
        {/if}
        {#if defenseEntries.length}
            <div>
                {#each defenseEntries as entry, i}
                    <span class="font-semibold">{entry.label}</span>
                    {entry.value}{i < defenseEntries.length - 1 ? "; " : ""}
                {/each}
            </div>
        {/if}
    </div>

    <div class="flex gap-2 items-center">
        <span class="text-xs text-muted-foreground font-semibold shrink-0">
            {tr.offence.toUpperCase()}
        </span>
        <Separator class="shrink-1" />
    </div>

    <div class="flex flex-col gap-1">
        <div>
            <span class="font-semibold">{tr.speed}</span>
            {stats.speed}
        </div>
        {#if stats.meleeAttacks.length}
            <div>
                <span class="font-semibold">Melee</span>
                {stats.meleeAttacks.map(formatAttack).join(", ")}
            </div>
        {/if}
        {#if stats.rangedAttacks.length}
            <div>
                <span class="font-semibold">Ranged</span>
                {stats.rangedAttacks.map(formatAttack).join(", ")}
            </div>
        {/if}
        <div>
            {#if stats.space || stats.reach}
                {#if stats.space}
                    <span class="font-semibold">{tr.space}</span>
                    {stats.space}{stats.reach ? ";" : ""}
                {/if}
                {#if stats.reach}
                    <span class="font-semibold">{tr.reach}</span>
                    {stats.reach}
                {/if}
            {/if}
        </div>
        {#if stats.specialAttacks.length}
            <div>
                <span class="font-semibold">{tr.specialAttacks}</span>
                {stats.specialAttacks
                    .map((s) => s.name.toLowerCase())
                    .join(", ")}
            </div>
        {/if}

    {#each stats.spellcasting as entry}
        <div>
            <span class="font-semibold">{entry.title}</span>
            ({tr.casterLevel}
            {entry.casterLevel}{entry.notes.length
                ? `; ${entry.notes.join(", ")}`
                : ""})
        </div>
        {#if entry.kind === "innate"}
            <div class="flex flex-col gap-0 pl-4">
                {#each entry.groups as group}
                    <div>
                        <span class="font-semibold">{group.frequency}</span
                        >—{group.spells.join(", ")}{group.note
                            ? `; ${group.note}`
                            : ""}
                    </div>
                {/each}
            </div>
        {:else}
            <div class="flex flex-col-reverse gap-0 pl-4">
                {#each entry.levels as level, i}
                    {#if level.spells.length}
                        <div>
                            <span class="font-semibold">
                            {i}{level.frequency ? ` (${level.frequency})` : ""}
                            </span>—{level.spells.join(", ")}
                        </div>
                    {/if}
                {/each}
            </div>
        {/if}
    {/each}

    </div>

    <div class="flex gap-2 items-center">
        <span class="text-xs text-muted-foreground font-semibold shrink-0">
            {tr.statistics.toUpperCase()}
        </span>
        <Separator class="shrink-1" />
    </div>

    <div class="grid grid-cols-6 gap-1 text-center">
        {#each ABILITIES as ability}
            <div class="flex flex-col rounded-md">
                <span class="text-xs font-semibold text-muted-foreground">
                    {tr.abilities[ability].toUpperCase()}
                </span>
                <span class="text-sm">
                    {#if stats.abilityScores[ability] === 0}
                        —
                    {:else}
                        {stats.abilityScores[ability]}
                        ({formatModifier(
                            modifier(stats.abilityScores[ability]),
                        )})
                    {/if}
                </span>
            </div>
        {/each}
    </div>

    <div class="flex flex-col gap-1">
        <div>
            <span class="font-semibold">{tr.baseAttackBonus}</span>
            {formatModifier(stats.baseAttackBonus)}
            {stats.baseAttackBonusDescription
                ? ` (${stats.baseAttackBonusDescription})`
                : ""}
            {stats.cmb !== undefined ? ";" : ""}

            {#if stats.cmb !== undefined}
                <span class="font-semibold">{tr.cmb}</span>
                {formatModifier(stats.cmb)}
                {stats.cmbDescription ? ` (${stats.cmbDescription})` : ""}
                {stats.cmd !== undefined ? ";" : ""}
            {/if}

            {#if stats.cmd !== undefined}
                <span class="font-semibold">{tr.cmd}</span>
                {stats.cmd}
                {stats.cmdDescription ? ` (${stats.cmdDescription})` : ""}
            {/if}
        </div>
        {#if stats.feats.length}
            <div>
                <span class="font-semibold">{tr.feats}</span>
                {stats.feats.join(", ")}
            </div>
        {/if}
        {#if skillsLine}
            <div>
                <span class="font-semibold">{tr.skills}</span>
                {skillsLine}
            </div>
        {/if}
        {#if stats.languages?.length}
            <div>
                <span class="font-semibold">{tr.languages}</span>
                {stats.languages.join(", ")}
            </div>
        {/if}
        {#if stats.specialQualities.length}
            <div>
                <span class="font-semibold">{tr.specialQualities}</span>
                {stats.specialQualities
                    .map((s) => s.name.toLowerCase())
                    .join(", ")}
            </div>
        {/if}
        {#if stats.gear?.length}
            <div>
                <span class="font-semibold">{tr.gear}</span>
                {stats.gear.join(", ")}
            </div>
        {/if}
    </div>

    {#if specials.length}
        <div class="flex gap-2 items-center">
            <span class="text-xs text-muted-foreground font-semibold shrink-0">
                {tr.specialAbilities.toUpperCase()}
            </span>
            <Separator class="shrink-1" />
        </div>
        <div class="flex flex-col gap-2">
            {#each specials as special (special.name)}
                <p>
                    <span class="font-semibold italic"
                        >{formatFeatureName(special)}.</span
                    >
                    {special.description}
                </p>
            {/each}
        </div>
    {/if}

    {#if stats.environment || stats.organization || stats.treasure}
        <div class="flex gap-2 items-center">
            <span class="text-xs text-muted-foreground font-semibold shrink-0">
                {tr.ecology.toUpperCase()}
            </span>
            <Separator class="shrink-1" />
        </div>
        <div class="flex flex-col gap-1">
            {#if stats.environment}
                <div>
                    <span class="font-semibold">{tr.environment}</span>
                    {stats.environment}
                </div>
            {/if}
            {#if stats.organization}
                <div>
                    <span class="font-semibold">{tr.organization}</span>
                    {stats.organization}
                </div>
            {/if}
            {#if stats.treasure}
                <div>
                    <span class="font-semibold">{tr.treasure}</span>
                    {stats.treasure}
                </div>
            {/if}
        </div>
    {/if}
</div>
