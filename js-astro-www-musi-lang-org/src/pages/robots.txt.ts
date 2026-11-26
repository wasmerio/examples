export function GET() {
	return new Response(
		"User-agent: *\nAllow: /\n\nSitemap: https://musi-lang.org/sitemap.xml\n",
		{ headers: { "content-type": "text/plain; charset=utf-8" } },
	);
}
