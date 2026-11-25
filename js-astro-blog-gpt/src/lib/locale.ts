/** Canonical BCP 47 identifiers are also safe URL and filename components. */
export function canonicalLocale(locale: string): string {
  if (!/^[a-z]{2,8}(?:-[a-z0-9]{1,8})*$/i.test(locale))
    throw new Error(
      `Invalid locale: ${locale}. Use a BCP 47 tag such as ja or pt-BR.`,
    );
  return Intl.getCanonicalLocales(locale)[0];
}

export function localeChain(locale: string): string[] {
  const canonical = canonicalLocale(locale);
  // Extension/private-use sequences are indivisible, not parent languages.
  const parts = new Intl.Locale(canonical).baseName.split('-');
  return [
    ...new Set([
      canonical,
      ...parts.map((_, index) =>
        parts.slice(0, parts.length - index).join('-'),
      ),
    ]),
  ];
}
