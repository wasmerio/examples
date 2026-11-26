import { url } from "@/lib/url"
import rss from "@astrojs/rss"
import type { APIContext } from "astro"
import { siteConfig } from "@/config/site"
import { getPosts, summaryOf } from "@/lib/posts"

export async function GET(context: APIContext) {
  const posts = await getPosts()
  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: context.site ?? "https://example.com",
    items: posts.map((post) => ({
      title: post.data.title,
      description: summaryOf(post),
      pubDate: post.data.date,
      link: url(`/posts/${post.id}/`),
    })),
    customData: `<language>${siteConfig.lang}</language>`,
  })
}
