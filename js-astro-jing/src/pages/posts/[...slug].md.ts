import type { APIRoute } from "astro";
import { _t, SITE } from "@/config";
import getBlogPosts from "@/utils/getPosts";
import { getCanonicalURL } from "@/utils/getURL";
import { yamlEscape } from "@/utils/yaml";

export async function getStaticPaths() {
  if (!SITE.postMdUrl) {
    return [];
  }

  const posts = await getBlogPosts();
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

export const GET: APIRoute = async ({ props, site }) => {
  const { post } = props;
  const title = post.data.title;
  const desc = post.data.description;
  const body = post.body;
  const date = post.data.date.toISOString();
  const updated = post.data.updated?.toISOString() || date;
  const canonicalURL = getCanonicalURL(new URL(`/posts/${post.id}`, site), site);
  const tags = post.data.tags || [];
  const tagsStr = (tags as string[]).map((t) => `'${yamlEscape(t)}'`).join(", ");
  const categories = post.data.categories || [];
  const categoriesStr = (categories as string[]).map((c) => `'${yamlEscape(c)}'`).join(", ");

  const frontmatter = [
    `title: '${yamlEscape(title)}'`,
    `description: '${yamlEscape(desc)}'`,
    `canonical: '${yamlEscape(canonicalURL)}'`,
    `created: ${date}`,
    updated !== date ? `updated: ${updated}` : null,
    tags.length > 0 ? `tags: [${tagsStr}]` : null,
    categories.length > 0 ? `categories: [${categoriesStr}]` : null,
    `author: '${yamlEscape(SITE.author)}'`,
    `rights: '${yamlEscape(_t.rightsStatement)}'`,
  ]
    .filter(Boolean)
    .join("\n");

  const mdContent = `---
${frontmatter}
---

${body}
`;

  return new Response(mdContent, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
};
