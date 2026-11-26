export interface TagInfo {
  name: string;
  slug: string;
  count: number;
}

export function slugifyTag(tag: string): string {
  return String(tag || '')
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w-]+/g, '');
}

export function formatTagLabel(tag: string): string {
  if (!tag) return '';
  return String(tag).trim();
}

export function getAllTags(posts: Array<{ tags?: string[] }>): TagInfo[] {
  const tagMap = new Map<string, { name: string; count: number }>();

  for (const post of posts || []) {
    if (!Array.isArray(post.tags)) continue;
    for (const rawTag of post.tags) {
      if (!rawTag) continue;
      const slug = slugifyTag(rawTag);
      if (!slug) continue;

      const existing = tagMap.get(slug);
      if (existing) {
        existing.count += 1;
      } else {
        tagMap.set(slug, {
          name: rawTag.trim(),
          count: 1,
        });
      }
    }
  }

  const result: TagInfo[] = [];
  for (const [slug, data] of tagMap.entries()) {
    result.push({
      slug,
      name: data.name,
      count: data.count,
    });
  }

  return result.sort((a, b) => {
    if (b.count !== a.count) {
      return b.count - a.count;
    }
    return a.name.localeCompare(b.name);
  });
}
