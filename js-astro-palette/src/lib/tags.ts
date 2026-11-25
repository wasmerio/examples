import type { CollectionEntry } from 'astro:content';

// Replace with your own skills, tools, or interests. Each one seeds a page
// in the /tags/ archive, so marquee items link somewhere even before any
// post uses them as a tag.
export const skills = [
  'HTML', 'CSS', 'JavaScript', 'TypeScript',
  'Python', 'Go', 'Rust', 'Bash',
  'Git', 'GitHub Actions', 'Docker', 'Kubernetes',
  'AWS', 'Azure', 'GCP',
  'PostgreSQL', 'Redis', 'GraphQL', 'REST APIs',
  'Linux', 'Terraform', 'Ansible', 'CI/CD',
];

// URL slug for a tag. Letters and digits in any script are kept (lowercased),
// every other run of characters collapses to a hyphen: "GitHub Actions" ->
// "github-actions", "C++" -> "c", "日本語" -> "日本語". A tag with no letters
// or digits at all (e.g. "***") slugifies to "" — getAllTags and the tag-chip
// renderers skip those, since an empty route param would fail the build.
export function slugifyTag(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

export interface TagInfo {
  slug: string;
  name: string;
  count: number;
}

// The site's tag universe: the skills list plus every tag on a published
// (non-draft) post, one entry per slug. Draft posts are excluded so an
// unpublished tag never gets a public archive page. When different spellings
// share a slug, the display name comes from the skills list first, otherwise
// from the first published post that uses it. `count` is the number of
// published posts carrying the tag.
export function getAllTags(posts: CollectionEntry<'blog'>[]): TagInfo[] {
  const bySlug = new Map<string, TagInfo>();

  for (const skill of skills) {
    const slug = slugifyTag(skill);
    if (slug) bySlug.set(slug, { slug, name: skill, count: 0 });
  }

  for (const post of posts) {
    if (post.data.draft) continue;
    const seen = new Set<string>();
    for (const tag of post.data.tags) {
      const slug = slugifyTag(tag);
      if (!slug || seen.has(slug)) continue;
      seen.add(slug);
      const existing = bySlug.get(slug);
      if (existing) existing.count += 1;
      else bySlug.set(slug, { slug, name: tag, count: 1 });
    }
  }

  return [...bySlug.values()].sort((a, b) => a.name.localeCompare(b.name));
}
