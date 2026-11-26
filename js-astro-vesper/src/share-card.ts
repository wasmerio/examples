/**
 * Vesper's share card: the label, the plain title and the site name on the Clear look's light ground in its ink, the
 * cut-corner mark in the resolved accent (getConfig), in Host Grotesk. Used by src/pages/og/[...path]/card.png.ts;
 * build time or server only. The plain parts are src/utils/share-look.ts.
 */
import { fontFromDataUrl, type ShareFont } from "@astronomic/theme-core/share";
import type { Settings } from "~/content";
import accents from "./styles/accents/accents.json";
import { getConfig } from "./utils/config";
import type { PublicPage } from "./utils/public-pages";
import { CARD_FONT, CARD_WEIGHT, cardColors, cardInput as input, cardTree } from "./utils/share-look";
// satori reads WOFF, TTF and OTF, not WOFF2. Host Grotesk 600 from @fontsource/host-grotesk 5.3.0
// (files/host-grotesk-latin-600-normal.woff; OFL, see OFL.txt). One weight: every text on the card asks for it.
import hostGrotesk from "./assets/fonts/HostGrotesk-latin-600.woff?inline";

export const fonts: ShareFont[] = [{ name: CARD_FONT, data: fontFromDataUrl(hostGrotesk), weight: CARD_WEIGHT, style: "normal" }];

/** The card's public input for one page: the site's name, and the accent from the config for these settings. */
export function cardInput(page: PublicPage, settings: Pick<Settings, "title" | "config">) {
	return input(page, settings.title, cardColors(getConfig(settings).config.accent, accents));
}

/** The card tree for one public page. */
export function card(page: PublicPage, settings: Pick<Settings, "title" | "config">) {
	const { card, look } = cardInput(page, settings);
	return cardTree(card, look);
}
