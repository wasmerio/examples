import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { store, policies } from '../data/store';
import { formatPrice, sortProducts, url, categoryLabel } from '../lib/shop';

// A plain-text catalogue for AI assistants and search tools: every product with price and link, plus the policies.
export const GET: APIRoute = async ({ site }) => {
	const abs = (p: string) => new URL(url(p), site).toString();
	const products = sortProducts(await getCollection('products'));
	const lines = [
		`# ${store.name}`,
		'',
		`> ${store.tagline}`,
		'',
		store.description,
		'',
		'## Products',
		'',
		...products.map((p) => `- [${p.data.title}](${abs(`/products/${p.id}/`)}): ${formatPrice(p.data.price, p.data.currency)}, ${categoryLabel(p.data.category)}${p.data.soldOut ? ', sold out' : ''}. ${p.data.summary}`),
		'',
		'## Shipping and returns',
		'',
		...policies.map((p) => `- ${p.heading}: ${p.text}`),
		'',
		'## Pages',
		'',
		`- [Shop](${abs('/shop/')})`,
		`- [About](${abs('/about/')})`,
		`- [Shipping and returns](${abs('/shipping/')})`,
		`- [Contact](${abs('/contact/')}): ${store.email}`,
		'',
	];
	return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
