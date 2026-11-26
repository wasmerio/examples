import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import SITE from "@/config";
import { getPosts } from "@/utils/posts";
import { url } from "@/utils/url";

export const GET: APIRoute = async (context) => {
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site!,
    items: (await getPosts()).map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: url(`/blog/${post.id}/`),
    })),
  });
};
