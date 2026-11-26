// Shared docs-directory resolution for product docs collections.
//
// content.config.ts (which registers `<product>Docs<Locale>` collections) and
// the call sites in lib/content.ts / lib/llms.ts (which query them) must agree
// on *which* product × locale pairs have a docs directory. A product with no
// docs at all (a pure landing page) has no Docs collections registered, and
// calling getCollection() on an unregistered collection warns - so the call
// sites skip the query for those pairs. This module is the single source of
// truth for that decision, kept free of any astro:content import so it can be
// used by both the collection generator and plain Node test mocks.

import { existsSync } from 'node:fs';
import { join } from 'node:path';

/** Docs directory for a product + locale, resolving the product `base` exactly
 *  like content.config.ts does when it registers the collection. */
export function docDir(productSlug: string, base: string | undefined, locale: string): string {
  const baseDir = base ?? `./src/content/docs/${productSlug}`;
  return `${baseDir}/${locale}`;
}

/** True when a product has an actual docs directory for this locale. Mirrors
 *  what content.config.ts registers: directory exists <=> collection exists. */
export function hasDocDir(productSlug: string, base: string | undefined, locale: string): boolean {
  return existsSync(join(process.cwd(), docDir(productSlug, base, locale)));
}
