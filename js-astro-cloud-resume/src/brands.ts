/**
 * Visual styles ("brands") the theme ships with.
 *
 * A brand only changes colours, font and a few shape tokens (see the
 * `[data-brand=...]` blocks in src/styles/global.css). Markup and data are shared.
 * Pick one with `brand` in src/config.ts, or the BRAND environment variable.
 *
 * This file is also read by astro.config.mjs, so it must stay plain TypeScript
 * (no `astro:*` imports).
 */
export const brands = ['aws', 'azure', 'gcp', 'openstack'] as const;
export type Brand = (typeof brands)[number];

export interface BrandInfo {
  /** Human-readable name, used by the demo switcher. */
  label: string;
  /** `issuer` used for certifications that do not set one. */
  issuer: string;
  /** Self-hosted @fontsource package loaded for this brand (only this one is bundled). */
  font: string;
  /** Browser UI colour (`<meta name="theme-color">`): the top bar colour, light and dark. */
  themeColor: { light: string; dark: string };
  /**
   * Favicon and placeholder badge, relative to `public/`.
   * `aws` keeps the historical root files so existing sites are unchanged.
   */
  favicon: string;
  badgePlaceholder: string;
}

export const brandInfo: Record<Brand, BrandInfo> = {
  aws: {
    label: 'AWS',
    issuer: 'Amazon Web Services',
    font: '@fontsource-variable/inter',
    themeColor: { light: '#232f3e', dark: '#232f3e' },
    favicon: 'favicon.svg',
    badgePlaceholder: 'badge-placeholder.svg',
  },
  azure: {
    label: 'Azure',
    issuer: 'Microsoft',
    font: '@fontsource-variable/open-sans',
    themeColor: { light: '#0f6cbd', dark: '#1f1f1f' },
    favicon: 'brands/azure/favicon.svg',
    badgePlaceholder: 'brands/azure/badge-placeholder.svg',
  },
  gcp: {
    label: 'Google Cloud',
    issuer: 'Google Cloud',
    font: '@fontsource-variable/google-sans-flex',
    themeColor: { light: '#ffffff', dark: '#1e1f20' },
    favicon: 'brands/gcp/favicon.svg',
    badgePlaceholder: 'brands/gcp/badge-placeholder.svg',
  },
  openstack: {
    label: 'OpenStack',
    issuer: 'OpenInfra Foundation',
    font: '@fontsource-variable/source-sans-3',
    themeColor: { light: '#2b2b2b', dark: '#1a1a1a' },
    favicon: 'brands/openstack/favicon.svg',
    badgePlaceholder: 'brands/openstack/badge-placeholder.svg',
  },
};

export function isBrand(value: unknown): value is Brand {
  return typeof value === 'string' && (brands as readonly string[]).includes(value);
}
