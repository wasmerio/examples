/**
 * Provider selection — the only place that knows which backend is active.
 * Default: mock (works with zero config). Set env to go live:
 *   COMMERCE_PROVIDER=shopify
 *   PUBLIC_SHOPIFY_DOMAIN=your-store.myshopify.com
 *   PUBLIC_SHOPIFY_STOREFRONT_TOKEN=xxxx
 */
import type { CommerceProvider } from './types';
import { mockProvider } from './mock';
import { shopifyProvider } from './shopify';

const name = import.meta.env.COMMERCE_PROVIDER ?? 'mock';

export const commerce: CommerceProvider = name === 'shopify' ? shopifyProvider : mockProvider;
export const providerName = name;
export * from './types';
