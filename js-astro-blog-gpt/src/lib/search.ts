export const searchScopes = ['all', 'articles', 'title', 'body'] as const;
export type SearchScope = (typeof searchScopes)[number];
export type SearchEntry = {
  title: string;
  description: string;
  body: string;
  url: string;
  kind: 'posts' | 'pages' | 'categories' | 'tags';
};
export function searchScope(value: string | null | undefined): SearchScope {
  return searchScopes.find((scope) => scope === value) ?? 'articles';
}
export function matchesSearch(
  entry: SearchEntry,
  query: string,
  scope: SearchScope,
) {
  if (scope !== 'all' && entry.kind !== 'posts') return false;
  const text = (
    scope === 'title'
      ? `${entry.title} ${entry.description}`
      : scope === 'body'
        ? entry.body
        : `${entry.title} ${entry.description} ${entry.body}`
  ).toLocaleLowerCase();
  return query
    .toLocaleLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => text.includes(term));
}
