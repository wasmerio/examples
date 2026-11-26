import type { APIRoute, GetStaticPaths } from "astro";
import { site } from "$lib/site";
import { blogPosts } from "$lib/content/blog";
import type { BlogPost } from "$lib/types/portfolio";
import { formatDate } from "$lib/utils/date";

export const getStaticPaths = (() =>
  blogPosts.map((post) => ({ params: { slug: post.slug }, props: { post } }))) satisfies GetStaticPaths;

export const GET: APIRoute<{ post: BlogPost }> = async ({ props: { post } }) => {
  const { renderOgPng } = await import("$lib/og/render");
  const png = await renderOgPng({
    title: post.title,
    eyebrow: post.tags.slice(0, 3).join(" · ") || "Blog",
    footer: `${site.name} · ${formatDate(post.published)}`,
    cover: post.cover,
  });

  return new Response(new Uint8Array(png), {
    headers: {
      "content-type": "image/png",
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
};
