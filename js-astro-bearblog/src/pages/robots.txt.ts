import type { APIRoute } from "astro";
import { SITE_URL } from "../consts";

const robotsTxt = `
User-agent: *
Allow: /

Sitemap: ${new URL("sitemap-index.xml", SITE_URL).href}
`.trim();

export const GET = (() =>
  new Response(robotsTxt, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })) satisfies APIRoute;
