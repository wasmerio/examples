// 1. Import utilities from `astro:content`
import { defineCollection } from 'astro:content';

// 2. Import loader(s)
import { glob } from 'astro/loaders';

// 3. Import Zod
import { z, coerce } from 'astro/zod';

import octiconsData from '@primer/octicons/build/data.json' with { type: 'json' };
import type { IconName } from '@primer/octicons';

// full list: https://primer.style/octicons/
const octicons = Object.keys(octiconsData) as IconName[];

// 4. Define your collection(s)
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string().meta({ description: 'Project title/name' }),
    icon: z.enum(octicons).meta({ description: 'Icon (via octicons)' }),
    link: z.url().meta({ description: 'Link to project' }),
    stack: z.array(z.string()).meta({ description: 'Tech stack' }).optional(),
  }),
});

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string().meta({ description: 'Job title' }),
    company: z.string(),
    period: z
      .string()
      .meta({ description: 'A human-readable date range' })
      .transform((val, ctx) => {
        // split into two date strings and attempt to coerce them into actual date objects
        const res = val
          .split('-')
          .map(x => x.trim())
          .map(x => (x === 'Present' ? new Date().toDateString() : x))
          .map(date => coerce.date().safeParse(date))
          .filter(r => r.success);

        // if we don't receive exactly two successfully parsed dates, throw an error
        // inspired by this: https://zod.dev/api?id=transforms
        if (res.length !== 2) {
          ctx.issues.push({
            code: 'custom',
            input: val,
            message: `Period must be a valid date range (where the word 'Present' is allowed for the end date) separated by a hyphen (e.g., "Oct 2024 - Apr 2025", "Oct 2024 - Present")`,
          });

          return z.NEVER;
        }

        // date will always be defined due to the above typeguard.
        // store the parsed dates in the result for future sorting
        return { raw: val, start: res[0]?.data as Date, end: res[1]?.data as Date };
      }),
  }),
});

// 5. Export a single `collections` object to register your collection(s)
export const collections = { projects, work };
