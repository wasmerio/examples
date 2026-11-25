import { getCollection } from "astro:content";

export const getBlogPosts = async (showHidden = false) => {
  const posts = (await getCollection("blog"))
    .filter((post: any) => post.data.published !== false && (showHidden || !post.data.hidden))
    .sort(
      (a: any, b: any) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
    );

  return posts;
};
