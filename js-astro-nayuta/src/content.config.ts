import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { creativeCommonsLicenses } from '@type/copyright';

const postsCollection = defineCollection({
  loader: glob({
    pattern: ['**/[^_]*.{md,mdx}', '!**/assets/**', '!**/_*/**'],
    base: './src/content/posts',
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      publishDate: z.string(),
      views: z.string().optional(),
      cover: z
        .union([z.string().regex(/^(?:\/|https?:\/\/)/i), image()])
        .optional(),
      description: z.string().optional(),
      draft: z.boolean().default(false),
      exclude_in_search: z.boolean().default(false),
      withLeftSidebar: z.boolean().optional(),
      withProfileCard: z.boolean().optional(),
      withRightSidebar: z.boolean().optional(),
      copyright: z
        .object({
          enabled: z.boolean().optional(),
          license: z.enum(creativeCommonsLicenses).optional(),
        })
        .optional(),
      tags: z
        .array(z.string().trim().min(1, 'Tags must not be empty.'))
        .default([])
        .transform((tags) => [...new Set(tags)]),
    }),
});

export const pageSchema = z
  .looseObject({
    title: z.string(),
    description: z.string().optional(),
    template: z.string().optional().default('default'),
    slug: z.string().optional(),
    withLeftSidebar: z.boolean().optional(),
    withProfileCard: z.boolean().optional(),
    withRightSidebar: z.boolean().optional(),
    breadcrumbs: z
      .array(z.object({ text: z.string(), href: z.string() }))
      .optional(),
  })
  .superRefine((data, context) => {
    if ('rightWidgets' in data) {
      context.addIssue({
        code: 'custom',
        path: ['rightWidgets'],
        message:
          'Move rightWidgets into a local or src/content/_right.astro component.',
      });
    }
  });

const pagesCollection = defineCollection({
  loader: glob({
    base: './src/content',
    pattern: [
      'index.{md,mdx}',
      'pages/**/[^_]*.{md,mdx}',
      '!**/assets/**',
      '!**/_*/**',
    ],
    // Keep source identities distinct so routes can reject duplicate author URLs.
    generateId: ({ entry }) => entry,
  }),
  schema: pageSchema,
});

export const collections = {
  posts: postsCollection,
  pages: pagesCollection,
};
