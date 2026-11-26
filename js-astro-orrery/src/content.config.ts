import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const services = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/services" }),
  schema: z.object({
    title: z.string(),
    /** The short line under the title on the card, e.g. "segments, churn, lifetime value". */
    tags: z.string(),
    /** One or two sentences for the services page and the form's dropdown context. */
    summary: z.string(),
    /** Lower comes first. */
    order: z.number().default(100),
    /** The card's line animation (see src/components/ServiceArt.astro). */
    art: z.enum(["grid", "bars", "forecast", "curve", "bells", "clusters"]),
    /** Starting price, e.g. "$6,500". Leave out to hide it. */
    priceFrom: z.string().optional(),
    /** Typical length, e.g. "3 weeks". */
    duration: z.string().optional(),
    /** What the client keeps at the end. */
    deliverables: z.array(z.string()).default([]),
  }),
});

export const collections = { services };
