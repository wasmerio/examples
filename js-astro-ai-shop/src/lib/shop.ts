import type { CollectionEntry } from 'astro:content';
import { store, policies } from '../data/store';

export type Product = CollectionEntry<'products'>;

/** Prefix an internal path with the base path, so links work on a GitHub project page too. */
export function url(path = '/'): string {
	const base = import.meta.env.BASE_URL.replace(/\/$/, '');
	if (/^(https?:|mailto:|#)/.test(path)) return path;
	return base + (path.startsWith('/') ? path : '/' + path);
}

export function formatPrice(amount: number, currency = store.currency): string {
	return new Intl.NumberFormat(store.locale, {
		style: 'currency',
		currency,
		minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
	}).format(amount);
}

/** Splits "$34" into symbol and number so the number can be set large and the symbol small. */
export function priceParts(amount: number, currency = store.currency) {
	const parts = new Intl.NumberFormat(store.locale, {
		style: 'currency',
		currency,
		minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
	}).formatToParts(amount);
	const symbol = parts.find((p) => p.type === 'currency')?.value ?? '';
	const number = parts.filter((p) => p.type !== 'currency' && p.type !== 'literal').map((p) => p.value).join('');
	return { symbol, number };
}

export const stripeMode: 'test' | 'live' = import.meta.env.PUBLIC_STRIPE_MODE === 'live' ? 'live' : 'test';

/** A link is a placeholder until it is a real https URL without REPLACE_ME in it. */
export function isRealLink(link: string | undefined): link is string {
	return !!link && /^https:\/\//.test(link) && !/REPLACE_ME/i.test(link);
}

export type BuyState =
	| { kind: 'buy'; href: string; mode: 'test' | 'live' }
	| { kind: 'soldout' }
	| { kind: 'demo' };

/** Chooses the Payment Link for this build (PUBLIC_STRIPE_MODE) and tags it with the product slug. */
export function buyState(p: Product): BuyState {
	if (p.data.soldOut) return { kind: 'soldout' };
	const link = stripeMode === 'live' ? p.data.paymentLink : p.data.paymentLinkTest;
	if (!isRealLink(link)) return { kind: 'demo' };
	const u = new URL(link);
	u.searchParams.set('client_reference_id', p.id);
	return { kind: 'buy', href: u.toString(), mode: stripeMode };
}

export const categoryLabel = (id: string) => store.categories.find((c) => c.id === id)?.label ?? id;

export function sortProducts(list: Product[]): Product[] {
	return [...list].sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title));
}

/** Markdown body to plain text, for the Ask box context, meta descriptions and llms.txt. */
export function plainText(md = ''): string {
	return md
		.replace(/```[\s\S]*?```/g, '')
		.replace(/!\[[^\]]*\]\([^)]*\)/g, '')
		.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
		.replace(/^#+\s*/gm, '')
		.replace(/[*_`>]/g, '')
		.replace(/\n{3,}/g, '\n\n')
		.trim();
}

export const policyText = () => policies.map((p) => `${p.heading}: ${p.text}`).join('\n');

/** Everything the Ask box may answer from: this product and the store policies. Nothing else. */
export function askContext(p: Product): string {
	const d = p.data;
	const availability = d.soldOut ? 'Sold out (not available to buy right now)' : 'Available to buy on this page';
	return [
		`Store: ${store.name}, ${store.location}. Contact: ${store.email}.`,
		``,
		`PRODUCT`,
		`Name: ${d.title}`,
		`Price: ${formatPrice(d.price, d.currency)} (${d.currency}), before shipping and any tax`,
		`Availability: ${availability}`,
		`Category: ${categoryLabel(d.category)}`,
		`Summary: ${d.summary}`,
		``,
		`Description:`,
		plainText(p.body),
		``,
		`Specifications:`,
		...d.specs.map((s) => `- ${s.label}: ${s.value}`),
		``,
		`Product FAQ:`,
		...d.faq.map((f) => `Q: ${f.q}\nA: ${f.a}`),
		``,
		`SHIPPING, RETURNS AND PAYMENT (applies to every product)`,
		policyText(),
		``,
		`How buying works: ${store.checkout}`,
	].join('\n');
}
