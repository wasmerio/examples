/**
 * The listing card's one source of texts: what ListingCard.astro renders on the server and what fillListingCard()
 * writes into a copy of the same card in the browser (a search's results), so a card a script adds matches the
 * server's. Imports only ./listing.ts, so it runs under node --test and in the browser.
 *
 * The browser fill: a page renders the card once with templateListing(fields) inside <template data-listing-template>
 * (every optional part present, so every hook is in it), and fillListingCard() clones it per listing, sets text and
 * attributes only (never HTML), and removes the parts the listing does not have.
 */
import { factCells, formatPrice, safeHref, type FactCell, type ListingField, type ListingPrice, type ListingValues } from "./listing.ts";

/** What a listing card shows: plain, serializable data, so the browser can fill the same card. */
export interface ListingCardData {
	/** The listing's id: the Save button's value and the card's data-listing-id. */
	id: string;
	/** The listing's page: a relative URL, or http: or https:. Anything else renders as "#". */
	href: string;
	title: string;
	/** "3721 Grove St, Denver". */
	address?: string;
	/** The tag on the photo, such as "For rent" or "Pending". */
	status?: string;
	price?: ListingPrice;
	/** A short note after the price, such as "$75K cut". */
	priceNote?: string;
	/** The values by field key, for the fact strip. A missing value hides its cell. */
	values: ListingValues;
	/** A plain image with ready URLs (a theme's getImage() output, or a CMS's image URLs). */
	image: { src: string; width: number; height: number; alt: string; srcset?: string };
	/** A small label on the photo's bottom corner, such as "Open Sat 11 am–1 pm". */
	badge?: string;
	/** The foot line's two ends: "Available from Dec 1, 2026" and "AR-26411 · 9 days listed". */
	footStart?: string;
	footEnd?: string;
}

/** The parts a card may leave out, by hook (data-listing-<part>). */
export type ListingCardPart = "address" | "status" | "price" | "amount" | "period" | "price-note" | "badge" | "facts" | "foot" | "foot-start" | "foot-end";

/** Every text and attribute a card shows, and the parts it leaves out. */
export interface ListingCardView {
	id: string;
	href: string;
	title: string;
	address: string | null;
	status: string | null;
	/** The amount: "$1,125,000", "$3,150" (a rent's "/mo" is period). */
	amount: string | null;
	/** "/mo" for a month's rent, in its own quieter span. */
	period: string | null;
	priceNote: string | null;
	badge: string | null;
	footStart: string | null;
	footEnd: string | null;
	facts: FactCell[];
	image: { src: string; width: number; height: number; alt: string; srcset: string | null };
	/** The Save button's name: "Save" plus the title. */
	saveName: string;
	/** The optional parts this card leaves out. */
	missing: ListingCardPart[];
}

/** A text, or null when it is missing or only spaces. */
const text = (value: unknown): string | null => (typeof value === "string" && value.trim() !== "" ? value : null);

/** The view of one listing: every text the card shows, in the kit's formats, and what it leaves out. */
export function listingCardView(data: ListingCardData, fields: ListingField[], mode?: string): ListingCardView {
	const amount = data.price ? text(formatPrice({ amount: data.price.amount, period: "once" })) : null;
	const period = amount && data.price?.period === "month" ? "/mo" : null;
	const view: Omit<ListingCardView, "missing"> = {
		id: data.id,
		href: safeHref(data.href),
		title: data.title,
		address: text(data.address),
		status: text(data.status),
		amount,
		period,
		priceNote: text(data.priceNote),
		badge: text(data.badge),
		footStart: text(data.footStart),
		footEnd: text(data.footEnd),
		facts: factCells(fields, data.values ?? {}, mode),
		image: { src: data.image.src, width: data.image.width, height: data.image.height, alt: data.image.alt, srcset: text(data.image.srcset) },
		saveName: `Save ${data.title}`,
	};
	const missing: ListingCardPart[] = [];
	const check = (part: ListingCardPart, value: unknown) => {
		if (value === null) missing.push(part);
	};
	check("address", view.address);
	check("status", view.status);
	check("amount", view.amount);
	check("period", view.period);
	check("price-note", view.priceNote);
	if (!view.amount && !view.priceNote) missing.push("price");
	check("badge", view.badge);
	if (!view.facts.length) missing.push("facts");
	check("foot-start", view.footStart);
	check("foot-end", view.footEnd);
	if (!view.footStart && !view.footEnd) missing.push("foot");
	return { ...view, missing };
}

/**
 * A stand-in listing with every optional part set and a value for every card field, for the card inside
 * <template data-listing-template>: the template then holds every hook fillListingCard() fills or removes.
 */
export function templateListing(fields: ListingField[]): ListingCardData {
	const values: ListingValues = {};
	for (const field of fields) values[field.key] = field.kind === "choice" && field.options?.length ? field.options[0].value : field.format === "text" ? "-" : 1;
	return {
		id: "template",
		href: "#",
		title: "-",
		address: "-",
		status: "-",
		price: { amount: 1, period: "month" },
		priceNote: "-",
		values,
		image: { src: "data:,", width: 3, height: 2, alt: "", srcset: "data:, 1w" },
		badge: "-",
		footStart: "-",
		footEnd: "-",
	};
}

/** The element methods the fill uses: a plain DOM element. */
type Node = Element;

const hook = (part: string) => `[data-listing-${part}]`;

/**
 * A filled copy of the card in a <template data-listing-template>: text and attributes only, never HTML. Removes
 * the parts the listing does not have and the fact cells with no value, and sets the Save button's id and name.
 * A Save button in it starts hidden and shows once it lands in the page (lib/saved.ts). Returns the new card, not yet
 * in the page.
 */
export function fillListingCard(template: HTMLTemplateElement, data: ListingCardData, fields: ListingField[], mode?: string): HTMLElement {
	// The card, not what comes before it: Astro writes a part's processed script before its first use on a page.
	const first = template.content.querySelector("[data-listing-card]");
	if (!first) throw new Error("fillListingCard: the template holds no card ([data-listing-card])");
	const card = first.cloneNode(true) as HTMLElement;
	const view = listingCardView(data, fields, mode);
	const one = (selector: string): Node | null => (card.matches(selector) ? card : card.querySelector(selector));
	const setText = (part: string, value: string | null) => {
		const el = one(hook(part));
		if (el && value !== null) el.textContent = value;
	};

	// A copy of the processed script of the first Save button on a page (Astro renders it after the first one).
	for (const script of card.querySelectorAll("script")) script.remove();

	card.setAttribute("data-listing-id", view.id);
	const link = one(hook("link"));
	if (link) {
		link.setAttribute("href", view.href);
		link.textContent = view.title;
	}
	setText("address", view.address);
	setText("status", view.status);
	setText("amount", view.amount);
	setText("period", view.period);
	setText("price-note", view.priceNote);
	setText("badge", view.badge);
	setText("foot-start", view.footStart);
	setText("foot-end", view.footEnd);

	const img = one(`${hook("media")} img`);
	if (img) {
		img.setAttribute("src", view.image.src);
		img.setAttribute("width", String(view.image.width));
		img.setAttribute("height", String(view.image.height));
		img.setAttribute("alt", view.image.alt);
		if (view.image.srcset) img.setAttribute("srcset", view.image.srcset);
		else {
			img.removeAttribute("srcset");
			img.removeAttribute("sizes");
		}
	}

	// The label and the value both come from the view, for the fill's mode, whatever mode the template was rendered in.
	const facts = new Map(view.facts.map((cell) => [cell.key, cell]));
	for (const cell of card.querySelectorAll("[data-fact]")) {
		const fact = facts.get(cell.getAttribute("data-fact") ?? "");
		const dt = cell.querySelector("[data-fact-label]");
		const dd = cell.querySelector("[data-fact-value]");
		if (fact === undefined || !dd) cell.remove();
		else {
			if (dt) dt.textContent = fact.label;
			dd.textContent = fact.text;
		}
	}

	const save = one("[data-save-button]");
	if (save) {
		save.setAttribute("data-save-id", view.id);
		const name = save.querySelector("[data-save-name]");
		if (name) name.textContent = view.saveName;
	}

	for (const part of view.missing) for (const el of card.querySelectorAll(hook(part))) el.remove();
	return card;
}
