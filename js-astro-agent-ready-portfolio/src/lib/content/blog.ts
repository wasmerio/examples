import type { BlogPost } from "$lib/types/portfolio";
import { parseFrontmatter, parseTags } from "$lib/content/frontmatter";

// Posts live in content/posts/<slug>.md with simple frontmatter:
//
//   ---
//   title: Post title
//   description: One-sentence summary used for cards, SEO, and RSS.
//   published: 2026-11-06   (or 2026-11-06T14:30 to order posts published the same day)
//   updated: 2026-11-08      (optional)
//   tags: [langgraph, agents]
//   projects: [Plico]        (optional, names from githubProjects shown as cards)
//   cover: /images/blog/x.svg (optional, thumbnail under content/public/ for the blog list card)
//   aliases: [old-slug]      (optional, former slugs; they redirect to this post)
//   draft: true              (optional, hides the post everywhere)
//   ---
const files = import.meta.glob("/content/posts/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export type BlogEntry = BlogPost & { body: string };

// Full value as written, used only to order posts. `published` itself stays date-only.
const sortKeys = new Map<string, string>();

const WORDS_PER_MINUTE = 220;

const entries: BlogEntry[] = Object.entries(files).flatMap(([path, raw]) => {
  const { data, body } = parseFrontmatter(raw);
  const slug = path.split("/").pop()!.replace(/\.md$/, "");

  if (data.draft === "true") return [];
  if (!data.title || !data.description || !data.published) {
    throw new Error(
      `Blog post "${slug}" needs title, description, and published in its frontmatter.`,
    );
  }

  sortKeys.set(slug, data.published);

  return [
    {
      title: data.title,
      description: data.description,
      slug,
      published: data.published.slice(0, 10),
      updated: data.updated,
      tags: parseTags(data.tags),
      projects: parseTags(data.projects),
      cover: data.cover || undefined,
      aliases: parseTags(data.aliases),
      readingMinutes: Math.max(
        1,
        Math.round(body.split(/\s+/).filter(Boolean).length / WORDS_PER_MINUTE),
      ),
      body,
    },
  ];
});

// Newest first; same-day posts go by timestamp, then title.
export const blogEntries = entries.sort(
  (a, b) =>
    sortKeys.get(b.slug)!.localeCompare(sortKeys.get(a.slug)!) ||
    a.title.localeCompare(b.title),
);

export const blogPosts: BlogPost[] = blogEntries.map(
  ({ body: _body, ...post }) => post,
);

// A redirect must never shadow a real post or point two posts at the same old URL.
const claimed = new Map(blogEntries.map((entry) => [entry.slug, entry.slug]));
for (const entry of blogEntries) {
  for (const alias of entry.aliases) {
    const owner = claimed.get(alias);
    if (owner) {
      throw new Error(
        `Blog post "${entry.slug}" lists the alias "${alias}", which is already used by "${owner}".`,
      );
    }
    claimed.set(alias, entry.slug);
  }
}
