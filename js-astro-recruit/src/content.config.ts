import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { Currency } from "@lucide/astro";

const blog = defineCollection({
  // Load Markdown and MDX files in the `src/content/blog/` directory.
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      // Transform string to Date object
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      heroImage: z.optional(image()),
    }),
});

const jobs = defineCollection({
  loader: glob({
    base: "./src/content/jobs",
    pattern: "**/*.{md,mdx}",
  }),

  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      referrer: z.string(),
      city: z.string(),
      country: z.string(),
      currency: z.string(),
      min_salary: z.number(),
      max_salary: z.number(),
      salary_period: z.string(),
      type: z.string(),
      company: z.string(),
      benefits: z.array(z.string()),
      tags: z.array(z.string()),
      category: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      heroImage: image().optional(),
    }),
});

export const collections = { blog, jobs };
