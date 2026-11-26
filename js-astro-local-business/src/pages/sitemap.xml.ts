import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { absoluteUrl } from "../config";

/**
 * Native Astro endpoint instead of @astrojs/sitemap, so the starter has no
 * extra dependency and the URL list stays explicit and reviewable.
 *
 * When you add pages, add them here. A sitemap that lists pages you deleted is
 * worse than no sitemap.
 */
export const GET: APIRoute = async () => {
  const [services, locations] = await Promise.all([
    getCollection("services"),
    getCollection("locations"),
  ]);

  const paths = [
    "/",
    "/contact/",
    ...services.map((entry) => `/services/${entry.id}/`),
    ...locations.map((entry) => `/locations/${entry.id}/`),
  ];

  const urls = paths
    .map((path) => `  <url><loc>${absoluteUrl(path)}</loc><changefreq>monthly</changefreq></url>`)
    .join("\n");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    "</urlset>",
    "",
  ].join("\n");

  return new Response(xml, {
    headers: { "content-type": "application/xml; charset=utf-8" },
  });
};
