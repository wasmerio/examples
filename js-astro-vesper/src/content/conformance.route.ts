/** Injected only by the content tests (CONTENT_CONFORMANCE=1). Not part of normal builds. */
import type { APIRoute } from "astro";
import source from "astronomic:content/source";
import { checkAdapter } from "@astronomic/content";
import { checks, vesperProblems } from "./conformance";

export const GET: APIRoute = async () =>
	Response.json({ adapter: source.name, problems: [...(await checkAdapter(source, checks)), ...(await vesperProblems(source))] });
