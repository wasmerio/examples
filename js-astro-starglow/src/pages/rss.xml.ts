import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getAllItems } from "@/utils/content/items";
import config from "@/config";

export async function GET(context: APIContext) {
  if (!context.site) {
    throw new Error("[rss] site is not configured (SITE_URL)");
  }

  const items = await getAllItems();

  return rss({
    title: config.site.title,
    description: config.site.description,
    site: new URL(import.meta.env.BASE_URL, context.site),
    items: items.map(item => ({
      title: item.title,
      link: item.url,
      description: item.description,
      categories: [item.type, ...item.tags],
      ...(item.date && { pubDate: item.date }),
    })),
  });
}
