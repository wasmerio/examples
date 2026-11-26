export const WIKI_PREFIX = '/wiki/iluminacion/';
export function wikiUrl(slug: string): string { return `${WIKI_PREFIX}${slug.replace(/^\/+|\/+$/g, '')}/`; }
export function wikiLetter(title: string): string { return title.trim().charAt(0).toLocaleUpperCase('en-US'); }
export function sortWikiTerms<T extends { data: { title: string } }>(terms: T[]): T[] { return [...terms].sort((a, b) => a.data.title.localeCompare(b.data.title, 'en', { sensitivity: 'base' })); }
export function normalizeWikiSearchText(value: string): string { return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('en-US').trim(); }
export function searchWikiTerms<T extends { id: string; data: { title: string; shortDefinition: string; aliases?: string[]; category: string; draft?: boolean } }>(terms: T[], query: string): T[] {
  const normalized = normalizeWikiSearchText(query);
  return sortWikiTerms(terms.filter((term) => !term.data.draft && (!normalized || normalizeWikiSearchText([term.data.title, term.data.shortDefinition, term.data.category, ...(term.data.aliases ?? [])].join(' ')).includes(normalized))));
}
