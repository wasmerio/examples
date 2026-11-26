/**
 * robots.txt: allow all, and point at the sitemap. Edit this file to change
 * it (on EmDash builds the admin's robots.txt setting no longer applies).
 * Set AI_TRAINING to false to ask training crawlers (GPTBot, Google-Extended, CCBot, Applebot-Extended and others) not to use the site; search crawlers stay allowed.
 */
import { robotsTxt, xmlResponse } from "@astronomic/theme-core/feeds";
import type { APIRoute } from "astro";
import { siteOrigin } from "../utils/public-pages";

export const AI_TRAINING = true;

export const GET: APIRoute = (context) => {
	// A server build has EmDash's admin and API under /_emdash/.
	const disallow = import.meta.env.CONTENT_OUTPUT === "server" ? ["/_emdash/"] : [];
	return xmlResponse(robotsTxt({ site: siteOrigin(context), sitemap: "/sitemap.xml", disallow, aiTraining: AI_TRAINING }), "text");
};
