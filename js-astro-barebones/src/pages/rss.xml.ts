import type { APIContext } from "astro";
import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE } from "@/siteConfig";

export async function GET(context: APIContext) {
  const posts = await getCollection("posts");
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site!,
    items: posts
      .sort(
        (a, b) =>
          b.data.publicationDate.valueOf() - a.data.publicationDate.valueOf(),
      )
      .map((post) => ({
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.publicationDate,
        link: `/posts/${post.id}`,
      })),
  });
}
