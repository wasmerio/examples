import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  isPublished,
  canRender,
  canDiscover,
  safeSlug,
  validateContentSlugs,
} from '../src/lib/policy.ts';

const now = new Date('2026-10-14T00:00:00Z');
const post = (overrides = {}) => ({
  date: new Date('2026-01-01'),
  draft: false,
  hidden: false,
  ...overrides,
});
test('drafts and scheduled articles cannot leak into production or discovery', () => {
  for (const data of [
    post({ draft: true }),
    post({ date: new Date('2099-01-01') }),
  ]) {
    assert.equal(isPublished(data, now), false);
    assert.equal(canRender(data, false, true, now), false);
    assert.equal(canDiscover(data, now), false);
    assert.equal(canRender(data, true, true, now), true);
    assert.equal(canRender(data, true, false, now), false);
  }
});
test('unlisted articles have a route but never appear in discovery', () => {
  assert.equal(canRender(post({ hidden: true }), false, false, now), true);
  assert.equal(canDiscover(post({ hidden: true }), now), false);
  assert.equal(canDiscover(post(), now), true);
});
test('slugs start with a lowercase ASCII letter or digit and otherwise allow only those characters and hyphens', () => {
  for (const value of ['hello', 'my-post-2026', '123', 'post-', 'a', '0'])
    assert.equal(safeSlug(value), value);
  for (const invalid of [
    '',
    '-post-',
    '-123',
    '-',
    '--',
    '../secret',
    'foo/../bar',
    'foo?x=1',
    'foo#bar',
    'foo\\bar',
    'foo//bar',
    '中文文章',
    'review%25',
    'hello world',
    'hello_world',
    'foo.bar',
    'notes/hello',
    ' hello ',
    '/hello/',
    "reader's-notes",
    'My-Post-2026',
    'ReviewCase',
    'HELLO',
    'hello\n',
  ])
    assert.throws(() => safeSlug(invalid));
});

test('invalid content slugs warn with file and field before stopping', () => {
  const warnings = [];
  assert.throws(
    () =>
      validateContentSlugs(
        {
          slug: 'review%25',
          tags: ['valid-tag', '无效'],
          categories: 'bad/category',
        },
        'content/posts/example.en.md',
        (message) => warnings.push(message),
        true,
      ),
    /Invalid content slugs/,
  );
  assert.equal(warnings.length, 3);
  assert.ok(
    warnings.every(
      (message) =>
        message.includes('content/posts/example.en.md') &&
        message.includes('ASCII letters'),
    ),
  );
  assert.ok(warnings.some((message) => message.includes('tags slug')));
  assert.ok(warnings.some((message) => message.includes('categories slug')));
  assert.doesNotThrow(() =>
    validateContentSlugs(
      { slug: 'valid-post', tags: ['tag-1'] },
      'post.md',
      () => assert.fail('Unexpected warning'),
      true,
    ),
  );
  for (const field of ['slug', 'category', 'categories', 'tags']) {
    const warnings = [];
    assert.throws(
      () =>
        validateContentSlugs(
          {
            slug: 'valid',
            [field]:
              field === 'slug' || field === 'category'
                ? '-invalid'
                : ['-invalid'],
          },
          'content/posts/leading.en.md',
          (message) => warnings.push(message),
          true,
        ),
      /Invalid content slugs/,
    );
    assert.equal(warnings.length, 1);
    assert.match(
      warnings[0],
      /content\/posts\/leading\.en\.md.*-invalid.*starting with a letter or digit/,
    );
  }
});

test('internal configuration validation retains locale, pagination, and width checks', async () => {
  const { validateConfig } = await import('../src/lib/validate-config.ts');
  const { default: config } = await import('../blog.config.ts');
  assert.doesNotThrow(() => validateConfig(config));
  for (const mutate of [
    (c) => {
      c.site.locales = ['en'];
    },
    (c) => {
      c.posts.perPage = 0;
    },
    (c) => {
      c.sidebar.width.default = 1000;
    },
  ]) {
    const invalid = structuredClone(config);
    mutate(invalid);
    assert.throws(() => validateConfig(invalid));
  }
  const { introPageSlug } = await import('../src/lib/intro-config.ts');
  assert.equal(introPageSlug(config, 'categories'), 'categories');
  assert.equal(
    introPageSlug(
      { ...config, sidebar: { ...config.sidebar, items: [], menu: [] } },
      'categories',
    ),
    undefined,
  );
});
