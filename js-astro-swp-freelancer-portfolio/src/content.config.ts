import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Raster images live in `public/images/` and are referenced by their
 * site-absolute path, e.g. `/images/project-console.webp`.
 */
const imageRef = z.object({
  src: z.string(),
  alt: z.string(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

/**
 * Case studies.
 *
 * A project shows either a photograph (`image`) or one of the inline SVG
 * artworks registered in `src/components/art/registry.ts` (`artwork`).
 */
const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    /** Shown on the card and in the case-study header. */
    client: z.string(),
    year: z.string(),
    /** Drives the filter chips on /work. */
    category: z.enum(['Product', 'Brand', 'Web']),
    /** One line under the title on cards. */
    excerpt: z.string(),
    /** Meta description for the case-study page. */
    description: z.string(),
    image: imageRef.optional(),
    artwork: z.enum(['identity', 'dashboard', 'app-screens']).optional(),
    services: z.array(z.string()).default([]),
    technologies: z.array(z.string()).default([]),
    results: z
      .array(z.object({ value: z.string(), label: z.string() }))
      .default([]),
    externalUrl: z.url().optional(),
    /** Featured projects appear on the homepage. */
    featured: z.boolean().default(false),
    /** Lower numbers sort first. */
    order: z.number().default(0),
    draft: z.boolean().default(false),
  }),
});

/** Service / engagement pages. */
const services = defineCollection({
  loader: glob({ base: './src/content/services', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    /** Icon id from `src/components/icons/IconSprite.astro`. */
    icon: z.enum(['grid', 'layers', 'pen', 'code', 'chart', 'spark', 'device', 'type', 'motion', 'flag']),
    /** Label in the card corner, e.g. `S/01`. */
    number: z.string(),
    excerpt: z.string(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    features: z.array(z.string()).default([]),
    process: z.array(z.object({ title: z.string(), body: z.string() })).default([]),
    ctaLabel: z.string().default('Ask for a scope'),
    order: z.number().default(0),
    draft: z.boolean().default(false),
  }),
});

/** Journal posts. */
const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.string(),
    /** Plain string so you stay in control of the wording. */
    readingTime: z.string(),
    image: imageRef,
    author: z.string(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, services, blog };
