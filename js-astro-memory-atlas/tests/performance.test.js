import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { getAlbumImageOptions, selectImagePreset } from '../src/lib/image-presets.js';
import { renderRobots, renderSitemap, socialImageUrl } from '../src/lib/seo.js';

test('large illustrations are not capped at a thumbnail width', () => {
  const hero = selectImagePreset({ variant: 'hero' });
  const story = selectImagePreset({ className: 'memory-image-frame__image' });
  assert.equal(hero.sizes, '100vw');
  assert.ok(hero.width >= 1280);
  assert.ok(story.width >= 1000);
  const options = getAlbumImageOptions({ width: 2400 }, hero);
  assert.equal(options.width, 1600);
  assert.ok(options.widths.at(-1) <= 1600);
});

test('the self-hosted base font is a small subset and the full variable file is not shipped', async () => {
  const base = await stat(new URL('../src/assets/fonts/NotoSansSC-base.woff2', import.meta.url));
  const css = await readFile(new URL('../src/styles/font-face.css', import.meta.url), 'utf8');
  assert.ok(base.size < 400_000, `base font should stay under 400KB, got ${base.size}`);
  assert.match(css, /NotoSansSC-base\.woff2/);
  assert.match(css, /unicode-range:/);
  await assert.rejects(stat(new URL('../src/assets/fonts/NotoSansSC-VF.woff2', import.meta.url)));
});

test('the homepage does not download the album document before it can render', async () => {
  const source = await readFile(new URL('../src/scripts/home.js', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /album\/index\.html/);
  assert.match(source, /initializeHomeExperience/);
});

test('robots and sitemap use the configured site origin', () => {
  assert.match(renderRobots(''), /^User-agent: \*\nAllow: \/\n$/);
  assert.doesNotMatch(renderSitemap(''), /<loc>/);
  assert.match(renderRobots('https://example.com', '/astro-memory-atlas/'), /Sitemap: https:\/\/example\.com\/astro-memory-atlas\/sitemap\.xml/);
  assert.match(renderSitemap('https://example.com', '/demo'), /<loc>https:\/\/example\.com\/demo\/journey\/<\/loc>/);
  assert.match(renderSitemap('https://example.com', '/'), /hreflang="en"/);
  assert.match(renderSitemap('https://example.com', '/'), /hreflang="zh-CN"/);
  assert.match(renderSitemap('https://example.com', '/'), /hreflang="x-default"/);
  assert.equal(socialImageUrl(''), '');
  assert.equal(socialImageUrl('https://example.com', '/astro-memory-atlas/'), 'https://example.com/astro-memory-atlas/og.jpg');
});

test('the social image is a 1200 by 630 JPEG', async () => {
  const file = new URL('../public/og.jpg', import.meta.url);
  const sharp = (await import('sharp')).default;
  const meta = await sharp(file.pathname).metadata();
  const fileStat = await stat(file);
  assert.equal(meta.format, 'jpeg');
  assert.equal(meta.width, 1200);
  assert.equal(meta.height, 630);
  assert.ok(fileStat.size < 400_000, `social image should stay under 400KB, got ${fileStat.size}`);
});
