import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

/**
 * One entry per service. Each becomes its own page at /services/<id>/ so it can
 * rank for that single intent instead of competing with the homepage.
 */
const services = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/services" }),
  schema: z.object({
    title: z.string(),
    /** 120–160 characters. Becomes the meta description and the llms.txt line. */
    description: z.string().min(50).max(200),
    /** Shown first in the FAQ block and emitted as FAQPage schema. */
    faqs: z
      .array(z.object({ q: z.string(), a: z.string() }))
      .default([]),
    from: z.string().optional(),
    order: z.number().default(99),
  }),
});

/**
 * One entry per location. Only create these when you genuinely serve the place
 * and can write something specific — door templates get filtered as doorway pages.
 */
const locations = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/locations" }),
  schema: z.object({
    title: z.string(),
    description: z.string().min(50).max(200),
    city: z.string(),
    zip: z.string(),
    order: z.number().default(99),
  }),
});

export const collections = { services, locations };
