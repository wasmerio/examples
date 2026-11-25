import { defineCollection, z } from 'astro:content';
import SiteOptions from "../site.config.mjs"

const articleCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        pubDate: z.date(),
        author: z.string().default(SiteOptions.defaultAuthorName),
        category: z.string(),
        tags: z.array(z.string()),
        featured: z.boolean().default(false),
        thumb: z.string().optional(),
        large: z.string().optional(),
    }),
});

export const collections = {
    article: articleCollection,
};
