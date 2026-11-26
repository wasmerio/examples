import { site } from "$lib/site";
import { feedPosts } from "$lib/content/feed";


// https://www.jsonfeed.org/version/1.1/
export const GET = async () => {
  const posts = await feedPosts();
  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: `${site.name}: blog`,
    home_page_url: `${site.url}/blog`,
    feed_url: `${site.url}/feed.json`,
    description: site.shortDescription,
    language: site.language,
    authors: [{ name: site.name, url: site.url }],
    items: posts.map((post) => ({
      id: post.url,
      url: post.url,
      title: post.title,
      summary: post.description,
      content_html: post.html,
      date_published: new Date(post.published).toISOString(),
      ...(post.updated && { date_modified: new Date(post.updated).toISOString() }),
      tags: post.tags,
      image: `${post.url}/og.png`,
    })),
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: { "content-type": "application/feed+json; charset=utf-8" },
  });
};
