import type { CollectionEntry } from "astro:content";
import { slugifyStr } from "@/utils/slugify";

interface Category {
  id: string;
  name: string;
  count: number;
}

const getUniqueCategories = (posts: CollectionEntry<"blog">[]): Category[] => {
  const categoryMap = new Map<string, Category>();

  posts
    .flatMap((post) => post.data.categories)
    .forEach((category) => {
      const id = slugifyStr(category);
      const existingCategory = categoryMap.get(id);
      if (existingCategory) {
        existingCategory.count += 1;
      } else {
        categoryMap.set(id, {
          id,
          name: category,
          count: 1,
        });
      }
    });

  // Sort by name
  const categories = Array.from(categoryMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  return categories;
};

export default getUniqueCategories;
