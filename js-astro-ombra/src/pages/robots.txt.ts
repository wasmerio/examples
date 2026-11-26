export function GET({ site }: { site?: URL }) {
  const base = site ?? new URL("http://localhost:4321");
  const sitemap = new URL("/sitemap-index.xml", base);

  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap.href}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
