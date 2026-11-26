import { slugifyStr } from "@/utils/slugify";
import { effectiveTime, type ContentItem } from "./items";

const topicSlugs = (item: ContentItem) => new Set(item.tags.map(slugifyStr));

/**
 * Items that share at least one tag with `current`, best match first: shared
 * tag count, then effective date (newest first), then title.
 */
export function getRelatedItems(
  current: ContentItem,
  all: ContentItem[],
  limit = 3
): ContentItem[] {
  const own = topicSlugs(current);
  if (own.size === 0) return [];

  return all
    .filter(item => item.key !== current.key)
    .map(item => ({
      item,
      score: [...topicSlugs(item)].filter(slug => own.has(slug)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        effectiveTime(b.item) - effectiveTime(a.item) ||
        a.item.title.localeCompare(b.item.title)
    )
    .slice(0, limit)
    .map(({ item }) => item);
}
