import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

import { siteConfig } from '@data/siteConfig';

const categoryKeys = Object.keys(siteConfig.publicationCategories);
if (categoryKeys.length === 0) {
  throw new Error(
    'siteConfig.publicationCategories must define at least one category'
  );
}

const categorySchema = z
  .enum(categoryKeys as [string, ...string[]])
  .default(categoryKeys[0]);

/** Normalizes a single string or array of strings into a trimmed string array */
const stringListSchema = z
  .union([z.array(z.string()), z.string()])
  .transform((val) => (Array.isArray(val) ? val : [val]))
  .transform((items) => items.map((item) => item.trim()).filter(Boolean))
  .default([]);

/** Core base schema for site content */
export const baseContentSchema = z.object({
  permalink: z.string().trim().optional(),
  title: z.string().trim(),
  description: z.string().trim().optional(),
});

/** Extension for content collections requiring a publication or event date */
export const datedContentSchema = baseContentSchema.extend({
  date: z.coerce.date(),
});

/** Layout and presentation options positioned at the end of frontmatter */
export const layoutSchema = z.object({
  author_profile: z.boolean().default(true),
  toc: z.boolean().optional(),
  image: z.string().trim().optional(),
});

export const blogSchema = datedContentSchema
  .extend({
    modified: z.coerce.date().optional(),
    read_time: z.boolean().default(true),
    tags: stringListSchema,
    draft: z.boolean().default(false),
  })
  .extend(layoutSchema.shape);

export const publicationSchema = datedContentSchema
  .extend({
    category: categorySchema,
    venue: z.string().trim().optional(),
    citation: z.string().trim().optional(),
    pdf_url: z.string().trim().optional(),
    paper_url: z.string().trim().optional(),
    slides_url: z.string().trim().optional(),
    code_url: z.string().trim().optional(),
    bibtex: z.string().trim().optional(),
  })
  .extend(layoutSchema.shape);

export const talkSchema = datedContentSchema
  .extend({
    type: z.string().trim().optional(),
    venue: z.string().trim().optional(),
    slides_url: z.string().trim().optional(),
  })
  .extend(layoutSchema.shape);

export const teachingSchema = baseContentSchema
  .extend({
    year: z.coerce.number().int(),
    semester: z.enum(['Autumn', 'Fall', 'Spring', 'Summer', 'Winter']),
    type: z.string().trim().optional(),
    venue: z.string().trim().optional(),
  })
  .extend(layoutSchema.shape);

export const portfolioSchema = datedContentSchema
  .extend({
    timeline: z.string().trim().optional(),
    venue: z.string().trim().optional(),
    pdf_url: z.string().trim().optional(),
    slides_url: z.string().trim().optional(),
    code_url: z.string().trim().optional(),
  })
  .extend(layoutSchema.shape);

export const pageSchema = z
  .object({
    title: z.string().trim(),
    description: z.string().trim().optional(),
  })
  .extend(layoutSchema.shape);

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: blogSchema,
});

const publications = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/publications',
  }),
  schema: publicationSchema,
});

const talks = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/talks' }),
  schema: talkSchema,
});

const teaching = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/teaching' }),
  schema: teachingSchema,
});

const portfolio = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/portfolio' }),
  schema: portfolioSchema,
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }),
  schema: pageSchema,
});

export const collections = {
  blog,
  publications,
  talks,
  teaching,
  portfolio,
  pages,
};
