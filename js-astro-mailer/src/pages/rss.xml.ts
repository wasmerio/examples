import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";
import { siteConfig } from "@/config/site";
import { feedCustomData, feedItems } from "@/lib/feeds";
import { publishedIssues } from "@/lib/issues";

export async function GET(context: APIContext) {
  const issues = publishedIssues(await getCollection("issues")).slice(0, siteConfig.rss.limit);

  return rss({
    title: siteConfig.name,
    description: siteConfig.description,
    site: context.site ?? siteConfig.siteUrl,
    items: await feedItems(issues),
    customData: feedCustomData,
    trailingSlash: true,
  });
}
