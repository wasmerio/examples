import { defineCollection, z } from "astro:content";

const projects = defineCollection({
  schema: z.object({
    pid: z.number().int().positive(),
    title: z.string(),
    title_de: z.string().optional(),
    description: z.string(),
    description_de: z.string().optional(),
    tags: z.array(z.string()).default([]),
    category: z.enum([
      "automation",
      "tooling",
      "open-source",
      "integration",
      "research",
      "self-hosted",
      "other",
    ]).default("other"),
    links: z
      .array(
        z.object({
          label: z.string(),
          url: z.string().url(),
        })
      )
      .default([]),
    image: z.string().optional(),
    coverImage: z.string().optional(),
    gallery: z.array(z.string()).default([]),
    date: z.coerce.date(),
    slug: z.string().optional(),
    ready: z.boolean().default(true),
    featured: z.boolean().default(false),
  }),
});

export const collections = { projects };
