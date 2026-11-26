import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import siteConfig from "@config";
import { getBlogPosts, getPostHref } from "../utils/content";

export async function GET(context: APIContext) {
  const posts = await getBlogPosts();

  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: getPostHref(post.id),
    })),
    customData: `<language>${siteConfig.lang}</language>`,
  });
}
