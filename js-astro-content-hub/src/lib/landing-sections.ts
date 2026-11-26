// Landing-section registry - "MD declares data, code registry maps components".
//
// A product-info frontmatter `sections` array names section types in order.
// This module resolves each type to an Astro component at build time via an
// eager glob over src/components/landing-sections/<type>.astro (the same
// pattern as src/lib/product-landing.ts, which globs per-product overrides).
//
// Each section component is a dumb, presentational component: data in,
// markup out, reusing the shared global.css classes (hero, feature-grid,
// product-highlight, cta-box, ...). One file per section type, so adding a
// section = one .astro file + one entry here (auto via the glob).
//
// Unknown types resolve to undefined; the renderer (ProductLandingDefault)
// skips them so a type added to MD before its component ships never breaks
// the build. validate-hub-content.mjs warns on unregistered types.

import type { Product } from '../../site.config';
import type { Locale, ProductCopy } from './i18n';

export interface LandingSectionProps {
  /** Section type (filename key), for debugging / data attributes. */
  type: string;
  /** Section data from frontmatter, or the matching default product-info
   *  field when the author omitted `data` (resolved by the renderer). */
  data: unknown;
  product: Product;
  locale: Locale;
  c: ProductCopy;
  /** Base-aware, locale-prefixed docs link, pre-computed by the route. */
  docsHref: string;
}

// Astro components compiled from .astro files expose a callable default
// export whose return type is compiler-synthesized; `=> any` is the bridge
// for dynamically-resolved components (same convention as product-landing.ts).
export type LandingSectionComponent = (props: LandingSectionProps) => any;

const modules = import.meta.glob('../components/landing-sections/*.astro', {
  eager: true,
}) as Record<string, { default: LandingSectionComponent }>;

const registry: Record<string, LandingSectionComponent> = {};
for (const [path, mod] of Object.entries(modules)) {
  const type = path.match(/\/([^/]+)\.astro$/)?.[1];
  if (type) registry[type] = mod.default;
}

/** Resolve a section type to its component, or undefined when unregistered
 *  (the renderer skips unknown types rather than failing the build). */
export function getSectionComponent(type: string): LandingSectionComponent | undefined {
  return registry[type];
}

/** Registered section types (stable order), for validation tooling. */
export function getRegisteredSectionTypes(): string[] {
  return Object.keys(registry).sort();
}
