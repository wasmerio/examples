import { siteOrigin } from "./content";
import { siteMeta } from "./lib/site-meta";
import type { AppRoute } from "./routes";

const scriptCloseTagPattern = /<\/script/gi;

export function canonicalUrl(route: AppRoute) {
	return new URL(
		route.canonicalPath ?? route.path,
		`${siteOrigin}/`,
	).toString();
}

function escapeJson(payload: string) {
	return payload
		.replaceAll("<", "\\u003c")
		.replace(scriptCloseTagPattern, "<\\/script");
}

export function buildStructuredData(route: AppRoute) {
	return escapeJson(
		JSON.stringify({
			"@context": "https://schema.org",
			"@type": "SoftwareApplication",
			name: siteMeta.name,
			applicationCategory: "DeveloperApplication",
			operatingSystem: "macOS, Linux, Windows",
			url: canonicalUrl(route),
			description: route.description,
		}),
	);
}

export function buildHeadMarkup(route: AppRoute) {
	const url = canonicalUrl(route);
	return [
		`<title>${route.title}</title>`,
		`<meta name="description" content="${route.description}" />`,
		`<link rel="canonical" href="${url}" />`,
		'<meta name="robots" content="index,follow" />',
		'<meta property="og:type" content="website" />',
		`<meta property="og:title" content="${route.title}" />`,
		`<meta property="og:description" content="${route.description}" />`,
		`<meta property="og:url" content="${url}" />`,
		'<meta name="twitter:card" content="summary" />',
		`<meta name="twitter:title" content="${route.title}" />`,
		`<meta name="twitter:description" content="${route.description}" />`,
		`<script id="seo-structured-data" type="application/ld+json">${buildStructuredData(route)}</script>`,
	].join("\n\t\t");
}
