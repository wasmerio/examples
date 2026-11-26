import type { APIRoute } from "astro";
import { type CollectionEntry } from "astro:content";
import { usePostOgImage } from "@/utils/useOgImages";
import { allPosts } from "@/utils/usePosts";

export async function getStaticPaths() {
  const posts = allPosts.filter(({ data }) => !data.ogImage);

  return posts.map(post => ({
    params: { slug: post.slug },
    props: post,
  }));
}

export const GET: APIRoute = async ({ props }) =>
  new Response(await usePostOgImage(props as CollectionEntry<"blog">), {
    headers: { "Content-Type": "image/png" },
  });
