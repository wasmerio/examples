/**
 * The site's own JSON-LD (theme-core's builders): the owner is the person the site is about, a Person at
 * `<origin>/#owner` (name, role, photo, bio and profile links), and the WebSite is the site's title and tagline.
 * Every indexable page carries both (src/layouts/Base.astro); pages add their own nodes.
 *
 * Plain Node loads this file (the unit tests).
 */
import { type JsonLdNode, type OwnerInput, sameAs, siteGraph } from "@astronomic/theme-core/jsonld";
import type { Settings } from "../content/model";
import { isBareProfileLink } from "./setup";

type OwnerSettings = Pick<Settings, "name" | "role" | "avatar" | "bio" | "socials">;

/** The owner as a Person. sameAs keeps the full profile URLs only: the feed and mail links are left out, and so is a profile site's home page (the demo's links), which is no one's profile. */
export function ownerInput(settings: OwnerSettings): OwnerInput {
	return {
		type: "Person",
		name: settings.name,
		jobTitle: settings.role,
		image: settings.avatar?.src,
		description: settings.bio,
		sameAs: sameAs(settings.socials.filter((s) => !isBareProfileLink(s.href))),
	};
}

/** The WebSite and the owner's Person, with absolute URLs on `origin`. */
export const siteNodes = (settings: OwnerSettings & Pick<Settings, "title" | "tagline">, origin: string | URL): JsonLdNode[] =>
	siteGraph(origin, { name: settings.title, description: settings.tagline, owner: ownerInput(settings) });
