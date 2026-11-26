import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { siteConfig } from "@/config";
import { getSortedPosts } from "@/utils/posts";
import { withBase } from "@/utils/url";

export async function GET(context: APIContext) {
  const posts = await getSortedPosts();
  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: new URL(withBase("/"), context.site),
    items: posts.map((p) => ({
      title: p.data.title,
      pubDate: p.data.published,
      description: p.data.description,
      link: withBase(`/posts/${p.id}/`),
    })),
  });
}
