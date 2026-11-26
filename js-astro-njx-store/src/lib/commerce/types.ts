/**
 * Provider-agnostic commerce types.
 * Every provider (mock, Shopify, Medusa) maps its API into these shapes,
 * so pages and components never import provider-specific code.
 */

export interface Money {
  amount: number;
  currency: string; // ISO 4217, e.g. "USD"
}

export interface ProductImage {
  src: string;
  alt: string;
}

export interface ProductVariant {
  id: string;
  title: string; // e.g. "M / Black"
  price: Money;
  available: boolean;
}

export interface Product {
  id: string;
  handle: string; // URL slug
  title: string;
  description: string;
  images: ProductImage[];
  price: Money; // min variant price
  compareAtPrice?: Money; // for "sale" badges
  variants: ProductVariant[];
  tags: string[];
  collectionHandles: string[];
}

export interface Collection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image?: ProductImage;
}

export interface CartLine {
  variantId: string;
  productHandle: string;
  title: string;
  variantTitle: string;
  image?: ProductImage;
  price: Money;
  quantity: number;
}

/** Contract every commerce provider implements. */
export interface CommerceProvider {
  listProducts(opts?: { collection?: string; limit?: number }): Promise<Product[]>;
  getProduct(handle: string): Promise<Product | null>;
  listCollections(): Promise<Collection[]>;
  getCollection(handle: string): Promise<Collection | null>;
  /** Returns the URL to send the buyer to for checkout. */
  checkoutUrl(lines: CartLine[]): Promise<string>;
}
