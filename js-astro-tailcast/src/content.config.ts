/**
 * Astro 5+ requires this file at `src/content.config.ts` to define
 * content collections used by `getCollection()`. The location is hardcoded
 * by the framework - moving or renaming this file will break content loading.
 *
 * @see https://docs.astro.build/en/guides/content-collections/
 */
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      subtitle: z.string(),
      description: z.string(),
      date: z.date(),
      image: image(),
      icon: z.string(),
      author: z.object({
        name: z.string(),
        role: z.string(),
        avatar: image(),
      }),
      readTime: z.string(),
      tags: z.array(z.string()),
    }),
});

export const collections = { blog };
