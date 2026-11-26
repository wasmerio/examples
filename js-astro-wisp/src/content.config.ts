import { defineCollection } from 'astro:content';
import { pagesLoader, pagesSchema, postsLoader, postsSchema } from 'astro-wisp/content';

export const collections = {
  posts: defineCollection({ loader: postsLoader(), schema: postsSchema() }),
  pages: defineCollection({ loader: pagesLoader(), schema: pagesSchema() }),
};
