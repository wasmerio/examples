import type { APIContext } from "astro";
import { SITE } from "../../config";
import { getPosts, formatDate } from "../../utils/posts";
import { renderOg } from "../../utils/og";

export async function getStaticPaths() {
  if (!SITE.features.ogImages) return [];
  const posts = await getPosts();
  const pages = posts.map((p) => ({
    params: { slug: p.id },
    props: { title: p.data.title, subtitle: p.data.description, footer: formatDate(p.data.pubDate, SITE.lang) },
  }));
  pages.push({ params: { slug: "default" }, props: { title: SITE.title, subtitle: SITE.description, footer: "" } });
  return pages;
}

export async function GET({ props }: APIContext) {
  const png = await renderOg(props as { title: string; subtitle?: string; footer?: string });
  return new Response(png, { headers: { "Content-Type": "image/png" } });
}
