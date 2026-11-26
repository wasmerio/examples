import { defineCollection, reference } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One row per desk. The id in desks.json IS the route segment (/world) and the value articles
// put in `desk`, so there is no second slug field to fall out of sync with it.
const desks = defineCollection({
  loader: file('./src/content/desks.json'),
  schema: z.object({
    name: z.string(), // printed on the desk bar and, by default, in the kicker box
    blurb: z.string().optional(), // absent: the desk front opens straight into the list
    order: z.number().int().positive(), // navigation and home order
  }),
});

// One file per article. The filename is the slug: /<desk>/<filename>.
const articles = defineCollection({
  loader: glob({ base: './src/content/articles', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      deck: z.string(), // two or three lines. Carries the cover line and the desk list
      standfirst: z.string().optional(), // the lead paragraph under the headline; falls back to deck
      desk: reference('desks'),
      kicker: z.string().optional(), // label box; falls back to the desk name
      byline: z.array(reference('authors')).nonempty(),
      date: z.coerce.date(),
      // The picture leads here, so it is not optional, and neither is its alt text.
      hero: image(),
      heroAlt: z.string(),
      heroCaption: z.string().optional(),
      heroCredit: z.string(), // a photograph that ships without its source is a liability
      // Where the plate crops when the cover lines sit over the picture.
      heroFocus: z.enum(['left', 'center', 'right']).default('center'),
      format: z.enum(['report', 'photoessay', 'brief']).default('report'),
      featured: z.boolean().default(false), // candidate for the home plate's cover lines
      // The article rail. `kind` is the discriminator: new rail blocks are added to this union
      // rather than to a second field, so the order on the page stays the author's.
      rail: z
        .array(
          z.discriminatedUnion('kind', [
            z.object({
              kind: z.literal('stat'),
              value: z.string(), // set in tnum figures, so keep it short
              label: z.string(),
              source: z.string().optional(),
            }),
          ]),
        )
        .optional(),
      // Subjects. There is no tag index here; what they do is weight the related reading at
      // the foot of a piece, so two pieces that share one are offered for each other.
      tags: z.array(z.string()).optional(),
      draft: z.boolean().default(false),
    }),
});

// Bylines. An entry's id is the value articles use in `byline`.
const authors = defineCollection({
  loader: file('./src/content/authors.json'),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string().optional(), // printed in the colophon masthead
      // Masthead order. `getCollection` returns authors by id, which is alphabetical and not
      // an order any masthead was ever set in, so the running order is a field like desks'.
      order: z.number().int().positive().default(99),
      bio: z.string().optional(), // printed under the article
      portrait: image().optional(),
      links: z.array(z.object({ label: z.string(), href: z.url() })).optional(),
    }),
});

export const collections = { desks, articles, authors };
