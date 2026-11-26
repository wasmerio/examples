import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE_TITLE, SITE_DESCRIPTION } from "../app/static/consts";

export async function GET(context) {
  const [posts, logs] = await Promise.all([
    getCollection("blog"),
    getCollection("log"),
  ]);

  const allItems = [...posts, ...logs].map((item) => ({
    title: item.data.title,
    pubDate: item.data.pubDate,
    description: item.data.description,
    link: `/${item.collection}/${item.slug}/`,
    content: item.body,
    categories: item.data.tags || [],
    author: item.data.author || "jt_fox",
  }));

  allItems.sort((a, b) => b.pubDate - a.pubDate);

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: allItems,
    customData: `<language>en</language>`,
  });
}
