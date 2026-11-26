import type { BlogPost } from "$lib/types/portfolio";
import { tagSlug } from "$lib/content/blog-queries";

export type PostFilter = { q: string; tag: string; project: string };

export const emptyFilter: PostFilter = { q: "", tag: "", project: "" };

export const isFiltering = (filter: PostFilter) =>
  Boolean(filter.q.trim() || filter.tag || filter.project);

// Every word of the query must appear in the title, description, tags or projects.
export function filterPosts(posts: BlogPost[], filter: PostFilter) {
  const words = filter.q.toLowerCase().split(/\s+/).filter(Boolean);
  return posts.filter((post) => {
    if (filter.tag && !post.tags.some((tag) => tagSlug(tag) === filter.tag)) return false;
    if (filter.project && !post.projects.includes(filter.project)) return false;
    const haystack = [post.title, post.description, ...post.tags, ...post.projects]
      .join(" ")
      .toLowerCase();
    return words.every((word) => haystack.includes(word));
  });
}

export function groupByYear(posts: BlogPost[]) {
  const groups: { year: string; posts: BlogPost[] }[] = [];
  for (const post of posts) {
    const year = post.published.slice(0, 4);
    const last = groups[groups.length - 1];
    if (last?.year === year) last.posts.push(post);
    else groups.push({ year, posts: [post] });
  }
  return groups;
}

export const allProjects = (posts: BlogPost[]) =>
  [...new Set(posts.flatMap((post) => post.projects))].sort();
