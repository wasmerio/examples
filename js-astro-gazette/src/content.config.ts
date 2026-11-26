import { defineCollection, reference } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Department names print in the kicker, the contents rows and the folio. Renaming one is a
// content migration: every article that carries the old value fails validation until it is edited.
const departments = ['Feature', 'Essay', 'Report', 'Interview', 'Dispatch'] as const;

// One row per issue. `number` is the URL (/issues/4) and the folio number; the id is only a key.
const issues = defineCollection({
  loader: file('./src/content/issues.json'),
  schema: ({ image }) =>
    z
      .object({
        number: z.number().int().positive(),
        date: z.coerce.date(),
        coverLine: z.string(), // the line printed on the cover. It does not have to be an article title
        coverArticle: reference('articles'),
        coverImage: image().optional(), // no image: the cover falls back to a spot-colour panel
        coverImageAlt: z.string().optional(),
        editorsNote: z.string().optional(), // absent: the note block is not rendered at all
        draft: z.boolean().default(false),
      })
      .refine((d) => !d.coverImage || d.coverImageAlt, {
        message: 'coverImageAlt is required when coverImage is set',
        path: ['coverImageAlt'],
      }),
});

// One file per article. The filename is the URL: /issues/<issue number>/<filename>.
const articles = defineCollection({
  loader: glob({ base: './src/content/articles', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        subtitle: z.string().optional(),
        issue: reference('issues'),
        order: z.number().int().positive(), // position in the contents, and the folio numerator
        department: z.enum(departments),
        authors: z.array(reference('authors')).nonempty(),
        image: image().optional(), // opener
        imageAlt: z.string().optional(),
        imageCredit: z.string().optional(),
        pullQuote: z.string().optional(), // chosen by the editor, not pulled from the body
        dropCap: z.boolean().default(false),
        draft: z.boolean().default(false),
      })
      .refine((d) => !d.image || d.imageAlt, {
        message: 'imageAlt is required when image is set',
        path: ['imageAlt'],
      }),
});

// Bylines. An entry's id is the value articles use in `authors`.
const authors = defineCollection({
  loader: file('./src/content/authors.json'),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      bio: z.string().optional(), // printed under the article
      image: image().optional(),
    }),
});

export const collections = { issues, articles, authors };
