import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One Markdown file in src/content/products/ is one product. The file name is the URL slug
// (and the client_reference_id Stripe receives), so keep it lowercase with dashes.
const products = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
	schema: z.object({
		title: z.string(),
		// Price in the currency's main unit, e.g. 34 or 12.5. Shown on the page and in JSON-LD.
		// Stripe charges what the Payment Link says, so keep the two in step.
		price: z.number().nonnegative(),
		currency: z.string().length(3).default('USD'),
		// A file in public/, written without the base path, e.g. /products/coptic-a5.svg
		image: z.string(),
		imageAlt: z.string().optional(),
		summary: z.string().max(200),
		category: z.string(),
		// Live and test Payment Links from the Stripe dashboard. PUBLIC_STRIPE_MODE picks one at build time.
		paymentLink: z.string().default(''),
		paymentLinkTest: z.string().default(''),
		specs: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
		faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
		badge: z.string().optional(),
		// Example question shown in the empty Ask box.
		askPlaceholder: z.string().optional(),
		soldOut: z.boolean().default(false),
		featured: z.boolean().default(false),
		// Lower numbers come first in the shop.
		order: z.number().default(100),
	}),
});

export const collections = { products };
