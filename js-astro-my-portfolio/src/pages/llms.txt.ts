import type { APIRoute } from "astro";
import { getPublishedPosts } from "@/lib/blog";
import { buildLlmsTxt } from "@/lib/llms";

export const GET: APIRoute = async ({ site, url }) => {
  const origin = (site ?? url.origin).toString();
  const posts = await getPublishedPosts();
  const body = buildLlmsTxt(origin, posts);

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
