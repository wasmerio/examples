import { siteConfig } from "@/config/site";

export function GET() {
  return new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${new URL("/sitemap-index.xml", siteConfig.siteUrl)}\n`,
    {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    },
  );
}
