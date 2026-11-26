import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

const contentBlockSchema = z.looseObject({ _component: z.string() });

const pageSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  image: z.string().optional(),
  canonical: z.string().optional(),
  noindex: z.boolean().optional(),
  pageSections: z.array(contentBlockSchema),
});

// No `updated` field: the meta line's date is the file's last commit (`gitDates.mjs`).
const docSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  group: z.string().optional(),
  order: z.number().default(0),
  keywords: z.array(z.string()).optional(),
  image: z.string().optional(),
  noindex: z.boolean().optional(),
  showTableOfContents: z.boolean().default(true),
  showFeedback: z.boolean().default(true),
  showCopyPage: z.boolean().default(true),
  showPager: z.boolean().default(true),
});

// No route of its own; the `changelog` component reads it.
const changelogSchema = z.object({
  version: z.string(),
  date: z.coerce.date(),
  summary: z.string().optional(),
  changes: z
    .array(
      z.object({
        tag: z.string().optional(),
        text: z.string(),
      })
    )
    .default([]),
});

const pagesCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pages" }),
  schema: pageSchema,
});

const docsCollection = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/docs" }),
  schema: docSchema,
});

const changelogCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/changelog" }),
  schema: changelogSchema,
});

export const collections = {
  pages: pagesCollection,
  docs: docsCollection,
  changelog: changelogCollection,
};
