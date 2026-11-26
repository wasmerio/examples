import { glob } from 'astro/loaders'
import { defineCollection } from 'astro:content'
import { z } from 'astro/zod'

function dedupeTags(tags: string[]) {
  const seen = new Set<string>()
  return tags
    .map((t) => t.trim().toLowerCase())
    .filter((t) => (t && !seen.has(t) ? (seen.add(t), true) : false))
}

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      /** Post title */
      title: z.string().max(80),
      /** Short summary shown in lists and meta description */
      description: z.string().max(200),
      publishDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]).transform(dedupeTags),
      /** Previous site-relative article paths. Omit the deployment base. */
      aliases: z.array(z.string()).default([]),
      /** Explicit reading order within a named series. */
      series: z
        .object({ name: z.string().trim().min(1), order: z.number().int().positive() })
        .optional(),
      /** Language of the article, used for pronunciation. Accepts 中文, English or a BCP 47 tag. */
      language: z.string().optional(),
      /** Optional cover image — a local asset referenced relative to this file,
       *  e.g. `src: ../../assets/cover.png`. Optimized by the Astro image
       *  service (sharp) with responsive sizes. */
      heroImage: z
        .object({
          src: image(),
          alt: z.string().optional()
        })
        .optional(),
      /** Hidden from lists but still accessible by URL */
      draft: z.boolean().default(false),
      /** Per-post comment toggle */
      comment: z.boolean().default(true)
    })
})

export const collections = { blog }
