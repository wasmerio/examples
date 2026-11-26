import { z } from "astro/zod";

export const DND5eSize = z.enum([
    "tiny",
    "small",
    "medium",
    "large",
    "huge",
    "gargantuan",
]);
export type DND5eSize = z.infer<typeof DND5eSize>;

export const DND5eAbility = z.enum([
    "strength",
    "dexterity",
    "constitution",
    "intelligence",
    "wisdom",
    "charisma",
]);
export type DND5eAbility = z.infer<typeof DND5eAbility>;

export const DND5eSkillScore = z.union([
    z.enum(["u", "p", "e"]),
    z.number().int(),
]);
export type DND5eSkillScore = z.infer<typeof DND5eSkillScore>;

const StatblockDND5eSpellcastingBase = z.object({
    ability: DND5eAbility,
    saveDC: z.int().optional(),
    attackBonus: z.int().optional(),
    description: z.string().optional(),
});

export const StatblockDND5eLeveledSpellcasting =
    StatblockDND5eSpellcastingBase.extend({
        kind: z.literal("leveled"),
        name: z.string().default("Spellcasting"),
        cantrips: z.string().array().default([]),
        levels: z
            .object({
                slots: z.int().positive(),
                spells: z.string().array(),
            })
            .array()
            .max(9)
            .default([]),
    });
export type StatblockDND5eLeveledSpellcasting = z.infer<
    typeof StatblockDND5eLeveledSpellcasting
>;

export const StatblockDND5eInnateSpellcasting =
    StatblockDND5eSpellcastingBase.extend({
        kind: z.literal("innate"),
        name: z.string().default("Innate Spellcasting"),
        groups: z
            .object({
                // Times per day the group can be cast; omit for at will.
                perDay: z.int().positive().optional(),
                // Whether `perDay` applies to each spell individually (e.g. "3/day each")
                // rather than to the group as a whole.
                each: z.boolean().default(false),
                spells: z.string().array(),
            })
            .array()
            .default([]),
    });
export type StatblockDND5eInnateSpellcasting = z.infer<
    typeof StatblockDND5eInnateSpellcasting
>;

export const StatblockDND5eSpellcasting = z.discriminatedUnion("kind", [
    StatblockDND5eLeveledSpellcasting,
    StatblockDND5eInnateSpellcasting,
]);
export type StatblockDND5eSpellcasting = z.infer<
    typeof StatblockDND5eSpellcasting
>;

export const StatblockDND5eFeature = z
    .object({
        name: z.string(),
        description: z.string(),
    })
    .array()
    .default([]);
export type StatblockDND5eFeature = z.infer<typeof StatblockDND5eFeature>;

export const StatblockDND5eLegendaryActions = z.object({
    description: z.string().optional(),
    actions: z
        .object({
            name: z.string(),
            cost: z.int().positive().default(1),
            description: z.string(),
        })
        .array()
        .default([]),
});
export type StatblockDND5eLegendaryActions = z.infer<
    typeof StatblockDND5eLegendaryActions
>;

export const StatblockDND5eLairActions = z.object({
    description: z.string().optional(),
    actions: z
        .object({
            description: z.string(),
        })
        .array()
        .default([]),
});
export type StatblockDND5eLairActions = z.infer<
    typeof StatblockDND5eLairActions
>;

export const StatblockDND5eData = z.object({
    size: DND5eSize,
    type: z.string(),
    alignment: z.string().optional(),

    proficiency: z.number(),

    challengeRating: z.enum([
        "0",
        "1/8",
        "1/4",
        "1/2",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "29",
        "30",
    ]),

    hp: z.string().optional(),

    armorClass: z.int().default(10),
    armorClassDescription: z.string().optional(),

    speed: z.string(),

    abilityScores: z.object({
        strength: z.int(),
        dexterity: z.int(),
        constitution: z.int(),
        intelligence: z.int(),
        wisdom: z.int(),
        charisma: z.int(),
    }),
    savingThrows: z.object({
        strength: DND5eSkillScore.default("u"),
        dexterity: DND5eSkillScore.default("u"),
        constitution: DND5eSkillScore.default("u"),
        intelligence: DND5eSkillScore.default("u"),
        wisdom: DND5eSkillScore.default("u"),
        charisma: DND5eSkillScore.default("u"),
    }),
    skills: z.object({
        athletics: DND5eSkillScore.default("u"),
        acrobatics: DND5eSkillScore.default("u"),
        sleightOfHand: DND5eSkillScore.default("u"),
        stealth: DND5eSkillScore.default("u"),
        arcana: DND5eSkillScore.default("u"),
        history: DND5eSkillScore.default("u"),
        investigation: DND5eSkillScore.default("u"),
        nature: DND5eSkillScore.default("u"),
        religion: DND5eSkillScore.default("u"),
        animalHandling: DND5eSkillScore.default("u"),
        insight: DND5eSkillScore.default("u"),
        medicine: DND5eSkillScore.default("u"),
        perception: DND5eSkillScore.default("u"),
        survival: DND5eSkillScore.default("u"),
        deception: DND5eSkillScore.default("u"),
        intimidation: DND5eSkillScore.default("u"),
        performance: DND5eSkillScore.default("u"),
        persuasion: DND5eSkillScore.default("u"),
    }),

    conditionImmunities: z.string().array().optional(),
    vulnerabilities: z.string().array().optional(),
    resistances: z.string().array().optional(),
    immunities: z.string().array().optional(),

    senses: z.string().array().optional(),
    languages: z.string().array().optional(),

    spellcasting: StatblockDND5eSpellcasting.array().default([]),

    traits: StatblockDND5eFeature,
    actions: StatblockDND5eFeature,
    bonusActions: StatblockDND5eFeature,
    reactions: StatblockDND5eFeature,
    legendaryActions: StatblockDND5eLegendaryActions.optional(),
    lairActions: StatblockDND5eLairActions.optional(),
});
export type StatblockDND5eData = z.infer<typeof StatblockDND5eData>;
