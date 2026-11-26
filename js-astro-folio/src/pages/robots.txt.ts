import type { APIRoute } from "astro";

// Generated at build time so the sitemap URL tracks `site` in astro.config.mjs.
// A fresh fork that changes `site` gets a correct robots.txt with no edits here.
export const GET: APIRoute = ({ site }) => {
  const sitemap = site ? new URL("sitemap-index.xml", site).href : "/sitemap-index.xml";
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
