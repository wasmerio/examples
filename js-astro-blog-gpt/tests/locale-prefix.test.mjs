import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import config from '../blog.config.ts';
import {
  localeHref,
  routeLocale,
  hasLocalePrefix,
  isRealTranslation,
} from '../src/lib/locale-routing.ts';
import localeRoutes from '../src/integrations/locale-routes.ts';
import { validateConfig } from '../src/lib/validate-config.ts';

test('language policies consistently build final paths for default, regional and other locales under a deployment base', () => {
  const site = {
    base: '/blog/',
    defaultLocale: 'pt-BR',
    locales: ['pt-BR', 'zh', 'en'],
  };
  for (const policy of [
    undefined,
    'redirect-to-default',
    'require-prefix',
    'omit-default-prefix',
  ]) {
    const options = { ...site, localePrefixPolicy: policy };
    assert.equal(
      localeHref(options, 'pt-BR', '/posts/2026/example/'),
      policy === 'omit-default-prefix'
        ? '/blog/posts/2026/example/'
        : '/blog/pt-BR/posts/2026/example/',
    );
    assert.equal(localeHref(options, 'en', 'search/'), '/blog/en/search/');
    assert.equal(routeLocale('/pt-BR/posts/[...slug]', options), 'pt-BR');
    assert.equal(routeLocale('/en/rss.xml', options), 'en');
    assert.equal(routeLocale('/posts/[...slug]', options), 'pt-BR');
    assert.equal(hasLocalePrefix('/blog/pt-BR/posts/example/', options), true);
    assert.equal(hasLocalePrefix('/blog/posts/example/', options), false);
    assert.equal(hasLocalePrefix('/blog/enough/', options), false);
  }
  assert.equal(isRealTranslation({ data: { lang: 'zh' } }, 'en'), false);
  assert.equal(isRealTranslation({ data: { lang: 'en' } }, 'en'), true);
});

test('native routes omit default-language duplicates and unprefixed redirects unless explicitly selected', () => {
  for (const policy of [
    'redirect-to-default',
    'omit-default-prefix',
    'require-prefix',
  ]) {
    const custom = structuredClone(config);
    custom.site.localePrefixPolicy = policy;
    const routes = [];
    localeRoutes(custom).hooks['astro:config:setup']({
      injectRoute: (route) => routes.push(route),
    });
    const patterns = routes.map((route) => route.pattern);
    assert.equal(
      patterns.includes('/[...unprefixed]'),
      policy === 'redirect-to-default',
    );
    assert.equal(patterns.includes('/'), policy === 'omit-default-prefix');
    assert.equal(
      patterns.includes('/zh/posts/[...slug]'),
      policy !== 'omit-default-prefix',
    );
    assert.equal(
      patterns.includes('/posts/[...slug]'),
      policy === 'omit-default-prefix',
    );
    assert.ok(patterns.includes('/en/posts/[...slug]'));
    assert.equal(new Set(patterns).size, patterns.length);
    assert.doesNotThrow(() => validateConfig(custom));
  }
  const invalid = structuredClone(config);
  invalid.site.localePrefixPolicy = 'automatic';
  assert.throws(() => validateConfig(invalid), /localePrefixPolicy/);
});

test('default redirect aliases refresh directly to generated final pages and stay outside sitemap', async () => {
  const sitemap = await readFile('dist/sitemap-0.xml', 'utf8');
  for (const route of [
    '',
    'posts/design/',
    'about/',
    'categories/guide/',
    'posts/page/2/',
  ]) {
    const alias = await readFile(`dist/${route}index.html`, 'utf8');
    const target = alias.match(
      /http-equiv="refresh" content="0;url=([^"]+)"/,
    )?.[1];
    assert.equal(target, `/zh/${route}`);
    const final = await readFile(`dist${target}index.html`, 'utf8');
    assert.doesNotMatch(final, /http-equiv="refresh"/);
    assert.ok(
      final.includes(`rel="canonical" href="https://example.com${target}"`),
    );
    assert.equal(
      sitemap.includes(`<loc>https://example.com/${route}</loc>`),
      false,
    );
  }
  assert.ok(
    sitemap.includes('<loc>https://example.com/zh/posts/design/</loc>'),
  );
  await access('dist/en/posts/design/index.html');
});
