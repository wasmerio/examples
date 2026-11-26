import rss from "@astrojs/rss";
import { allPosts } from "@/utils/usePosts";
import { SITE } from "@/config";

export async function GET() {
  return rss({
    title: SITE.title,
    description: SITE.desc,
    site: SITE.website,
    items: allPosts.map(({ data, slug }) => ({
      link: `posts/${slug}/`,
      title: data.title,
      description: data.description,
      pubDate: new Date(data.modDatetime ?? data.pubDatetime),
    })),
  });
}
