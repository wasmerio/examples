import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).optional(),
    // Thêm readingTime vào schema nhưng đặt là optional
    readingTime: z.string().optional(),
  }),
});

export const collections = {
  'blog': blogCollection,
};

