import type { ContentItem } from "./content/items";
import { slugifyStr } from "./slugify";

type Tag = {
  tag: string;
  tagName: string;
};

/** Sorted tags of already-visible items, unique by slug (`tag`); `tagName` is the label. */
export function getUniqueTags(items: ContentItem[]) {
  const tags: Tag[] = items
    .flatMap(item => item.tags)
    .map(tag => ({ tag: slugifyStr(tag), tagName: tag }))
    .filter(
      (value, index, self) =>
        self.findIndex(tag => tag.tag === value.tag) === index
    )
    .sort((tagA, tagB) => tagA.tag.localeCompare(tagB.tag));
  return tags;
}
