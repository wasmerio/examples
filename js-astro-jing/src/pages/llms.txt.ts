import type { APIRoute } from "astro";
import { SITE } from "@/config";
import getBlogPosts, { type BlogPost } from "@/utils/getPosts";
import { getCanonicalURL, getMarkdownURL } from "@/utils/getURL";

const getPostsWithUrls = (site: URL, post: BlogPost): string => {
  const url = new URL(post.id, site);
  const canonicalURL = getCanonicalURL(url, site);
  const markdownURL = getMarkdownURL(canonicalURL);
  return `- [${post.data.title}](${markdownURL})${post.data.description ? `: ${post.data.description}` : ""}`;
};

export const GET: APIRoute = async ({ site }) => {
  if (!SITE.llmsTxt) {
    return new Response(null, { status: 404 });
  }

  if (!site) {
    throw new Error("Site URL is not defined.");
  }

  const posts = await getBlogPosts();
  const allPostsWithUrls = posts.map((post) => getPostsWithUrls(site, post));

  const featuredPosts = posts.filter((post) => post.data.featured);
  const featuredPostsWithUrls = featuredPosts.map((post) => getPostsWithUrls(site, post));

  const content = `# ${SITE.title}

> ${SITE.description}
> Authored by ${SITE.author}

${featuredPostsWithUrls.length > 0 ? `## Featured Posts\n\n${featuredPostsWithUrls.join("\n")}` : ""}

## All Posts

${allPostsWithUrls.join("\n")}
`;
  return new Response(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
};
