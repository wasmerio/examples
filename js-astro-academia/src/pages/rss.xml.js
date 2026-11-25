import rss from "@astrojs/rss";
import { seo } from "../settings";
import { getCollection } from "astro:content";

export async function GET(context) {
    const blog = await getCollection("blog");
    return rss({
        // `<title>` field in output xml
        title: seo.default_title,
        // `<description>` field in output xml
        description: seo.default_description,
        // Pull in your project "site" from the endpoint context
        // https://docs.astro.build/en/reference/api-reference/#site
        site: context.site,
        // Array of `<item>`s in output xml
        // See "Generating items" section for examples using content collections and glob imports
        items: blog.map((post) => ({
            title: post.data.title,
            pubDate: post.data.date,
            description: post.data.excerpt,
            link: `/blog/${post.id}`,
        })),
        // (optional) inject custom xml
        customData: `<language>en-us</language>`,
    });
}
