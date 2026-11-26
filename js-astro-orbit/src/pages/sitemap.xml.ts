import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET: APIRoute = async ({ site }) => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const projects = await getCollection("projects", ({ data }) => !data.draft);
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  const routes = [
    "/",
    "/about/",
    "/work/",
    "/blog/",
    "/search/",
    "/contact/",
    ...projects.map((project) => `/work/${project.id}/`),
    ...posts.map((post) => `/blog/${post.id}/`),
  ];
  const locations = routes.map((route) => new URL(`${base}${route}`, site));
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${locations.map((location) => `  <url><loc>${location}</loc></url>`).join("\n")}
</urlset>`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};