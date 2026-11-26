import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Two collections, one per language. Files pair by filename:
 *   src/content/posts/hello.md  ⇄  src/content/posts-zh/hello.md
 * Paired files get a language switcher link; unpaired ones do not.
 */
const postSchema = ({ defaultLang }: { defaultLang?: 'en' | 'zh' } = {}) =>
  z.object({
    title: z.string(),
    description: z.string().default(''),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    categories: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    /** show the sticky table of contents on wide screens (on by default) */
    /** optional cover image, shown on the list and at the top of the article */
    cover: z.string().optional(),
    /** pin to the top of the archive; lower numbers come first */
    pinned: z.number().optional(),
    coverAlt: z.string().optional(),
    toc: z.boolean().default(true),
    lang: z.enum(['en', 'zh', 'zh-hant']).default(defaultLang ?? 'en'),
  });

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: postSchema({ defaultLang: 'en' }),
});

const postsZh = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts-zh' }),
  schema: postSchema({ defaultLang: 'zh' }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(''),
  }),
});

/** Docs: path is the section, frontmatter `order` sorts inside it. */
const docSchema = z.object({
  title: z.string(),
  description: z.string().default(''),
  order: z.number().default(100),
});

const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/docs' }),
  schema: docSchema,
});

const docsZh = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/docs-zh' }),
  schema: docSchema,
});

/** Long-form investigations. Same shape as posts plus a `type` badge. */
const researchSchema = z.object({
  title: z.string(),
  description: z.string().default(''),
  date: z.coerce.date(),
  type: z.string().default('Note'),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
});

const research = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/research' }),
  schema: researchSchema,
});

const researchZh = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/research-zh' }),
  schema: researchSchema,
});

/** A weekly series: same as posts with an issue number for the “№ 12” label. */
const weeklySchema = z.object({
  title: z.string(),
  description: z.string().default(''),
  date: z.coerce.date(),
  issue: z.number(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
});

const weekly = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/weekly' }),
  schema: weeklySchema,
});

const weeklyZh = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/weekly-zh' }),
  schema: weeklySchema,
});

export const collections = { posts, postsZh, pages, research, researchZh, weekly, weeklyZh, docs, docsZh };
