import { describe, it, expect } from 'vitest';
import {
  canonicalOf,
  jsonLdUrlOf,
  siteUrlDisagreement,
  disagreementMessage,
} from '../../scripts/site-url-agreement.mjs';

/**
 * The site's address is read from two places that cannot share code, and they
 * do not read the same sources: `astro.config.mjs` uses `process.env`, which
 * ignores `.env` files, while `site.config.ts` uses `astro:env/server`, which
 * does not. A user who sets SITE_URL in `.env` alone configures one of them,
 * and ships canonical tags for a domain they may not own (#643).
 *
 * The check compares one built page's two claims. These are the shapes it has
 * to get right.
 */

const page = ({ canonical, jsonLd }: { canonical?: string; jsonLd?: string }) => `
<!doctype html><html><head>
${canonical ? `<link rel="canonical" href="${canonical}" />` : ''}
${jsonLd ? `<script type="application/ld+json">${JSON.stringify({ '@type': 'WebSite', url: jsonLd })}</script>` : ''}
</head><body></body></html>`;

describe('reading a built page', () => {
  it('finds the canonical href', () => {
    expect(canonicalOf(page({ canonical: 'https://example.test/' }))).toBe('https://example.test/');
  });

  it('finds the first JSON-LD url, past blocks that have none', () => {
    const html = `
      <script type="application/ld+json">${JSON.stringify({ '@type': 'BreadcrumbList' })}</script>
      <script type="application/ld+json">${JSON.stringify({ '@type': 'WebSite', url: 'https://example.test' })}</script>`;
    expect(jsonLdUrlOf(html)).toBe('https://example.test');
  });

  it('reads a JSON-LD array', () => {
    const html = `<script type="application/ld+json">${JSON.stringify([
      { '@type': 'BreadcrumbList' },
      { '@type': 'WebSite', url: 'https://example.test' },
    ])}</script>`;
    expect(jsonLdUrlOf(html)).toBe('https://example.test');
  });

  it('steps over a malformed block instead of throwing', () => {
    const html = `
      <script type="application/ld+json">{ not json </script>
      <script type="application/ld+json">${JSON.stringify({ url: 'https://example.test' })}</script>`;
    expect(jsonLdUrlOf(html)).toBe('https://example.test');
  });

  it('returns null when there is nothing to read', () => {
    expect(canonicalOf('<html></html>')).toBeNull();
    expect(jsonLdUrlOf('<html></html>')).toBeNull();
  });
});

describe('comparing the two addresses', () => {
  it('passes when they name the same origin', () => {
    expect(
      siteUrlDisagreement(page({ canonical: 'https://mine.test/blog/', jsonLd: 'https://mine.test' }))
    ).toBeNull();
  });

  it('catches the bug in #643 — fallback canonical, real JSON-LD', () => {
    const found = siteUrlDisagreement(
      page({ canonical: 'https://example.com/', jsonLd: 'https://mine.test' })
    );
    expect(found).toMatchObject({
      canonicalOrigin: 'https://example.com',
      jsonLdOrigin: 'https://mine.test',
    });
  });

  it('catches a protocol mismatch, which is drift too', () => {
    expect(
      siteUrlDisagreement(page({ canonical: 'http://mine.test/', jsonLd: 'https://mine.test' }))
    ).not.toBeNull();
  });

  it('ignores the path, which differs per page by design', () => {
    expect(
      siteUrlDisagreement(
        page({ canonical: 'https://mine.test/blog/a-post/', jsonLd: 'https://mine.test' })
      )
    ).toBeNull();
  });

  it('says nothing when the page carries only one of them', () => {
    // A theme user may remove the JSON-LD. That is not a misconfiguration.
    expect(siteUrlDisagreement(page({ canonical: 'https://mine.test/' }))).toBeNull();
    expect(siteUrlDisagreement(page({ jsonLd: 'https://mine.test' }))).toBeNull();
  });

  it('says nothing when a value is not a URL', () => {
    expect(siteUrlDisagreement(page({ canonical: '/relative/', jsonLd: 'https://mine.test' }))).toBeNull();
  });
});

describe('the message a stopped build prints', () => {
  it('shows both values and names where each comes from', () => {
    const found = siteUrlDisagreement(
      page({ canonical: 'https://example.com/', jsonLd: 'https://mine.test' })
    );
    const message = disagreementMessage('/index.html', found);
    expect(message).toContain('https://example.com/');
    expect(message).toContain('https://mine.test');
    expect(message).toContain('astro.config.mjs');
    expect(message).toContain('site.config.ts');
    expect(message).toContain('SITE_URL');
  });
});
