import { z } from "astro/zod";

export const ShadowdarkAlignment = z.enum(["lawful", "neutral", "chaotic"]);
export type ShadowdarkAlignment = z.infer<typeof ShadowdarkAlignment>;

export const StatblockShadowdarkAttack = z.object({
    name: z.string(),
    // Attack roll bonus; omit for attacks that don't require a roll.
    bonus: z.int().optional(),
    range: z.enum(["close", "near", "far"]).optional(),
    damage: z.string().optional(),
    count: z.int().positive().default(1),
});
export type StatblockShadowdarkAttack = z.infer<
    typeof StatblockShadowdarkAttack
>;

export const StatblockShadowdarkTrait = z
    .object({
        name: z.string(),
        description: z.string(),
    })
    .array()
    .default([]);
export type StatblockShadowdarkTrait = z.infer<typeof StatblockShadowdarkTrait>;

export const StatblockShadowdarkData = z.object({
    level: z.int().min(0),
    alignment: ShadowdarkAlignment,

    armorClass: z.int(),
    armorClassDescription: z.string().optional(),

    hp: z.int().positive(),

    // Free-form to allow descriptors like "Near, Far (fly)" or "Unable".
    movement: z.string(),

    abilityModifiers: z.object({
        strength: z.int(),
        dexterity: z.int(),
        constitution: z.int(),
        intelligence: z.int(),
        wisdom: z.int(),
        charisma: z.int(),
    }),

    attacks: StatblockShadowdarkAttack.array().default([]),
    traits: StatblockShadowdarkTrait,
});
export type StatblockShadowdarkData = z.infer<typeof StatblockShadowdarkData>;
