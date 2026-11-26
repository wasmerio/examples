import type { Page } from '@playwright/test';

import { siteConfig } from '@data/siteConfig';

export const rawUrl = process.env.ASTRO_URL || siteConfig.url;
export const parsedBase = rawUrl
  ? new URL(rawUrl).pathname.replace(/\/+$/, '')
  : '';

export const base = parsedBase.replace(/\/$/, '');

export function toUrl(p: string): string {
  return `${base}${p.startsWith('/') ? p : `/${p}`}`;
}

/**
 * Attaches listeners to catch uncaught console errors and HTTP >= 400 responses
 * for static assets (images, stylesheets, scripts, icons, fonts).
 */
export function attachAssetErrorListener(
  page: Page,
  failedAssets: string[]
): void {
  page.on('response', (res) => {
    const status = res.status();
    const url = res.url();
    // Exclude deliberate HTML 404 navigation tests
    if (status >= 400 && !url.includes('/404'))
      failedAssets.push(`${status}: ${url}`);
  });

  page.on('pageerror', (err) => {
    failedAssets.push(`PageError: ${err.message}`);
  });
}
