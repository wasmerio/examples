/** The reader map (llmstxt.org format): the site's public pages with a line each. See src/utils/public-pages.ts. */
import { llmsSections, llmsTxt, xmlResponse } from "@astronomic/theme-core/feeds";
import type { APIRoute } from "astro";
import { useContent } from "~/content";
import { strings } from "~/theme.strings";
import { publicPages, siteOrigin } from "../utils/public-pages";
import { siteSettings } from "../utils/setup";

export const GET: APIRoute = async (context) => {
	const [settings, pages] = await Promise.all([siteSettings(useContent()), publicPages()]);
	// A page's title can be a headline for its card; here the main pages go by their short names.
	const listed = pages.map((p) => ({ ...p, title: p.name ?? p.title }));
	const sections = llmsSections(listed, strings.readerMap);
	return xmlResponse(llmsTxt({ site: siteOrigin(context), title: settings.title, summary: settings.tagline, sections }), "text");
};
