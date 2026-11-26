/**
 * Shopify Storefront API provider.
 * Connect a real store with two env vars:
 *   PUBLIC_SHOPIFY_DOMAIN=your-store.myshopify.com
 *   PUBLIC_SHOPIFY_STOREFRONT_TOKEN=xxxx   (Storefront API access token)
 * Checkout is Shopify's own — we build a cart and redirect to its URL.
 */
import type { CommerceProvider, Product, Collection, CartLine, Money } from './types';

const API_VERSION = '2025-07';

function endpoint(): string {
  return `https://${import.meta.env.PUBLIC_SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`;
}

async function gql<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch(endpoint(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': import.meta.env.PUBLIC_SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`Shopify Storefront API: HTTP ${res.status}`);
  const json = await res.json();
  if (json.errors?.length) throw new Error(`Shopify Storefront API: ${json.errors[0].message}`);
  return json.data as T;
}

function money(v: { amount: string; currencyCode: string }): Money {
  return { amount: Number(v.amount), currency: v.currencyCode };
}

const PRODUCT_FRAGMENT = /* GraphQL */ `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    tags
    images(first: 6) { nodes { url altText } }
    priceRange { minVariantPrice { amount currencyCode } }
    compareAtPriceRange { minVariantPrice { amount currencyCode } }
    variants(first: 50) {
      nodes {
        id
        title
        availableForSale
        price { amount currencyCode }
      }
    }
    collections(first: 10) { nodes { handle } }
  }
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProduct(p: any): Product {
  const compareAt = p.compareAtPriceRange?.minVariantPrice;
  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    description: p.description,
    tags: p.tags ?? [],
    images: p.images.nodes.map((i: any) => ({ src: i.url, alt: i.altText ?? p.title })),
    price: money(p.priceRange.minVariantPrice),
    compareAtPrice:
      compareAt && Number(compareAt.amount) > Number(p.priceRange.minVariantPrice.amount)
        ? money(compareAt)
        : undefined,
    variants: p.variants.nodes.map((v: any) => ({
      id: v.id,
      title: v.title,
      available: v.availableForSale,
      price: money(v.price),
    })),
    collectionHandles: p.collections.nodes.map((c: any) => c.handle),
  };
}

export const shopifyProvider: CommerceProvider = {
  async listProducts(opts = {}) {
    if (opts.collection) {
      const data = await gql<any>(
        `${PRODUCT_FRAGMENT}
         query ($handle: String!, $first: Int!) {
           collection(handle: $handle) {
             products(first: $first) { nodes { ...ProductFields } }
           }
         }`,
        { handle: opts.collection, first: opts.limit ?? 50 },
      );
      return (data.collection?.products.nodes ?? []).map(mapProduct);
    }
    const data = await gql<any>(
      `${PRODUCT_FRAGMENT}
       query ($first: Int!) {
         products(first: $first) { nodes { ...ProductFields } }
       }`,
      { first: opts.limit ?? 50 },
    );
    return data.products.nodes.map(mapProduct);
  },

  async getProduct(handle) {
    const data = await gql<any>(
      `${PRODUCT_FRAGMENT}
       query ($handle: String!) {
         product(handle: $handle) { ...ProductFields }
       }`,
      { handle },
    );
    return data.product ? mapProduct(data.product) : null;
  },

  async listCollections() {
    const data = await gql<any>(
      `query {
         collections(first: 20) {
           nodes { id handle title description image { url altText } }
         }
       }`,
    );
    return data.collections.nodes.map((c: any): Collection => ({
      id: c.id,
      handle: c.handle,
      title: c.title,
      description: c.description ?? '',
      image: c.image ? { src: c.image.url, alt: c.image.altText ?? c.title } : undefined,
    }));
  },

  async getCollection(handle) {
    const data = await gql<any>(
      `query ($handle: String!) {
         collection(handle: $handle) { id handle title description image { url altText } }
       }`,
      { handle },
    );
    const c = data.collection;
    if (!c) return null;
    return {
      id: c.id,
      handle: c.handle,
      title: c.title,
      description: c.description ?? '',
      image: c.image ? { src: c.image.url, alt: c.image.altText ?? c.title } : undefined,
    };
  },

  async checkoutUrl(lines: CartLine[]) {
    const data = await gql<any>(
      `mutation ($lines: [CartLineInput!]!) {
         cartCreate(input: { lines: $lines }) {
           cart { checkoutUrl }
           userErrors { message }
         }
       }`,
      { lines: lines.map((l) => ({ merchandiseId: l.variantId, quantity: l.quantity })) },
    );
    const err = data.cartCreate.userErrors?.[0];
    if (err) throw new Error(`Shopify cartCreate: ${err.message}`);
    return data.cartCreate.cart.checkoutUrl as string;
  },
};
