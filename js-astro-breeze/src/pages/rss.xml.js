import site from "@/config/site";
import { getPosts } from "@/utils/post";
import rss from "@astrojs/rss";

export async function GET(context) {
  const posts = await getPosts();
  return rss({
    title: site.meta.title,
    description: site.meta.description,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.createdAt,
      description: post.data.summary,
      link: `/posts/${post.id}`,
    })),
  });
}
