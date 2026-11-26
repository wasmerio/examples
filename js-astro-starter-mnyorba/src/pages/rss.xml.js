import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { metadata, config } from "../consts";

export async function GET(context) {
  // Get all posts from the "blog" collection
  const posts = (
    await getCollection("blog", ({ data }) => {
      return data.draft !== true;
    })
  ).sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());

  // Return the RSS feed
  return rss({
    // `<title>` field in output xml
    title: metadata.title,
    // `<description>` field in output xml
    description: metadata.description,
    // Pull in your project "site" from the endpoint context
    // https://docs.astro.build/en/reference/api-reference/#site
    site: new URL(config.base, context.site),
    // Array of `<item>`s in output xml
    // See "Generating items" section for examples using content collections and glob imports
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.publishDate,
      description: post.data.description,
      link: `${config.base}/blog/${post.id}/`,
    })),
    // (optional) inject custom xml
    customData: `<language>en-us</language>`,
  });
}
