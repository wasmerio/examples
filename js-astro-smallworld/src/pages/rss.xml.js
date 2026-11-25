import { siteConfig } from "~/settings";
import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const posts = await getCollection("blog");
  return rss({
    // Use custom XSL stylesheet for browsers
    stylesheet: "/rss/style.xsl",
    // General site info
    title: siteConfig.title,
    description: siteConfig.description,
    site: context.site,
    // Blog entries
    items: posts.map((post) => ({
      ...post.data,
      link: `/blog/${post.id}/`,
    })),
  });
}
