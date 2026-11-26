import type { APIContext } from "astro";

export const prerender = true;

export function GET({ site }: APIContext) {
  if (!site) throw new Error("Astro.site is required to generate robots.txt");
  const sitemapUrl = new URL("/sitemap.xml", site).toString();
  const body = `User-agent: *\nAllow: /\nSitemap: ${sitemapUrl}\n`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
