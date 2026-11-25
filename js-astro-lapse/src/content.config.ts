/**
 * Content collections.
 *
 * blog: one Markdown file per post in src/content/blog/<slug>.md. The file
 * name is the URL (/blog/<slug>). Frontmatter carries the card and header
 * fields; the body is ordinary Markdown with three conventions that render as
 * the article components:
 *
 *   > **Callout title**          a blockquote whose first line is bold
 *   >                            becomes the grey Callout card.
 *   > Callout body.
 *
 *   1. First step                an ordered list becomes the numbered
 *   2. Second step               Step rows (01, 02 ... drawn automatically).
 *
 *   <figure class="figure">      the bar-chart Figure, written as HTML
 *   ...                          (see what-2-4-million-support-messages-look-like.md).
 *   </figure>
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    /** Must match one of the tabs in src/content/pages/blog.json to be filterable. */
    category: z.string(),
    date: z.coerce.date(),
    readTime: z.string(),
    excerpt: z.string(),
    /** The newest featured post fills the large card at the top of /blog. */
    featured: z.boolean().default(false),
    /** Path under public/, e.g. /assets/blog/my-post.webp */
    cover: z.string(),
    coverAlt: z.string().default(''),
    author: z.object({
      name: z.string(),
      role: z.string(),
      avatar: z.string(),
      avatarAlt: z.string().default(''),
    }),
  }),
});

export const collections = { blog };
