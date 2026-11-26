import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    published: z.coerce.date(),
    description: z.string().default(""),
    tags: z.array(z.string()).default([]),
    category: z.string().default("Uncategorized"),
    draft: z.boolean().default(false),
  }),
});

// About などの固定ページ
const spec = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/spec" }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(""),
  }),
});

export const collections = { posts, spec };
