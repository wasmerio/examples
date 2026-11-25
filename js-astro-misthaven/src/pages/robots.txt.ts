import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    throw new Error("The site URL must be configured to generate robots.txt");
  }

  const sitemapUrl = new URL("sitemap-index.xml", site);
  const body = `User-agent: *
Allow: /

Sitemap: ${sitemapUrl.href}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
