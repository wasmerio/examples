import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import config from '../blog.config.ts';
import friends from '../friends.config.ts';
import { resolveLocalized } from '../src/lib/localized.ts';
import {
  validateConfig,
  validateFriendsConfig,
  validateLocalized,
} from '../src/lib/validate-config.ts';

test('localized copy resolves partial maps, configured order and intentionally blank translations', () => {
  const resolve = (value, lang = 'en', fallback = 'zh', order = ['zh', 'en']) =>
    resolveLocalized(value, lang, fallback, order);
  assert.equal(resolve('BlogGPT'), 'BlogGPT');
  assert.equal(resolve({ zh: '中文', en: 'English' }), 'English');
  assert.equal(resolve({ zh: '中文' }), '中文');
  assert.equal(resolve({ en: 'English' }, 'zh'), 'English');
  assert.equal(resolve({ zh: '中文', en: '' }), '');
  assert.equal(resolve({ en: 'English' }, 'zh', 'zh', []), 'English');
});

test('public configuration accepts localized names and rejects malformed copy before rendering', () => {
  const localized = structuredClone(config);
  localized.site.title = { zh: '站名', en: 'Site' };
  localized.author.name = { zh: '作者', en: 'Author' };
  localized.author.bio = { zh: '作者介绍', en: 'Author biography' };
  localized.author.socials[0].label = { en: 'Code' };
  localized.footer.author = { zh: '', en: 'Copyright author' };
  localized.footer.license.label = 'Apache-2.0';
  localized.sharing.platforms[0].name = { en: 'Share to X' };
  assert.doesNotThrow(() => validateConfig(localized));
  const links = structuredClone(friends);
  links[0].links[0].name = { zh: '资源', en: 'Resource' };
  assert.doesNotThrow(() => validateFriendsConfig(links));
  for (const value of [{}, null, [], { zh: 2 }, { 'bad/code': 'Invalid' }])
    assert.throws(() => validateLocalized(value, 'test'));
  const bio = localized.author.bio;
  localized.author.bio = {};
  assert.throws(() => validateConfig(localized), /author.bio/);
  localized.author.bio = bio;
  localized.author.name = {};
  assert.throws(() => validateConfig(localized), /author.name/);
});

test('translated demo pages render clean identity text and covers precede article titles', async () => {
  for (const lang of ['zh', 'en']) {
    const article = await readFile(
      `dist/${lang}/posts/welcome/index.html`,
      'utf8',
    );
    assert.ok(article.includes('class="article-cover"'));
    assert.ok(
      article.indexOf('class="article-cover"') <
        article.indexOf('class="article-header"'),
    );
    assert.ok(article.includes('Astro Theme BlogGPT'));
    assert.equal(article.includes('[object Object]'), false);
    const design = await readFile(
      `dist/${lang}/posts/design/index.html`,
      'utf8',
    );
    assert.equal(design.includes('class="article-note"'), false);
    assert.ok(
      design.includes(lang === 'zh' ? '找到一篇文章' : 'Find an article'),
    );
    const about = await readFile(`dist/${lang}/about/index.html`, 'utf8');
    assert.ok(about.includes(lang === 'zh' ? '关于 BlogGPT' : 'About BlogGPT'));
    assert.equal(about.includes('Lorem Ipsum'), false);
  }
});
