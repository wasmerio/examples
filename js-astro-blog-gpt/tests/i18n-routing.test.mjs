import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  mkdtemp,
  mkdir,
  writeFile,
  rm,
  readFile,
  readdir,
} from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import languages from '../src/i18n/i18n.config.ts';
import en from '../src/i18n/en.ts';
import zh from '../src/i18n/zh.ts';
import config from '../blog.config.ts';
import { canonicalLocale, localeChain } from '../src/lib/locale.ts';
import {
  contentLocales,
  interfaceMessages,
  localeInfo,
  formatMessage,
} from '../src/lib/translations.ts';
import { resolveLocalized } from '../src/lib/localized.ts';
import {
  validateConfig,
  validateLocalized,
} from '../src/lib/validate-config.ts';
import { fileIdentity, chooseVariants } from '../src/lib/content-variants.ts';
import { postPath, validatePostPrefix } from '../src/lib/post-path.ts';
import { bundleAssets } from '../src/integrations/content-bundles.ts';
import { contentUrls } from '../src/lib/content-urls.ts';
import localeRoutes from '../src/integrations/locale-routes.ts';

test('content languages work without matching UI packs and disabled UI languages produce no routes', () => {
  const japanese = languages.ja;
  delete languages.ja;
  try {
    const custom = structuredClone(config);
    custom.site.locales = ['ja', 'en'];
    custom.site.defaultLocale = 'ja';
    assert.equal(languages.ja, undefined);
    assert.doesNotThrow(() => validateConfig(custom));
    assert.deepEqual(interfaceMessages('ja', 'ja'), en);
    assert.deepEqual(interfaceMessages('ja', 'en'), en);
    assert.equal(localeInfo('ja').lang, 'ja');
    assert.equal(localeInfo('ja').dir, 'ltr');
    assert.ok(localeInfo('ja').label);

    const supported = contentLocales(custom.site.locales);
    const entries = ['ja', 'en', 'zh'].map((locale) => {
      const identity = fileIdentity(`guide/index.${locale}.mdx`, supported);
      return { data: { _key: identity.key, _locale: identity.locale } };
    });
    for (const locale of custom.site.locales)
      assert.equal(
        chooseVariants(entries, locale, 'ja', custom.site.locales)[0].data
          ._locale,
        locale,
      );
    assert.deepEqual(
      chooseVariants([entries[2]], 'ja', 'ja', custom.site.locales),
      [],
    );
    assert.equal(
      resolveLocalized(
        { ja: '日本語の紹介', en: 'English description' },
        'ja',
        'ja',
        custom.site.locales,
      ),
      '日本語の紹介',
    );

    const routes = [];
    localeRoutes(custom).hooks['astro:config:setup']({
      injectRoute: (route) => routes.push(route.pattern),
    });
    assert.ok(routes.includes('/ja/posts/[...slug]'));
    assert.ok(routes.includes('/en/posts/[...slug]'));
    assert.equal(
      routes.some((route) => route === '/zh' || route.startsWith('/zh/')),
      false,
    );
  } finally {
    if (japanese) languages.ja = japanese;
  }
});

test('central language packs support community, regional and RTL languages with per-key fallback', () => {
  assert.deepEqual(Object.keys(zh).sort(), Object.keys(en).sort());
  languages.pt = {
    label: 'Português',
    messages: { home: 'Início', search: 'Pesquisar' },
  };
  languages['pt-BR'] = {
    label: 'Português (Brasil)',
    messages: { home: 'Página inicial' },
  };
  languages.ar = { label: 'العربية', messages: { home: 'الرئيسية' } };
  try {
    const messages = interfaceMessages('pt-BR', 'en');
    assert.equal(messages.home, 'Página inicial');
    assert.equal(messages.search, 'Pesquisar');
    assert.equal(messages.share, en.share);
    assert.equal(interfaceMessages('fr', 'zh').home, zh.home);
    assert.equal(localeInfo('pt-br').lang, 'pt-BR');
    assert.equal(localeInfo('pt-BR').label, 'Português (Brasil)');
    assert.equal(localeInfo('ar').dir, 'rtl');
    assert.ok(localeInfo('ja').label);
    assert.notEqual(localeInfo('zh-TW').label, '简体中文');
    assert.ok(contentLocales(['ja']).includes('pt-BR'));
    assert.equal(
      resolveLocalized({ pt: 'Site', zh: '站点' }, 'pt-BR', 'zh'),
      'Site',
    );
    assert.equal(
      formatMessage('{posts} / {days}', { posts: 2, days: 30 }),
      '2 / 30',
    );
    assert.doesNotThrow(() =>
      validateLocalized({ ja: 'サイト', 'pt-BR': 'Site' }, 'copy'),
    );
    const custom = structuredClone(config);
    custom.site.locales.push('pt-BR', 'ar', 'ja');
    assert.doesNotThrow(() => validateConfig(custom));
    custom.site.locales.push('pt-br');
    assert.throws(() => validateConfig(custom), /equivalent/);
  } finally {
    delete languages.pt;
    delete languages['pt-BR'];
    delete languages.ar;
  }
  assert.equal(canonicalLocale('zh-tw'), 'zh-TW');
  for (const code of ['../en', 'en_US', '', 'en/zh'])
    assert.throws(() => canonicalLocale(code));
});

test('arbitrary registered filename suffixes pair by family and follow exact content fallback order', () => {
  const codes = ['zh', 'en', 'ja', 'pt-BR'];
  assert.deepEqual(fileIdentity('notes/index.pt-br.mdx', codes), {
    key: 'notes/index',
    locale: 'pt-BR',
    bundle: true,
  });
  const version = (locale) => ({
    data: { _key: 'notes/index', _locale: locale },
  });
  const entries = [
    version('zh'),
    version('ja'),
    version('pt-BR'),
    version(undefined),
  ];
  assert.equal(
    chooseVariants(entries, 'pt-BR', 'zh', codes)[0].data._locale,
    'pt-BR',
  );
  assert.equal(
    chooseVariants(entries, 'en', 'zh', codes)[0].data._locale,
    undefined,
  );
  assert.equal(
    chooseVariants(entries.slice(0, 3), 'en', 'zh', codes)[0].data._locale,
    'zh',
  );
});

test('article paths use publication dates in the site timezone and reject unsafe patterns', () => {
  const post = { slug: 'notes-hello', date: new Date('2025-12-31T16:30:00Z') };
  assert.equal(postPath(post), 'notes-hello');
  assert.equal(
    postPath(post, '[year]/[month]/[day]', 'Asia/Shanghai'),
    '2026/01/01/notes-hello',
  );
  assert.equal(
    postPath(post, 'journal/[year]', 'UTC'),
    'journal/2025/notes-hello',
  );
  assert.equal(
    postPath(post, '[year]/[month]/[day]/', 'Asia/Shanghai'),
    '2026/01/01/notes-hello',
  );
  assert.equal(
    postPath(post, 'journal/[year]/', 'UTC'),
    'journal/2025/notes-hello',
  );
  for (const pattern of [
    '/x',
    '../x',
    'x//y',
    '[slug]',
    '[unknown]',
    'page/[year]',
    'x?y',
    'x#y',
    'x%20',
    'x\\y',
  ])
    assert.throws(() => validatePostPrefix(pattern));
});

test('dated regional routes place bundle downloads beside the rendered article', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'bloggpt-route-'));
  try {
    const folder = path.join(root, 'content/posts/example');
    await mkdir(folder, { recursive: true });
    await writeFile(
      path.join(folder, 'index.pt-BR.mdx'),
      '---\ntitle: Exemplo\nslug: example\ndate: 2025-12-31T16:30:00Z\n---\n',
    );
    await writeFile(path.join(folder, 'download.txt'), 'download');
    const custom = structuredClone(config);
    custom.site.locales = ['pt-BR'];
    custom.site.defaultLocale = 'pt-BR';
    custom.posts.pathPrefix = '[year]/[month]/';
    const assets = await bundleAssets(root, custom);
    assert.equal(
      assets.get('pt-BR/posts/2026/01/example/download.txt'),
      path.join(folder, 'download.txt'),
    );
    assert.equal(assets.size, 1);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('content URLs follow the final page path without migrating author article links', () => {
  const result = contentUrls(
    '<main><div class="article-content"><a href="../older/?q=test#section">Older</a><a href="/blog/pt-BR/posts/older/">Old path</a><a href="#here">Here</a><img src="./cover.webp"><a href="./download.zip">Download</a></div></main>',
    new URL('https://preview.test/blog/pt-BR/posts/2026/start/'),
    new URL('https://example.com'),
  );
  assert.ok(result.includes('/blog/pt-BR/posts/2026/older/?q=test#section'));
  assert.ok(result.includes('href="/blog/pt-BR/posts/older/"'));
  assert.ok(result.includes('href="#here"'));
  assert.ok(result.includes('src="/blog/pt-BR/posts/2026/start/cover.webp"'));
  assert.ok(
    result.includes('href="/blog/pt-BR/posts/2026/start/download.zip"'),
  );
});

test('language fallback preserves exact extension packs and uses valid base language parents', () => {
  for (const [locale, expected] of [
    ['en-US-u-nu-latn', ['en-US-u-nu-latn', 'en-US', 'en']],
    ['zh-Hans-CN-x-blog', ['zh-Hans-CN-x-blog', 'zh-Hans-CN', 'zh-Hans', 'zh']],
    ['en-t-zh-hans-cn', ['en-t-zh-hans-cn', 'en']],
  ]) {
    assert.deepEqual(localeChain(locale), expected);
    assert.doesNotThrow(() => localeInfo(locale));
    assert.doesNotThrow(() => interfaceMessages(locale, locale));
    assert.equal(
      resolveLocalized({ en: 'English', zh: '中文' }, locale, 'en'),
      locale.startsWith('zh') ? '中文' : 'English',
    );
  }
  languages['en-US-u-nu-latn'] = {
    label: 'Custom English',
    messages: { home: 'Custom home' },
  };
  try {
    assert.equal(
      interfaceMessages('en-US-u-nu-latn', 'zh').home,
      'Custom home',
    );
    assert.equal(localeInfo('en-US-u-nu-latn').label, 'Custom English');
  } finally {
    delete languages['en-US-u-nu-latn'];
  }
});

test('demo taxonomy is flat, friends are grouped with distinct example avatars, and bundle templates are minimal', async () => {
  const { default: friends } = await import('../friends.config.ts');
  assert.deepEqual(
    friends.map((group) => group.title.en),
    ['Example sites', 'Theme help', 'Icon resources', 'Theme inspirations'],
  );
  assert.equal(new Set(friends[0].links.map((link) => link.avatar)).size, 3);
  assert.equal(
    friends
      .flatMap((group) => group.links)
      .some((link) => link.url.includes('feralui')),
    false,
  );
  for (const kind of ['pages', 'posts', 'categories', 'tags']) {
    const folder = `archetypes/${kind}/bundle/[slug]`;
    assert.deepEqual(await readdir(folder), ['index.mdx']);
    assert.doesNotMatch(
      await readFile(`${folder}/index.mdx`, 'utf8'),
      /cover|resources\//,
    );
  }
  for (const kind of ['categories', 'tags'])
    assert.equal((await readdir(`content/${kind}`)).includes('topics'), false);
});
