import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import type { SearchIndexItem } from "../utils/search";
import { withBase } from "../utils/withBase";

export const GET: APIRoute = async () => {
  const posts = (await getCollection("blog")).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  const index: SearchIndexItem[] = posts.map((post) => ({
    id: post.id,
    title: post.data.title,
    description: post.data.description,
    tags: post.data.tags ?? [],
    pubDate: post.data.pubDate.toISOString(),
    url: withBase(`/blog/${post.id}/`),
  }));

  return new Response(JSON.stringify(index), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
};
