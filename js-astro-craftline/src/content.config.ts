import { defineCollection, reference } from "astro:content";
import { glob, file } from "astro/loaders";
import { z } from "astro/zod";

const services = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/services" }),
  schema: z.object({
    title: z.string(),
    /** One or two sentences for cards and the meta description. */
    summary: z.string(),
    /** Lower comes first. */
    order: z.number().default(100),
    /** Starting price, e.g. "$149". Leave out to hide the price. */
    priceFrom: z.string().optional(),
    /** What the starting price covers, e.g. "most sinks and showers". */
    priceNote: z.string().optional(),
    /** Shown first in the grid, with the emergency phone number. */
    featured: z.boolean().default(false),
    /** The small line animation on the card (see src/components/ServiceArt.astro). */
    art: z.enum(["pulse", "sonar", "drain", "bars", "wave", "drip"]).default("pulse"),
    /** Typical time on site, e.g. "1–2 hours". */
    duration: z.string().optional(),
    /** Bullet points in the sidebar of the service page. */
    included: z.array(z.string()).default([]),
  }),
});

const testimonials = defineCollection({
  loader: file("./src/content/testimonials.json"),
  schema: z.object({
    name: z.string(),
    location: z.string(),
    rating: z.number().int().min(1).max(5),
    quote: z.string(),
    service: reference("services").optional(),
  }),
});

const faq = defineCollection({
  loader: file("./src/content/faq.json"),
  schema: z.object({
    question: z.string(),
    answer: z.string(),
    order: z.number().default(100),
  }),
});

export const collections = { services, testimonials, faq };
