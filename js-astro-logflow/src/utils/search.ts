export interface SearchIndexItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  pubDate: string;
  url: string;
}

export type PreparedSearchIndexItem = SearchIndexItem & {
  normalized: {
    title: string;
    description: string;
    tags: string;
  };
};

export function normalizeSearchValue(value: string) {
  return value.normalize("NFKC").toLowerCase();
}

export function getSearchTerms(query: string) {
  return Array.from(new Set(normalizeSearchValue(query).trim().split(/\s+/u).filter(Boolean)));
}

export function prepareSearchIndex(items: SearchIndexItem[]): PreparedSearchIndexItem[] {
  return items.map((item) => ({
    ...item,
    normalized: {
      title: normalizeSearchValue(item.title),
      description: normalizeSearchValue(item.description),
      tags: normalizeSearchValue(item.tags.join(" ")),
    },
  }));
}

function countMatches(value: string, term: string) {
  let count = 0;
  let offset = 0;
  while ((offset = value.indexOf(term, offset)) !== -1) {
    count += 1;
    offset += Math.max(term.length, 1);
  }
  return count;
}

function getSearchScore(item: PreparedSearchIndexItem, terms: string[]) {
  const fields = item.normalized;
  const combined = `${fields.title} ${fields.tags} ${fields.description}`;
  if (!terms.every((term) => combined.includes(term))) return -1;

  return terms.reduce(
    (score, term) =>
      score +
      countMatches(fields.title, term) * 12 +
      countMatches(fields.tags, term) * 8 +
      countMatches(fields.description, term) * 4,
    0,
  );
}

export function rankSearchResults(
  items: PreparedSearchIndexItem[],
  terms: string[],
  maxResults: number,
) {
  return items
    .map((item) => ({ item, score: getSearchScore(item, terms) }))
    .filter((result) => result.score >= 0)
    .sort((a, b) => b.score - a.score || Date.parse(b.item.pubDate) - Date.parse(a.item.pubDate))
    .slice(0, maxResults)
    .map((result) => result.item);
}
