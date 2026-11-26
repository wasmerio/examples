import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { locales, collectionSuffix } from './lib/i18n';
import { hasDocDir } from './lib/doc-dirs';
import { products } from '../site.config';

// Products that ship a localized docs collection. Driven by the `products`
// array in lib/i18n.ts so the landing page and content collections stay in
// sync. Adding a product there auto-generates `<product>Docs<Locale>`
// collections for every locale. A product may set `base` to point its docs
// collection at a non-default directory (a path relative to the repo root,
// e.g. './docs' => ./docs/<locale>/, used by content synced in from an
// external repo); otherwise docs live under ./src/content/docs/<slug>/<locale>/.
//
// A collection is only generated for a product × locale whose docs directory
// actually exists. Products with no docs at all (a pure landing page) then
// have no Docs collections, and the call sites in lib/content.ts / lib/llms.ts
// skip getCollection() for them (guarded by the same directory check) - so a
// docs-less product builds cleanly with no "collection is empty" warnings.

const docSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  order: z.number().default(0),
});

function makeDocCollections(): Record<string, ReturnType<typeof defineCollection>> {
  const out: Record<string, ReturnType<typeof defineCollection>> = {};
  for (const product of products) {
    // Default docs location is src/content/docs/<slug>/<locale>; a product may
    // override it via `base` (a path relative to the repo root, e.g. './docs'
    // => ./docs/<locale>/, used by content synced in from an external repo).
    const baseDir = product.base ?? `./src/content/docs/${product.slug}`;
    for (const locale of locales) {
      const dir = `${baseDir}/${locale}`;
      if (!hasDocDir(product.slug, product.base, locale)) continue; // no docs for this locale
      out[`${product.slug}Docs${collectionSuffix(locale)}`] = defineCollection({
        loader: glob({ pattern: '**/*.{md,mdx}', base: dir }),
        schema: docSchema,
      });
    }
  }
  return out;
}

const postSchema = z.object({
  title: z.string(),
  date: z.date(),
  description: z.string(),
  tags: z.array(z.string()).default([]),
  author: z.string().optional(),
  source: z.string().optional(),
  draft: z.boolean().default(false),
});

// Posts are split per locale under src/content/posts/<locale>/.
// Adding a locale auto-generates a `posts<Locale>` collection.
function makePostCollections(): Record<string, ReturnType<typeof defineCollection>> {
  const out: Record<string, ReturnType<typeof defineCollection>> = {};
  for (const locale of locales) {
    out[`posts${collectionSuffix(locale)}`] = defineCollection({
      loader: glob({ pattern: '**/*.{md,mdx,html}', base: `./src/content/posts/${locale}` }),
      schema: postSchema,
    });
  }
  return out;
}

// Product landing info - one structured Markdown file per product + locale
// at src/content/product-info/<locale>/<slug>.md (locale-outer, matching the
// posts layout so the glob entry id is the product slug). The frontmatter
// drives the auto-generated landing; the body is an optional curated overview
// rendered as .prose. Adding a locale auto-generates a `productInfo<Locale>`
// collection. A hand-written landing override at
// src/components/product-landing/<slug>.astro still takes precedence over this.
const productInfoSchema = z.object({
  tagline: z.string(),
  description: z.string(),
  features: z
    .array(
      z.object({
        title: z.string(),
        body: z.string(),
        icon: z.union([z.string(), z.object({ paths: z.array(z.string()), strokeWidth: z.number().optional(), variant: z.enum(['outline', 'filled']).optional() })]).optional(),
        image: z
          .union([
            z.string(),
            z.object({
              src: z.string().optional(),
              fallback: z.string().optional(),
              gradient: z.string().optional(),
              cover: z.boolean().optional(),
            }),
          ])
          .optional(),
        span: z.number().optional(),
      }),
    )
    .default([]),
  install: z.string().optional(),
  highlights: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
  links: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
  // Landing section list - "MD declares data, code registry maps components".
  // Each entry names a section type resolved by src/lib/landing-sections.ts at
  // build time. `data` is optional: when omitted, the renderer fills it from
  // the matching product-info field (features/highlights/install/links), so a
  // plain `- type: features` entry needs no duplication. Missing `sections`
  // entirely preserves the legacy fixed order.
  sections: z
    .array(z.object({ type: z.string(), data: z.any().optional() }))
    .optional(),
});

function makeProductInfoCollections(): Record<string, ReturnType<typeof defineCollection>> {
  const out: Record<string, ReturnType<typeof defineCollection>> = {};
  for (const locale of locales) {
    out[`productInfo${collectionSuffix(locale)}`] = defineCollection({
      loader: glob({ pattern: '**/*.md', base: `./src/content/product-info/${locale}` }),
      schema: productInfoSchema,
    });
  }
  return out;
}

export const collections = {
  ...makePostCollections(),
  ...makeDocCollections(),
  ...makeProductInfoCollections(),
};
