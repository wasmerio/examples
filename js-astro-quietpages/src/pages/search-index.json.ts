import type { APIRoute } from "astro";
import {
  formatDate,
  getAuthor,
  getCategory,
  getPosts,
  getTag,
  isoDate,
  postUrl,
} from "@/lib/posts";

export interface SearchEntry {
  title: string;
  excerpt: string;
  url: string;
  category: string;
  tags: string[];
  author: string;
  /** yyyy-mm-dd */
  date: string;
  dateLabel: string;
}

/** The client-side search index, newest first. Fetched by SearchDialog on first open. */
export const GET: APIRoute = async () => {
  const posts = await getPosts();
  const index: SearchEntry[] = posts.map((post) => ({
    title: post.title,
    excerpt: post.excerpt,
    url: postUrl(post),
    category: getCategory(post.category)?.name ?? post.category,
    tags: post.tags.map((slug) => getTag(slug)?.name ?? slug),
    author: getAuthor(post.author)?.name ?? post.author,
    date: isoDate(post.date),
    dateLabel: formatDate(post.date, "short"),
  }));

  return new Response(JSON.stringify(index), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
};
