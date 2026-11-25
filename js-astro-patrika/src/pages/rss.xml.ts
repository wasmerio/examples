import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getAllEntries, getPostUrl, getNoteUrl } from "@/utils/content";
import { getConfig } from "@/utils/config";

export async function GET(context: APIContext) {
  const siteConfig = await getConfig();
  const entries = await getAllEntries();

  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: context.site!,
    items: entries.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.published,
      link:
        entry.collection === "posts"
          ? getPostUrl(entry.id, entry.filePath)
          : getNoteUrl(entry.id, entry.filePath),
      categories: [entry.collection === "posts" ? "Essay" : "Note"],
    })),
  });
}
