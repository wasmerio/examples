import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const statusSchema = z
  .union([z.array(z.string()), z.string()])
  .transform((value) => (Array.isArray(value) ? value : value.split(","))
    .map((status) => status.trim())
    .filter(Boolean))
  .refine((items) => new Set(items).size === items.length, {
    message: "status values must be unique",
  });

const blogMetaSchema = z.object({
  title: z.string(),
  slug: z.string().optional(),
  description: z.string(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  heroImage: z.string().optional(),
  status: statusSchema.optional(),
  badge: z.string().optional(), // Legacy field, accepted for existing posts.
  category: z.string().optional(),
  tags: z
    .union([z.array(z.string()), z.string()])
    .transform((value) => Array.isArray(value)
      ? value
      : value.split(",").map((tag) => tag.trim()).filter(Boolean))
    .refine((items) => new Set(items).size === items.length, {
      message: "tags must be unique",
    })
    .optional(),
}).transform(({ badge, status, ...meta }) => ({
  ...meta,
  status: status ?? (badge?.trim() ? [badge.trim()] : []),
}));

const pageCoverSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("color"),
    value: z.string().regex(/^#[0-9a-fA-F]{6}$/, "cover color must be a six-digit hex value"),
    position: z.coerce.number().min(0).max(100).optional(),
  }),
  z.object({
    type: z.literal("image"),
    value: z.string().trim().min(1),
    position: z.coerce.number().min(0).max(100).optional(),
  }),
]);

const pageAppearanceSchema = z.object({
  icon: z.string().trim().min(1).optional(),
  cover: pageCoverSchema.optional(),
});

type HeroImageCandidate = { src: string };

const collectHeroImages = (blocks: unknown[]): HeroImageCandidate[] => {
  const candidates: HeroImageCandidate[] = [];
  for (const value of blocks) {
    if (!value || typeof value !== "object") continue;
    const block = value as Record<string, unknown>;
    if (block.type === "image" && block.isHeroImage === true) {
      candidates.push({ src: typeof block.src === "string" ? block.src : "" });
    }
    if (Array.isArray(block.children)) candidates.push(...collectHeroImages(block.children));
  }
  return candidates;
};

const blogSchema = z.object({
  version: z.literal(2),
  meta: blogMetaSchema,
  page: pageAppearanceSchema.optional(),
  blocks: z.array(z.unknown()),
}).superRefine(({ blocks }, context) => {
  const heroImages = collectHeroImages(blocks);
  if (heroImages.length > 1) {
    context.addIssue({
      code: "custom",
      path: ["blocks"],
      message: "\uB300\uD45C \uC774\uBBF8\uC9C0\uB294 \uAE00 \uD558\uB098\uB2F9 \uD558\uB098\uB9CC \uC124\uC815\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.",
    });
  }
  if (heroImages.length === 1 && !heroImages[0].src.trim()) {
    context.addIssue({
      code: "custom",
      path: ["blocks"],
      message: "\uB300\uD45C \uC774\uBBF8\uC9C0 \uBE14\uB85D\uC5D0\uB294 src\uAC00 \uD544\uC694\uD569\uB2C8\uB2E4.",
    });
  }
}).transform(({ meta, page, blocks }) => {
  const blockHeroImage = collectHeroImages(blocks)[0]?.src.trim();
  return {
    ...meta,
    heroImage: blockHeroImage || meta.heroImage,
    page,
    blocks,
  };
});

export type BlogSchema = z.infer<typeof blogSchema>;

const blogCollection = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.json" }),
  schema: blogSchema,
});

export const collections = {
  blog: blogCollection,
};
