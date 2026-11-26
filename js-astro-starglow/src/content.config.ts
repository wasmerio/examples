import { defineCollection, reference } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import config from "@/config";
import { postEntryId } from "@/utils/postEntryId";
import {
  NOTE_PATH,
  PROJECT_PATH,
  noteEntryId,
  projectEntryId,
} from "@/utils/content/entryIds";

export const BLOG_PATH = "src/content/blog";

const posts = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: `./${BLOG_PATH}`,
    generateId: ({ entry, data }) =>
      postEntryId(entry, data, config.site.timezone),
  }),
  schema: ({ image }) =>
    z.strictObject({
      author: z.string().default(config.site.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default([]),
      ogImage: image().or(z.string()).optional(),
      description: z.string(),
      canonicalUrl: z.httpUrl().optional(),
      syndication: z.array(z.httpUrl()).default([]),
      hideEditPost: z.boolean().optional(),
      hideToc: z.boolean().optional(),
      // An empty value means "not set", so the site timezone applies.
      timezone: z
        .string()
        .optional()
        .transform(tz => tz || undefined),
    }),
});

const notes = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: `./${NOTE_PATH}`,
    generateId: ({ entry }) => noteEntryId(entry),
  }),
  schema: z.strictObject({
    title: z.string(),
    description: z.string().optional(),
    tags: z.array(z.string()).default([]),
    updated: z.date().optional(),
    canonicalUrl: z.httpUrl().optional(),
    syndication: z.array(z.httpUrl()).default([]),
    draft: z.boolean().optional(),
  }),
});

const projects = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: `./${PROJECT_PATH}`,
    generateId: ({ entry }) => projectEntryId(entry),
  }),
  schema: z.strictObject({
    title: z.string(),
    description: z.string(),
    stack: z.array(z.string()).default([]),
    status: z.enum(["active", "maintained", "archived", "experiment"]),
    githubUrl: z.httpUrl().optional(),
    docsUrl: z.httpUrl().optional(),
    websiteUrl: z.httpUrl().optional(),
    featured: z.boolean().default(false),
    relatedPosts: z.array(reference("posts")).default([]),
    draft: z.boolean().optional(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/pages" }),
  schema: z.strictObject({
    title: z.string(),
    description: z.string().optional(),
    ogImage: z.string().optional(),
    canonicalUrl: z.httpUrl().optional(),
    specialties: z.array(z.string()).optional(),
  }),
});

export const collections = { posts, notes, projects, pages };
