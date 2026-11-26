import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { siteConfig } from "@/site.config";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const posts = await getCollection("blog");
  const sortedPosts = posts.sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime()
  );

  return rss({
    title: `${siteConfig.author.name}'s Blog`,
    description: `Articles about software development, AI/ML, open source, and technology by ${siteConfig.author.name}`,
    site: context.site || siteConfig.url,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      author: post.data.author,
      link: `/blog/${post.id}/`,
      categories: post.data.tags,
    })),
    customData: `
      <language>en-us</language>
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
      <managingEditor>${siteConfig.author.email} (${siteConfig.author.name})</managingEditor>
      <webMaster>${siteConfig.author.email} (${siteConfig.author.name})</webMaster>
      <image>
        <url>${siteConfig.author.avatar}</url>
        <title>${siteConfig.author.name}'s Blog</title>
        <link>${siteConfig.url}</link>
      </image>
    `,
  });
}
