/**
 * Content Collections — the single source of truth for all typed content.
 *
 * Astro 6 uses the Content Layer API:
 *   - Each collection needs a `loader` (where to find files) and an optional
 *     `schema` (Zod object that validates frontmatter at build time).
 *   - After running `astro dev` or `astro build`, Astro writes generated
 *     TypeScript types into `.astro/types.d.ts` automatically.
 *
 * Why schemas matter:
 *   A missing or wrong-typed frontmatter field causes a clear build error
 *   instead of a silent runtime bug or broken page.
 *
 * Docs: https://docs.astro.build/en/guides/content-collections/
 */

import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// ---------------------------------------------------------------------------
// Shared schema fragments — reuse across collections to stay DRY.
// ---------------------------------------------------------------------------

/** Fields every content piece should have for SEO and listings. */
const seoFields = z.object({
  title: z.string(),
  description: z.string(),
});

// ---------------------------------------------------------------------------
// Blog collection
//
// Files live in src/content/blog/ as Markdown or MDX.
// Access entries via: const posts = await getCollection('blog');
// Remove this collection if you don't need a blog.
// ---------------------------------------------------------------------------

const blog = defineCollection({
  // glob() scans a directory and creates one entry per matched file.
  // The entry `id` is the filename without extension (e.g. "my-first-post").
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),

  schema: seoFields.extend({
    pubDate: z.coerce.date(),           // accepts ISO strings: "2024-01-15"
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),   // relative path or remote URL
    draft: z.boolean().default(false),  // draft: true → excluded from getCollection()
  }),
});

// ---------------------------------------------------------------------------
// Add more collections below as your project grows, for example:
//
//   const projects = defineCollection({
//     loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
//     schema: seoFields.extend({ ... }),
//   });
//
// Then register each one in the `collections` export.
// ---------------------------------------------------------------------------

export const collections = {
  blog,
};
