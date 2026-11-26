import { site } from "$lib/site";
import { renderMarkdown } from "$lib/content/markdown";
import { blogEntries } from "$lib/content/blog";

// Feed readers show content out of context, so root-relative links must be absolute.
const absolutize = (html: string) =>
  html.replace(/(href|src)="\//g, `$1="${site.url}/`);

export async function feedPosts() {
  if (!site.features.blog) return [];
  return Promise.all(
    blogEntries.map(async ({ body, ...post }) => {
      const url = `${site.url}/blog/${post.slug}`;
      const { html } = await renderMarkdown(body, { mode: "feed", url });
      return { ...post, url, html: absolutize(html) };
    }),
  );
}
