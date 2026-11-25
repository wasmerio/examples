import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site, url }) => {
    const robots = `
User-agent: *
Allow: /

Sitemap: ${new URL(import.meta.env.BASE_URL + "sitemap-index.xml", site || url).href}
  `.trim();

    return new Response(robots, {
        headers: { "Content-Type": "text/plain" },
    });
};
