import type { APIRoute } from "astro";
import { getSearchIndexItems } from "@utils/search-utils";

export const prerender = true;

export const GET: APIRoute = async () => {
	const items = await getSearchIndexItems({
		includeDraft: !import.meta.env.PROD,
	});

	return new Response(JSON.stringify(items), {
		status: 200,
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			"Cache-Control": "public, max-age=300",
		},
	});
};
