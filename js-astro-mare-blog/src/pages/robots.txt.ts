import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = site ? new URL("sitemap-index.xml", site).href : null;

  const content = [
    "User-agent: *",
    "Allow: /",
    ...(sitemapURL ? ["", `Sitemap: ${sitemapURL}`] : []),
  ].join("\n");

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  });
};
