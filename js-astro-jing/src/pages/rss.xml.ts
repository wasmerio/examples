import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { SITE } from "@/config";
import getBlogPosts from "@/utils/getPosts";

export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    throw new Error("Site URL is not defined.");
  }

  const posts = await getBlogPosts();

  // https://docs.astro.build/en/recipes/rss/
  return rss({
    title: SITE.title,
    description: SITE.description,
    site,
    trailingSlash: false,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: new Date(post.data.date),
      link: `/posts/${post.id}`,
    })),
  });
};
