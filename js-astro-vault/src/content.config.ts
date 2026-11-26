import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const log = defineCollection({
    loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/log' }),
    schema: ({ image }) => z.object({
        date: z.date(),
        cover: image(),
        tags: z.array(image()).default([]),
    })
});

export const collections = { log };