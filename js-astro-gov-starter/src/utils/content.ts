import { defaultLocale, locales, type Locale } from '../i18n/utils';

/**
 * Content collections are translated by adding a locale subdirectory beside the
 * default-locale files, so a translator edits real Markdown rather than strings
 * squeezed into frontmatter:
 *
 *   src/content/services/snap.mdx        <- English (default locale)
 *   src/content/services/es/snap.mdx     <- Spanish
 *
 * Both files describe the same service and share the URL slug `snap`; only the
 * prose and the frontmatter values differ. A translation is always optional —
 * a page falls back to the default locale's file when one is missing, so adding
 * a language never breaks a build and partial translations ship fine.
 */

/** Locale subdirectory names. The default locale lives at the collection root. */
const localeDirs = new Set<string>(locales.filter((locale) => locale !== defaultLocale));

/**
 * URL slug for a content entry: no file extension, and no locale subdirectory.
 * Both `snap.mdx` and `es/snap.mdx` yield `snap`, which is what makes the two
 * files describe one service at one slug in two languages.
 */
export function idToSlug(id: string): string {
  const withoutExtension = id.replace(/\.(md|mdx)$/, '');
  const [first, ...rest] = withoutExtension.split('/');
  return localeDirs.has(first) ? rest.join('/') : withoutExtension;
}

/** The language a content file is written in, taken from its subdirectory. */
export function entryLocale(id: string): Locale {
  const [first] = id.split('/');
  return localeDirs.has(first) ? (first as Locale) : defaultLocale;
}

/**
 * Reduce a collection to one entry per slug, in the requested locale where a
 * translation exists and the default locale otherwise. Input order is preserved
 * per slug, so callers can still sort by `order` afterwards.
 */
export function entriesForLocale<T extends { id: string }>(entries: T[], locale: Locale): T[] {
  const bySlug = new Map<string, T>();

  for (const entry of entries) {
    const slug = idToSlug(entry.id);
    const written = entryLocale(entry.id);

    // The requested locale always wins; the default locale only fills a gap.
    if (written === locale) {
      bySlug.set(slug, entry);
    } else if (written === defaultLocale && !bySlug.has(slug)) {
      bySlug.set(slug, entry);
    }
  }

  return [...bySlug.values()];
}
