import { appRoutes } from "../routes";

export function GET() {
	const today = new Date().toISOString().slice(0, 10);
	const paths = [
		...new Set(appRoutes.map((route) => route.canonicalPath ?? route.path)),
	];
	const items = paths
		.map(
			(path) =>
				`<url><loc>https://musi-lang.org${path}</loc><lastmod>${today}</lastmod></url>`,
		)
		.join("");
	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items}</urlset>\n`,
		{ headers: { "content-type": "application/xml; charset=utf-8" } },
	);
}
