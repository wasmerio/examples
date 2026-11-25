import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { siteConfig } from "@/config/site";
import { getAuthor, getCategory, getPosts, postUrl } from "@/lib/posts";

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: siteConfig.name,
    description: siteConfig.description,
    site: context.site ?? siteConfig.siteUrl,
    xmlns: { dc: "http://purl.org/dc/elements/1.1/" },
    customData: `<language>${siteConfig.language}</language>`,
    items: posts.map((post) => ({
      title: post.title,
      description: post.excerpt,
      link: postUrl(post),
      pubDate: post.date,
      customData: `<dc:creator><![CDATA[${getAuthor(post.author)?.name ?? siteConfig.name}]]></dc:creator>`,
      categories: [getCategory(post.category)?.name ?? post.category],
    })),
  });
}
