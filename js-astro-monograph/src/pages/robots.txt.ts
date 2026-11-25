import { siteConfig } from "@/config/site";

export function GET() {
  return new Response(
    `User-agent: *
Allow: /

Sitemap: ${siteConfig.siteUrl}/sitemap.xml
`,
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    },
  );
}
