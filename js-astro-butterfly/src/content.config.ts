import { defineCollection, type SchemaContext } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { fromHexoDate } from '@/lib/date';

const hexoDate = z.preprocess(fromHexoDate, z.date());
const optionalHexoDate = z.preprocess(fromHexoDate, z.date().optional());
const stringList = z.preprocess(
  (v) => (v == null ? [] : Array.isArray(v) ? v.map(String) : [String(v)]),
  z.array(z.string()),
);

/** Next to the Markdown file (`./my-post/cover.jpg`): encoded at build time. A public/ path or full URL: served as it is. */
const picture = (image: SchemaContext['image']) => z.union([z.string().regex(/^(\/|https?:)/), image()]);

const posts = defineCollection({
  // Hexo users: point `base` at './source/_posts' to build an existing blog unchanged
  // (front matter, abbrlink URLs and dates are read the Hexo way).
  loader: glob({ base: './src/content/posts', pattern: '**/*.md', deferRender: true }),
  schema: ({ image }) => z
    .object({
      title: z.string(),
      date: hexoDate,
      // Last update recorded by hand (optional). The effective date also follows
      // git; see getPosts() in src/lib/posts.ts.
      updated: optionalHexoDate,
      abbrlink: z.union([z.string(), z.number()]).transform(String),
      tags: stringList,
      categories: stringList,
      cover: picture(image).optional(),
      top_img: picture(image).optional(),
      description: z.string().nullish().transform((v) => v || undefined),
      comments: z.boolean().optional(),
      comment: z.boolean().optional(),
      draft: z.boolean().default(false),
    })
    .transform(({ comment, ...d }) => ({
      ...d,
      comments: d.comments ?? comment ?? true,
    })),
});

const pages = defineCollection({
  loader: glob({
    // one folder per page: src/content/pages/about/index.md → /about/
    base: './src/content/pages',
    pattern: ['*/index.md'],
    deferRender: true,
    generateId: ({ entry }) => entry.replace(/\/index\.md$/, ''),
  }),
  schema: ({ image }) => z.object({
    title: z.string(),
    date: optionalHexoDate,
    type: z.string().optional(),
    top_img: picture(image).optional(),
    comments: z.boolean().default(true),
  }),
});

export const collections = { posts, pages };
