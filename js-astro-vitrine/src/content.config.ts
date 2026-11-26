import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One entry is one object in the archive. The plate grid, the object page and the
// collection pages all read from here; nothing about an object lives in a page.
const objects = defineCollection({
  // `_drafts/` is out of the pattern rather than filtered later: a file the loader
  // reads has its `image()` registered, and an asset registered is an asset built.
  // `draft: true` keeps an entry off the pages; the folder keeps its photograph out
  // of the build. An object not ready to be seen wants both.
  loader: glob({
    base: './src/content/objects',
    pattern: ['**/*.{md,mdx}', '!_drafts/**'],
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      // Cut out or shot on white: the plate sets the object *in* the cell with
      // `contain` and padding, so the aspect ratio is free and never cropped.
      image: image(),
      // The line above the cell. A label, not a sentence: "Glass", "Cabinetwork".
      caption: z.string(),
      // Printed as written. A catalogue dates things "ca. 1600" or "1893–96", which
      // is why the display string is the required field and the number is not.
      dateText: z.string(),
      year: z.number().int().optional(), // sorting only; entries without it keep file order
      medium: z.string(),
      dimensions: z.string().optional(),
      // Catalogue number. Left out, the plate numbers the entry by its position in
      // the collection; set it to print the number the archive already uses.
      accession: z.string().optional(),
      collection: reference('collections'),
      credit: z.string().optional(),
      // Cell width in the plate grid. A layout value on purpose: importance is an
      // editorial call, and this is where the editor makes it.
      span: z.union([z.literal(1), z.literal(2)]).default(1),
      featured: z.boolean().default(false), // eligible for the home plate
      draft: z.boolean().default(false),
    }),
});

// The archive's own divisions. Order is explicit because a catalogue's sections are
// arranged, not alphabetised.
const groups = defineCollection({
  loader: glob({ base: './src/content/collections', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(), // one paragraph, printed above the plate grid
      order: z.number().int().positive().optional(),
      cover: image().optional(),
    }),
});

// The key is the collection name used everywhere else, so `groups` is only the
// local binding: `collections` is taken by Astro's own export.
export const collections = { objects, collections: groups };
