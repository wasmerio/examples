/**
 * A share card for every public page: /og/card.png for the home page, /og/<path>/card.png for the rest. Static builds
 * write one PNG per page in publicPages(); server builds render it on request, once per process for each card
 * (cachedCard). A request looks up only the page its path names (pageAt), never the whole list.
 */
import { cachedCard, cardResponse, renderCard } from "@astronomic/theme-core/share";
import type { APIRoute, GetStaticPaths } from "astro";
import { useContent } from "~/content";
import { cardInput, fonts } from "../../../share-card";
import { pageAt, publicPages } from "../../../utils/public-pages";
import { siteSettings } from "../../../utils/setup";
import { cardTree } from "../../../utils/share-look";

export const getStaticPaths = (async () => {
	const pages = await publicPages();
	// The home page's param is undefined; any other page's is its path without the leading "/".
	return pages.filter((page) => page.card).map((page) => ({ params: { path: page.path === "/" ? undefined : page.path.slice(1) } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params }) => {
	// The decoded param (the same on static and server builds, also for a non-ASCII slug).
	const path = params.path ? `/${params.path}` : "/";
	const [page, settings] = await Promise.all([pageAt(path), siteSettings(useContent())]);
	if (!page?.card) return new Response(null, { status: 404 });
	// Rendered once per process for the same public input (a server build otherwise renders on every request).
	const { card, look } = cardInput(page, settings);
	return cardResponse(await cachedCard(card, look, () => renderCard(cardTree(card, look), { fonts })));
};
