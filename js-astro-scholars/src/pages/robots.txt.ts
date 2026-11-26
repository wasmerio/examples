import type { APIRoute } from "astro";
import siteConfig from "../side.config";
import { withTrailingSlash } from "../lib/site-url";

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
	const siteUrl = site ?? new URL(withTrailingSlash(siteConfig.siteUrl));
	const sitemapUrl = new URL("sitemap-index.xml", siteUrl);
	const body = [
		"User-agent: *",
		"Allow: /",
		"",
		`Sitemap: ${sitemapUrl.href}`,
		"",
	].join("\n");

	return new Response(body, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
		},
	});
};
