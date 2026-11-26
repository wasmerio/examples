import { z } from "astro/zod";
import type { ImageFunction } from "astro:content";
import { ImageOrUrl } from "./common";

const CharacterBaseMetadata = (image: ImageFunction) =>
    z.object({
        type: z.literal("character"),
        kind: z.null().optional().default(null),

        image: ImageOrUrl(image).optional(),
        creature: z.string().optional(),

        titles: z.string().array().optional(),
        epithets: z.string().array().optional(),

        family: z.string().optional(),
        cultures: z.string().array().optional(),
        organizations: z.string().array().optional(),
        organizationsFormer: z.string().array().optional(),

        birth: z.string().optional(),
        death: z.string().optional(),
        bornIn: z.string().optional(),
        diedIn: z.string().optional(),

        gender: z.enum(["M", "F"]).optional(),
        parents: z.string().array().optional(),
        children: z.string().array().optional(),
        spouses: z.string().array().optional(),
    });
export type CharacterBaseMetadata = z.infer<
    ReturnType<typeof CharacterBaseMetadata>
>;

const CharacterDivinityMetadata = (image: ImageFunction) =>
    CharacterBaseMetadata(image).extend({
        kind: z.literal("divinity"),
    });

const CharacterMetadata = (image: ImageFunction) =>
    z.discriminatedUnion("kind", [
        CharacterBaseMetadata(image),
        CharacterDivinityMetadata(image),
    ]);
export type CharacterMetadata = z.infer<ReturnType<typeof CharacterMetadata>>;

const LocationBaseMetadata = (image: ImageFunction) =>
    z.object({
        type: z.literal("location"),
        image: ImageOrUrl(image).optional(),
        kind: z
            .enum([
                "cosmic",
                "continent",
                "region",
                "landmark",
                "temple",
                "ocean",
                "sea",
                "lake",
                "river",
                "forest",
            ])
            .optional(),

        parentLocation: z.string().optional(),
    });

const LocationSettlementMetadata = (image: ImageFunction) =>
    LocationBaseMetadata(image).extend({
        kind: z.literal("settlement"),
        founders: z.string().array().optional(),
        founding: z.string().optional(),
        destruction: z.string().optional(),
    });

const LocationMetadata = (image: ImageFunction) =>
    z.discriminatedUnion("kind", [
        LocationBaseMetadata(image),
        LocationSettlementMetadata(image),
    ]);
export type LocationMetadata = z.infer<ReturnType<typeof LocationMetadata>>;

const HistoricKind = z.enum([
    "generic",
    "celestial",
    "natural",
    "settlement",
    "political",
    "conflict",
]);
export type HistoricKind = z.infer<typeof HistoricKind>;

const HistoricEvent = z.string();
const HistoricPeriod = z.object({
    start: z.string(),
    end: z.string(),
});

const HistoricMetadata = (image: ImageFunction) =>
    z.object({
        type: z.literal("historic"),
        kind: HistoricKind.optional(),
        image: ImageOrUrl(image).optional(),
        timelines: z.string().array().optional(),
        date: z.union([HistoricEvent, HistoricPeriod]).optional(),
    });
export type HistoricMetadata = z.infer<ReturnType<typeof HistoricMetadata>>;

const TitleMetadata = z.object({
    type: z.literal("title"),
    relatedOrganization: z.string().optional(),
});
export type TitleMetadata = z.infer<typeof TitleMetadata>;

const LanguageKind = z.enum(["major", "regional", "secret", "dead"]);

const LanguageMetadata = z.object({
    type: z.literal("language"),
    kind: LanguageKind.optional(),
});
export type LanguageMetadata = z.infer<typeof LanguageMetadata>;

const OrganizationBaseMetadata = (image: ImageFunction) =>
    z.object({
        type: z.literal("organization"),
        kind: z.null().optional().default(null),
        symbol: ImageOrUrl(image).optional(),

        founders: z.string().array().optional(),
        leaders: z.string().array().optional(),
        formerLeaders: z.string().array().optional(),

        founding: z.string().optional(),
        termination: z.string().optional(),
    });
export type OrganizationBaseMetadata = z.infer<
    ReturnType<typeof OrganizationBaseMetadata>
>;

const OrganizationCountryMetadata = (image: ImageFunction) =>
    OrganizationBaseMetadata(image).extend({
        kind: z.literal("country"),
        capital: z.string().optional(),
        cultures: z.string().array().optional(),
        languages: z.string().array().optional(),
    });
export type OrganizationCountryMetadata = z.infer<
    ReturnType<typeof OrganizationCountryMetadata>
>;

const OrganizationMetadata = (image: ImageFunction) =>
    z.discriminatedUnion("kind", [
        OrganizationBaseMetadata(image),
        OrganizationCountryMetadata(image),
    ]);
export type OrganizationMetadata = z.infer<
    ReturnType<typeof OrganizationMetadata>
>;

const CultureKind = z.enum(["urban", "rural", "nomadic", "primitive"]);
export type CultureKind = z.infer<typeof CultureKind>;

const CultureMetadata = z.object({
    type: z.literal("culture"),
    kind: CultureKind.optional(),
    parentCulture: z.string().optional(),
});
export type CultureMetadata = z.infer<typeof CultureMetadata>;

const CreatureKind = z.enum([
    "aberration",
    "celestial",
    "construct",
    "fae",
    "humanoid",
]);
export type CreatureKind = z.infer<typeof CreatureKind>;

const CreatureMetadata = (image: ImageFunction) =>
    z.object({
        type: z.literal("creature"),
        parentCreature: z.string().optional(),
        image: ImageOrUrl(image).optional(),
        kind: CreatureKind.optional(),
        locations: z.string().array().optional(),
    });
export type CreatureMetadata = z.infer<ReturnType<typeof CreatureMetadata>>;

const FamilyMetadata = (image: ImageFunction) =>
    z.object({
        type: z.literal("family"),
        emblem: ImageOrUrl(image).optional(),
        head: z.string().optional(),
    });
export type FamilyMetadata = z.infer<ReturnType<typeof FamilyMetadata>>;

const ArticleMetadata = (image: ImageFunction) =>
    z.discriminatedUnion("type", [
        CharacterMetadata(image),
        LocationMetadata(image),
        HistoricMetadata(image),
        TitleMetadata,
        LanguageMetadata,
        OrganizationMetadata(image),
        CultureMetadata,
        CreatureMetadata(image),
        FamilyMetadata(image),
    ]);

export const ArticleFrontmatter = (image: ImageFunction) =>
    z.object({
        title: z.string(),
        aliases: z.string().array().optional(),
        tags: z.string().array().optional(),
        parent: z.string().optional(),
        category: z.string().optional(),
        meta: ArticleMetadata(image).optional(),
    });
