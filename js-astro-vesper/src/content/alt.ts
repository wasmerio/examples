/**
 * Alt text in the Markdown collections (src/content.config.ts). A content photo that is set needs alt text with
 * words in it: the article's hero (a post's `thumbnail`), a project's and a page's `image`, a uses group's
 * `groupImage`, and every collage photo. Whitespace alone counts as none. The lists show those photos beside a linked
 * title, so they are decorative there (alt=""), but their own pages need the words.
 *
 * Left optional on purpose: a logo (`logoAlt`; logos are decorative everywhere) and the avatar (`avatarAlt`; with none
 * it is the person's name).
 *
 * Plain Node loads this file (the unit tests).
 */
import { z } from "astro/zod";

/** Alt text, trimmed. */
export const altText = z.string().trim();

/** Alt text that must have words in it (the collage). */
export const requiredAlt = altText.min(1, "Alt text is required: describe the photo.");

/**
 * A refinement for a collection's schema: each `[image, alt]` pair whose image is set needs alt text with words in
 * it, reported at the alt field.
 */
export function altForImages(pairs: readonly (readonly [image: string, alt: string])[]) {
	return (data: Record<string, unknown>, ctx: z.RefinementCtx) => {
		for (const [image, alt] of pairs) {
			const value = data[alt];
			if (data[image] && !(typeof value === "string" && value.trim() !== ""))
				ctx.addIssue({ code: "custom", path: [alt], message: `${alt} is required when ${image} is set: describe the photo.` });
		}
	};
}
