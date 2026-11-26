import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/**
 * The Markdown CMS: one folder per locale, identical file names inside.
 *
 *   src/content/blog/en/quiet-tools.md   ->  /blog/quiet-tools
 *   src/content/blog/fr/quiet-tools.md   ->  /fr/blog/quiet-tools
 *
 * The file name is the translation key, so the French translation of a post is
 * the file at the same path under `fr/`, and nothing else has to record the
 * pairing. `src/content/blog/.i18n-lock.json` records which English version
 * each translation was made from, which is what makes "out of date" a fact
 * rather than a guess.
 *
 * The id keeps its locale prefix for every locale, English included. Astro's
 * loader strips a trailing `/index` from ids, so a locale folder that ever
 * gained an `index.md` would produce the id `fr` — indistinguishable from the
 * folder itself. Keeping the prefix uniform means the route never has to care.
 */
const blog = defineCollection({
  loader: glob({
    base: './src/content/blog',
    pattern: '*/*.md',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    /* Dates are data. They are never sent to a translator, and they come from
       the English file even on a translated page, so a post cannot be published
       on one date in English and another in German. */
    date: z.coerce.date(),
    /* Optional: this site's own posts are project documentation and carry no
       byline. A real blog sets it, and the translation script copies it from
       the English file rather than translating it, like `date` and `glyph`. */
    author: z.string().optional(),
    /* One of the names in `src/components/Glyph.astro`. Data, not copy: a
       translated glyph name draws nothing. */
    glyph: z.enum(['grid', 'arc', 'stack', 'split']).default('grid'),
  }),
});

export const collections = { blog };
