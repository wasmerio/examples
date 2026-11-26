import { defineCollection } from 'astro:content';
import { pagesLoader, pagesSchema, postsLoader, postsSchema } from 'astro-wisp/content';

export const collections = {
  // 扩展 frontmatter：postsSchema({ extend: z.object({ series: z.string().optional() }) })
  posts: defineCollection({ loader: postsLoader(), schema: postsSchema() }),
  pages: defineCollection({ loader: pagesLoader(), schema: pagesSchema() }),
};
