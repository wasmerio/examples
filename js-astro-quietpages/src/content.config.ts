import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { authors } from "./config/authors";
import { categories, tags } from "./config/taxonomy";

const slugs = <T extends { slug: string }>(list: readonly T[]) =>
  list.map((item) => item.slug) as [T["slug"], ...T["slug"][]];

const blog = defineCollection({
  loader: glob({
    pattern: "**/index.{md,mdx}",
    base: "./src/content/blog",
    generateId: ({ entry }) => entry.replace(/[\\/]index\.mdx?$/, "").replace(/\\/g, "/"),
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      excerpt: z.string(),
      seoTitle: z.string().optional(),
      seoDescription: z.string().optional(),
      canonical: z.url().optional(),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      readingTime: z.number().int().positive().optional(),
      category: z.enum(slugs(categories)),
      tags: z.array(z.enum(slugs(tags))).default([]),
      author: z.enum(slugs(authors)),
      thumbnail: image(),
      thumbnailAlt: z.string(),
      imageCredit: z
        .object({
          caption: z.string().optional(),
          author: z.string(),
          authorUrl: z.url(),
          source: z.string().default("Unsplash"),
          sourceUrl: z.url(),
        })
        .optional(),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

export const collections = { blog };
