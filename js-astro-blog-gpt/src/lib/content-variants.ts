import { canonicalLocale } from './locale.ts';

/** A content family is identified by its directory and filename, not its URL slug. */
export function fileIdentity(file: string, locales: readonly string[]) {
  const stem = file.replace(/\\/g, '/').replace(/\.(md|mdx)$/i, '');
  const match = stem.match(/\.([^./]+)$/);
  let locale = match
    ? locales.find((locale) => locale.toLowerCase() === match[1].toLowerCase())
    : undefined;
  if (match) {
    try {
      // Disabling a locale must not turn its translations into neutral content.
      locale = canonicalLocale(locale ?? match[1]);
    } catch {
      // Dotted filenames with non-locale suffixes retain their entire stem.
    }
  }
  const key = locale && match ? stem.slice(0, -(match[1].length + 1)) : stem;
  return { key, locale, bundle: key.split('/').at(-1) === 'index' };
}

export function chooseVariants<
  T extends { data: { _key: string; _locale?: string } },
>(
  entries: T[],
  locale: string,
  defaultLocale: string,
  locales: readonly string[],
): T[] {
  const families = new Map<string, Map<string, T>>();
  for (const entry of entries) {
    const versions = families.get(entry.data._key) ?? new Map<string, T>();
    const language = entry.data._locale ?? '';
    if (versions.has(language))
      throw new Error(
        `Duplicate content variant: ${entry.data._key} (${language || 'unsuffixed'}). Use one .md or .mdx file per variant.`,
      );
    versions.set(language, entry);
    families.set(entry.data._key, versions);
  }
  const order = [...new Set([locale, '', defaultLocale, ...locales])];
  return [...families.values()].flatMap((versions) => {
    for (const language of order) {
      const version = versions.get(language);
      if (version) return [version];
    }
    return [];
  });
}

export function assertUniqueSlugs<T extends { data: { slug: string } }>(
  entries: T[],
  context: string,
): T[] {
  const slugs = new Set<string>();
  for (const { data } of entries) {
    if (slugs.has(data.slug))
      throw new Error(`Duplicate ${context} slug: ${data.slug}`);
    slugs.add(data.slug);
  }
  return entries;
}

/** All translations share a slug, including neutral, disabled and unpublished versions. */
export function assertMatchingSlugs<
  T extends {
    id?: string;
    data: { _key: string; _locale?: string; slug: string };
  },
>(entries: T[], warn?: (message: string) => void): T[] {
  const families = new Map<string, T>();
  const source = (entry: T) =>
    entry.id ?? `${entry.data._key} (${entry.data._locale || 'unsuffixed'})`;
  for (const entry of entries) {
    const { data } = entry;
    const previous = families.get(data._key);
    if (previous && previous.data.slug !== data.slug) {
      const message = `Content translations must use the same slug: ${data._key} (${source(previous)}: ${previous.data.slug}, ${source(entry)}: ${data.slug}).`;
      warn?.(message);
      throw new Error(message);
    }
    families.set(data._key, entry);
  }
  return entries;
}
