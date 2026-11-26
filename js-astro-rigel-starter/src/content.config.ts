import { multilingual } from "./multilang.mjs";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const article = z.object({
  slug: z.string().optional(),
  title: z.string(),
  metaTitle: z.string().optional(),
  description: z.string().optional(),
  ogImage: z.string().optional(),
  noindex: z.boolean().default(false),
  date: z.string(),
  author: z.union([z.string(), z.array(z.string())]),
  draft: z.boolean().default(false),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/blog" }),
  schema: z.object({ frontmatter: article.extend({ tags: z.array(z.string()).default([]) }), body: z.object({ root: z.object({ type: z.literal("root") }).loose() }).loose() }).transform(({ frontmatter, body }) => ({ ...frontmatter, body })),
});

const articleContent = z.object({ frontmatter: article, body: z.object({ root: z.object({ type: z.literal("root") }).loose() }).loose() }).transform(({ frontmatter, body }) => ({ ...frontmatter, body }));

const news = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/news" }),
  schema: articleContent,
});

export const collections = {
  blog, news,
  "articles-en": defineCollection({ loader: multilingual ? glob({ pattern: "*.json", base: "./src/content/multilang/en/articles" }) : async () => [], schema: articleContent }),
  "articles-fr": defineCollection({ loader: multilingual ? glob({ pattern: "*.json", base: "./src/content/multilang/fr/articles" }) : async () => [], schema: articleContent }),
};
