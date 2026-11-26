import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One file per issue. The filename is the URL: /issues/<filename>.
// Not fields, computed in src/lib/issues.ts: the issue number (date order + newsletter.firstIssue),
// the ISO year.week label, members-only (the body contains <!-- cut -->), word counts and the free share.
const issues = defineCollection({
  loader: glob({ base: './src/content/issues', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      dek: z.string(), // the italic line under the title; also the meta description
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      topics: z.array(z.string()).default([]),
      ogImage: image().optional(), // absent: site.defaultOgImage
      draft: z.boolean().default(false),
    }),
});

export const collections = { issues };
