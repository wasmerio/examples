import type { APIRoute } from "astro";
// Keep the original URL valid while the official integration generates the pages.
export const GET: APIRoute = ({ site }) => {
  const index = new URL("/sitemap-0.xml", site).href.replaceAll("&", "&amp;");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${index}</loc></sitemap></sitemapindex>`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );
};
