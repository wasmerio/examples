import type { APIRoute } from "astro";
import { absoluteUrl } from "../config";

export const GET: APIRoute = () => {
  const body = [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${absoluteUrl("/sitemap.xml")}`,
    "",
    "# AI crawlers are allowed on purpose: this site wants to be cited.",
    "# Add `Disallow: /` blocks per bot only if the owner explicitly opts out —",
    "# blocking AI crawlers also removes you from AI answers.",
  ].join("\n");

  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
};
