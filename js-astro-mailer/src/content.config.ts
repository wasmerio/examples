import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { topics } from "@/config/topics";

const issues = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/issues" }),
  schema: ({ image }) =>
    z.object({
      /** The printed issue number. Drives the index, the archive, and prev/next. */
      issue: z.number().int().positive(),
      title: z.string(),
      /** One or two sentences. Used on every listing, in the feed, and as the meta description. */
      excerpt: z.string(),
      topic: z.enum(topics),
      date: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      author: z.object({
        name: z.string(),
        role: z.string(),
      }),
      cover: z.object({
        src: image(),
        alt: z.string(),
        creditName: z.string(),
        creditUrl: z.url(),
      }),
      /** Promotes the issue to the top of the front page, ahead of the newest one. */
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

export const collections = { issues };
