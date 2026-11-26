import type { CollectionEntry } from "astro:content";
import { slugifyStr } from "@/utils/slugify";

interface Tag {
  id: string;
  name: string;
  count: number;
}

const getUniqueTags = (posts: CollectionEntry<"blog">[]): Tag[] => {
  const tagMap = new Map<string, Tag>();

  posts
    .flatMap((post) => post.data.tags)
    .forEach((tag) => {
      const id = slugifyStr(tag);
      const existingTag = tagMap.get(id);
      if (existingTag) {
        existingTag.count += 1;
      } else {
        tagMap.set(id, {
          id,
          name: tag,
          count: 1,
        });
      }
    });

  // Sort by name
  const tags = Array.from(tagMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  return tags;
};

export default getUniqueTags;
