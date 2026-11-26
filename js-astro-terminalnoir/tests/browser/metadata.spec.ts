import { expect, test } from '@playwright/test';
import { site } from '../../src/config/site';
import { pageMetadata } from '../../src/lib/seo';
import { asset } from '../../src/lib/urls';

const base = process.env.SITE_BASE || '/';
const prefix = base === '/' ? '' : `/${base.split('/').filter(Boolean).join('/')}`;

test('canonical, alternates, favicon and social image follow the base', async ({ page }) => {
  await page.goto('');
  const pathname = new URL(page.url()).pathname;
  const meta = pageMetadata(site.url, base, pathname, 'Docs', 'Guide');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', meta.canonical);
  await expect(page.locator('link[hreflang="en"]')).toHaveAttribute('href', meta.alternates.en);
  await expect(page.locator('link[hreflang="pt-BR"]')).toHaveAttribute('href', meta.alternates['pt-br']);
  await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute('href', meta.alternates.en);
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', asset('/favicon.svg', base));
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', meta.image);
  expect(meta.canonical.includes('/toolkit/toolkit')).toBe(false);
});

test('an integration screenshot keeps a single base prefix', async ({ page }) => {
  await page.goto('integrations/editor');
  await expect(page.locator('img')).toHaveAttribute('src', asset('/images/example.svg', base));
});

test('sitemap and robots use the configured origin', async ({ page }) => {
  const robots = await page.request.get('robots.txt');
  expect(robots.ok()).toBeTruthy();
  expect(await robots.text()).toContain(`Sitemap: ${new URL(`${prefix}/sitemap-index.xml`, site.url).href}`);

  const index = await page.request.get('sitemap-index.xml');
  expect(index.ok()).toBeTruthy();
  const nested = [...(await index.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
  expect(nested.length).toBeGreaterThan(0);
  const pages: string[] = [];
  for (const loc of nested) {
    expect(loc.startsWith(site.url)).toBeTruthy();
    const relative = new URL(loc).pathname.replace(prefix, '').replace(/^\//, '');
    const child = await page.request.get(relative);
    expect(child.ok()).toBeTruthy();
    pages.push(...[...(await child.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]));
  }
  expect(pages.some(url => url.includes('/pt-br'))).toBeTruthy();
  expect(pages.some(url => url.includes('/integrations/'))).toBeTruthy();
  for (const url of pages) {
    expect(url.startsWith(`${site.url}${prefix}`)).toBeTruthy();
    expect(url.includes('/toolkit/toolkit')).toBeFalsy();
  }
});
