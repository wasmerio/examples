import type { APIRoute } from "astro";

export const GET: APIRoute = () => {
  const site = import.meta.env.SITE_URL;
  const body = `User-agent: *
Allow: /

Sitemap: ${site}/sitemap-index.xml
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
