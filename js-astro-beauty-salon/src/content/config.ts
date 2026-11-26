// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const tipsCollection = defineCollection({
  type: 'content', // Son archivos Markdown (.md)
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    image: z.string().optional(), // URL de la imagen de portada
    author: z.string().default('Beauty Salon'),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = {
  tips: tipsCollection,
};
