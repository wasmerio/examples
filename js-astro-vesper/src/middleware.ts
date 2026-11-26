/**
 * The setup check (src/utils/setup-check.ts) runs here, before a page renders, so a broken setup stops a static build
 * and answers an error in `astro dev` (in the layout it would run after the page had started streaming with a 200).
 * Once per static build, on every page request in dev, never on a production server. EmDash's admin and API and
 * Astro's own routes (SKIP) are left alone, so the admin still opens to fix the settings.
 */
import { defineMiddleware } from "astro:middleware";
import { useContent } from "./content";
import { siteOrigin } from "./utils/public-pages";
import { siteSettings } from "./utils/setup";
import { runSetupCheck, setupCheckNeeded } from "./utils/setup-check";

/** Routes that are not the site's pages: EmDash's admin and API, Astro's assets, images, actions and server islands. */
const SKIP = ["/_emdash", "/_astro", "/_image", "/_actions", "/_server-islands"];
const skipped = (path: string) => SKIP.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));

export const onRequest = defineMiddleware(async (context, next) => {
	if (setupCheckNeeded() && !skipped(context.url.pathname)) {
		// No request context: the check reads only settings, pages and lists, the same for every reader (as the sitemap does).
		const content = useContent();
		await runSetupCheck(content, await siteSettings(content), siteOrigin(context));
	}
	return next();
});
