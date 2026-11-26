/** The sitemap: every public page (src/utils/public-pages.ts). The theme owns it, so EmDash's own does not apply. */
import { sitemapXml, xmlResponse } from "@astronomic/theme-core/feeds";
import type { APIRoute } from "astro";
import { publicPages, siteOrigin } from "../utils/public-pages";

export const GET: APIRoute = async (context) => {
	const pages = await publicPages();
	return xmlResponse(sitemapXml({ site: siteOrigin(context), pages }), "xml");
};
