import { getCollection, type CollectionEntry } from "astro:content";
import { siteConfig } from "@/config/site";

type ProductEntry = CollectionEntry<"products">;
export type Product = ProductEntry["data"] & { slug: string; description: string };

function slugFromEntry(entry: ProductEntry): string {
  return entry.id.replace(/\.(md|mdx)$/, "");
}

function descriptionFromEntry(entry: ProductEntry): string {
  return (entry.body ?? "").trim().replace(/\s+/g, " ");
}

function byOrderThenName(a: Product, b: Product): number {
  return a.order - b.order || a.name.localeCompare(b.name);
}

export async function getProducts(): Promise<Product[]> {
  const entries = await getCollection("products");
  return entries
    .map((entry: ProductEntry) => ({
      slug: slugFromEntry(entry),
      description: descriptionFromEntry(entry),
      ...entry.data,
    }))
    .sort(byOrderThenName);
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((product) => product.slug === slug);
}

export function getRelated(products: Product[], slug: string, limit = 3): Product[] {
  const current = products.find((product) => product.slug === slug);
  if (!current) return products.slice(0, limit);

  return products
    .filter((product) => product.slug !== slug)
    .sort((a, b) => {
      const aScore = a.category === current.category ? -1 : 1;
      const bScore = b.category === current.category ? -1 : 1;
      return aScore - bScore || byOrderThenName(a, b);
    })
    .slice(0, limit);
}

export function getProductFilters(products: Product[]): {
  categories: string[];
  materials: string[];
} {
  return {
    categories: [...new Set(products.map((product) => product.category))],
    materials: [...new Set(products.map((product) => product.material))],
  };
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat(siteConfig.commerce.locale, {
    style: "currency",
    currency: siteConfig.commerce.currency,
    maximumFractionDigits: 0,
  }).format(value);
}

/** Resolves a configured slug, failing the build when it does not exist. */
export function requireProduct(products: Product[], slug: string): Product {
  const product = products.find((entry) => entry.slug === slug);
  if (!product) {
    throw new Error(
      `siteConfig.featured references "${slug}", but no such product exists in src/content/products.`,
    );
  }
  return product;
}

export function productForJson(product: Product) {
  return {
    slug: product.slug,
    name: product.name,
    collection: product.collection,
    category: product.category,
    material: product.material,
    price: product.price,
    shortDescription: product.shortDescription,
    description: product.description,
    dimensions: product.dimensions,
    finish: product.finish,
    leadTime: product.leadTime,
  };
}
