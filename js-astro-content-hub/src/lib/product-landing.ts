// Per-product landing-page override resolver.
//
// A product can ship a custom landing (distinct <main> sections) by adding
// `src/components/product-landing/<slug>.astro`. Products without a matching
// file fall back to `ProductLandingDefault.astro`, rendered by the
// `[product]` route. The override renders only the <main> sections; the route
// owns Layout/Nav/Footer and the <head>.
//
// The glob is eager so overrides are inlined at build time; modules are keyed
// by their filename (the product slug) for O(1) lookup. Resolution happens at
// render time, so `getStaticPaths` is unaffected.

import type { Product } from '../../site.config';
import type { Locale, ProductCopy } from './i18n';

export interface ProductLandingProps {
  product: Product;
  locale: Locale;
  c: ProductCopy;
  docsHref: string;
}

// Astro components compiled from .astro files expose a callable default
// export whose return type is compiler-synthesized; matching Astro's own
// `SvgComponent` / `Element = HTMLElement | any` conventions, a `=> any`
// return is the bridge for a dynamically-resolved component. The route
// validates prop shapes at the <Component /> call site.
export type ProductLandingComponent = (props: ProductLandingProps) => any;

const modules = import.meta.glob('../components/product-landing/*.astro', {
  eager: true,
}) as Record<string, { default: ProductLandingComponent }>;

const overrides: Record<string, ProductLandingComponent> = {};
for (const [path, mod] of Object.entries(modules)) {
  const slug = path.match(/\/([^/]+)\.astro$/)?.[1];
  if (slug) overrides[slug] = mod.default;
}

/** Returns the per-product landing override for a slug, or undefined to fall
 *  back to the generic landing. */
export function getProductLanding(slug: string): ProductLandingComponent | undefined {
  return overrides[slug];
}
