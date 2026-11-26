import { z } from "astro/zod";

export const Pathfinder1eSize = z.enum([
    "fine",
    "diminutive",
    "tiny",
    "small",
    "medium",
    "large",
    "huge",
    "gargantuan",
    "colossal",
]);
export type Pathfinder1eSize = z.infer<typeof Pathfinder1eSize>;

export const Pathfinder1eChallengeRating = z.enum([
    "1/8",
    "1/6",
    "1/4",
    "1/3",
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
]);
export type Pathfinder1eChallengeRating = z.infer<
    typeof Pathfinder1eChallengeRating
>;

export const Pathfinder1eSaves = z.object({
    fortitude: z.int(),
    reflex: z.int(),
    will: z.int(),
    description: z.string().optional(),
});
export type Pathfinder1eSaves = z.infer<typeof Pathfinder1eSaves>;

export const StatblockPathfinder1eAttack = z.object({
    name: z.string(),
    bonus: z.string(),
    damage: z.string(),
    count: z.int().positive().default(1),
});
export type StatblockPathfinder1eAttack = z.infer<
    typeof StatblockPathfinder1eAttack
>;

export const StatblockPathfinder1eFeature = z.object({
    name: z.string(),
    type: z.enum(["Ex", "Su", "Sp"]).optional(),
    description: z.string().optional(),
});
export type StatblockPathfinder1eFeature = z.infer<
    typeof StatblockPathfinder1eFeature
>;

const Pathfinder1eSpellcastingBase = z.object({
    title: z.string(),
    casterLevel: z.int(),
    notes: z.string().array().default([]),
});

export const Pathfinder1eSpellLikeGroup = z.object({
    frequency: z.string(),
    spells: z.string().array(),
    note: z.string().optional(),
});
export type Pathfinder1eSpellLikeGroup = z.infer<
    typeof Pathfinder1eSpellLikeGroup
>;

export const StatblockPathfinder1eInnateSpellcasting =
    Pathfinder1eSpellcastingBase.extend({
        kind: z.literal("innate"),
        groups: Pathfinder1eSpellLikeGroup.array().default([]),
    });
export type StatblockPathfinder1eInnateSpellcasting = z.infer<
    typeof StatblockPathfinder1eInnateSpellcasting
>;

export const Pathfinder1eSpellLevel = z.object({
    spells: z.string().array(),
    frequency: z.string().optional(),
});
export type Pathfinder1eSpellLevel = z.infer<typeof Pathfinder1eSpellLevel>;

export const StatblockPathfinder1eLeveledSpellcasting =
    Pathfinder1eSpellcastingBase.extend({
        kind: z.literal("leveled"),
        levels: Pathfinder1eSpellLevel.array().default([]),
    });
export type StatblockPathfinder1eLeveledSpellcasting = z.infer<
    typeof StatblockPathfinder1eLeveledSpellcasting
>;

export const StatblockPathfinder1eSpellcasting = z.discriminatedUnion("kind", [
    StatblockPathfinder1eLeveledSpellcasting,
    StatblockPathfinder1eInnateSpellcasting,
]);
export type StatblockPathfinder1eSpellcasting = z.infer<
    typeof StatblockPathfinder1eSpellcasting
>;

export const StatblockPathfinder1eData = z.object({
    size: Pathfinder1eSize,
    type: z.string(),
    subtypes: z.string().array().default([]),
    alignment: z.string().optional(),

    challengeRating: Pathfinder1eChallengeRating,
    initiative: z.int(),
    senses: z.string().array().optional(),

    // Defence
    armorClass: z.int(),
    touchArmorClass: z.int().optional(),
    flatFootedArmorClass: z.int().optional(),
    armorClassDescription: z.string().optional(),
    hp: z.string(),
    saves: Pathfinder1eSaves,
    defensiveAbilities: z.string().array().optional(),
    damageReduction: z.string().optional(),
    immunities: z.string().array().optional(),
    resistances: z.string().array().optional(),
    spellResistance: z.int().optional(),
    weaknesses: z.string().array().optional(),

    // Offence
    speed: z.string(),
    meleeAttacks: StatblockPathfinder1eAttack.array().default([]),
    rangedAttacks: StatblockPathfinder1eAttack.array().default([]),
    space: z.string().optional(),
    reach: z.string().optional(),
    spellcasting: StatblockPathfinder1eSpellcasting.array().default([]),
    specialAttacks: StatblockPathfinder1eFeature.array().default([]),

    // Statistics
    // A score of 0 means the creature lacks that ability
    abilityScores: z.object({
        strength: z.int(),
        dexterity: z.int(),
        constitution: z.int(),
        intelligence: z.int(),
        wisdom: z.int(),
        charisma: z.int(),
    }),
    baseAttackBonus: z.int(),
    baseAttackBonusDescription: z.string().optional(),
    cmb: z.int().optional(),
    cmbDescription: z.string().optional(),
    cmd: z.int().optional(),
    cmdDescription: z.string().optional(),
    feats: z.string().array().default([]),
    skills: z
        .object({
            acrobatics: z.int().optional(),
            appraise: z.int().optional(),
            bluff: z.int().optional(),
            climb: z.int().optional(),
            craft: z.int().optional(),
            diplomacy: z.int().optional(),
            disableDevice: z.int().optional(),
            disguise: z.int().optional(),
            escapeArtist: z.int().optional(),
            fly: z.int().optional(),
            handleAnimal: z.int().optional(),
            heal: z.int().optional(),
            intimidate: z.int().optional(),
            knowledgeArcana: z.int().optional(),
            knowledgeDungeoneering: z.int().optional(),
            knowledgeEngineering: z.int().optional(),
            knowledgeGeography: z.int().optional(),
            knowledgeHistory: z.int().optional(),
            knowledgeLocal: z.int().optional(),
            knowledgeNature: z.int().optional(),
            knowledgeNobility: z.int().optional(),
            knowledgePlanes: z.int().optional(),
            knowledgeReligion: z.int().optional(),
            linguistics: z.int().optional(),
            perception: z.int().optional(),
            perform: z.int().optional(),
            profession: z.int().optional(),
            ride: z.int().optional(),
            senseMotive: z.int().optional(),
            sleightOfHand: z.int().optional(),
            spellcraft: z.int().optional(),
            stealth: z.int().optional(),
            survival: z.int().optional(),
            swim: z.int().optional(),
            useMagicDevice: z.int().optional(),
        })
        .default({}),
    languages: z.string().array().optional(),
    specialQualities: StatblockPathfinder1eFeature.array().default([]),
    gear: z.string().array().optional(),

    // Other Special Abilities (like for references inside attacks)
    specialAbilities: StatblockPathfinder1eFeature.array().default([]),

    // Ecology
    environment: z.string().optional(),
    organization: z.string().optional(),
    treasure: z.string().optional(),
});
export type StatblockPathfinder1eData = z.infer<
    typeof StatblockPathfinder1eData
>;
