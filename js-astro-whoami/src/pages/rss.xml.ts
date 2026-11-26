import rss from "@astrojs/rss"
import { getCollection } from "astro:content"
import { siteConfig } from "../site.config"
import type { APIContext } from "astro"

export async function GET(context: APIContext) {
  const posts = (await getCollection("blog"))
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())

  return rss({
    title: siteConfig.name,
    description: siteConfig.description,
    site: context.site?.toString() ?? siteConfig.url,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.id}`,
    })),
  })
}
