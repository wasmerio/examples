import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const changelog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/changelog' }),
  schema: z.object({ version: z.string(), date: z.coerce.date(), tag: z.enum(['feature', 'fix', 'store']).default('feature') }),
});

export const collections = { changelog };
