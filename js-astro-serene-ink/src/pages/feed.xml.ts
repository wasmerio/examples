import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";
import { siteConfig } from "../config";
import { parseDate } from "../utils/date";

export async function GET(context: APIContext) {
    const entries = await getCollection("post");
    const posts = entries.filter((e) => !e.data.draft);

    return rss({
        stylesheet: "/rss-styles.xsl",
        title: siteConfig.rss.title,
        description: siteConfig.rss.description,
        site: context.url.origin,
        items: posts.map((entry) => ({
            title: entry.data.title,
            pubDate: parseDate(entry.data.date),
            description: entry.data.frontmatter,
            link: `/posts/${entry.id}`,
        })),
        customData: `<language>en-us</language>`,
    });
}