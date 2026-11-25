import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  cp,
  mkdtemp,
  mkdir,
  readFile,
  writeFile,
  rm,
  access,
} from 'node:fs/promises';
import { spawn, spawnSync } from 'node:child_process';
import path from 'node:path';

test(
  'production routes retain hidden translations while every discovery entry uses the selected version',
  { timeout: 240000 },
  async (t) => {
    const workspace = process.cwd();
    const temporary = path.join(workspace, '.astro');
    await mkdir(temporary, { recursive: true });
    const root = await mkdtemp(path.join(temporary, 'visibility-test-'));
    t.after(async () => {
      assert.equal(path.dirname(root), temporary);
      await rm(root, { recursive: true, force: true });
    });
    for (const file of [
      'src',
      'content',
      'custom',
      'public',
      'scripts',
      'astro.config.ts',
      'blog.config.ts',
      'friends.config.ts',
      'tsconfig.json',
      'package.json',
    ])
      await cp(path.join(workspace, file), path.join(root, file), {
        recursive: true,
      });
    const config = (
      await readFile(path.join(root, 'blog.config.ts'), 'utf8')
    ).replace(
      'export default config;',
      `config.site.localePrefixPolicy = 'omit-default-prefix';
config.posts.pathPrefix = '[year]/';
config.site.locales.push('en-US-u-nu-latn');
config.article.shareCover.enabled = false;
export default config;`,
    );
    await writeFile(path.join(root, 'blog.config.ts'), config);
    for (const slug of ['search', '404'])
      await writeFile(
        path.join(root, `content/posts/review-sitemap-${slug}.en.md`),
        `---\ntitle: Sitemap ${slug}\nslug: '${slug}'\ndate: 2026-01-01\ncategories: ['${slug}']\ntags: ['${slug}', '${slug}']\n---\nPublic content.\n`,
      );
    const bundle = path.join(root, 'content/posts/test-visibility');
    await mkdir(bundle);
    const hidden =
      '---\ntitle: TEST-HIDDEN-EN\nslug: test-visibility\ndate: 2026-01-01\nhidden: true\ntags: [visibility-check]\n---\nHidden English body.\n';
    await writeFile(path.join(bundle, 'index.en.md'), hidden);
    await writeFile(
      path.join(bundle, 'index.zh.md'),
      '---\ntitle: TEST-PUBLIC-ZH\nslug: test-visibility\ndate: 2026-10-20\nimage: " https://cdn.example.test/visibility-cover.webp "\ntags: [visibility-check]\n---\n[Invalid sibling](../missing-article/)\n',
    );
    // Japanese has no UI pack and is disabled, but remains part of this family.
    await writeFile(
      path.join(bundle, 'index.ja.md'),
      '---\ntitle: TEST-DISABLED-JA\nslug: test-visibility\ndate: 2026-01-01\n---\nDisabled Japanese body.\n',
    );
    await writeFile(path.join(bundle, 'download.txt'), 'Published attachment');
    const datedBundle = path.join(root, 'content/posts/review-dates');
    await mkdir(datedBundle);
    await writeFile(
      path.join(datedBundle, 'index.en.md'),
      '\n---\ndefaults: &defaults\n  slug: review-dates\n  date: 2025-12-31T16:30:00Z\n<<: *defaults\ntitle: TEST-DATE-BOUNDARIES\n--- \t\nBody.\n',
    );
    await writeFile(
      path.join(datedBundle, 'download.txt'),
      'Date boundary attachment',
    );
    await writeFile(
      path.join(root, 'content/pages/review-dates.en.mdx'),
      '--- \t\ntitle: TEST-MDX-DATE-BOUNDARIES\nslug: review-dates\ndate: 2026-01-01\n--- \t\nBody.\n',
    );
    for (const kind of ['posts', 'pages', 'categories', 'tags']) {
      const draft = path.join(root, `content/${kind}/review-merged-draft`);
      await mkdir(draft);
      await writeFile(
        path.join(draft, 'index.en.md'),
        '---\ndefaults: &defaults\n  draft: true\n<<: *defaults\ntitle: Merged draft\nslug: review-merged-draft\ndate: 2026-01-01\n---\n',
      );
      await writeFile(
        path.join(draft, 'private.txt'),
        'Unpublished attachment',
      );
    }
    await writeFile(
      path.join(root, 'content/posts/only-hidden.en.md'),
      '---\ntitle: TEST-ONLY-HIDDEN\nslug: only-hidden\ndate: 2026-01-01\nhidden: true\ncategories: [guide, only-hidden-category]\ntags: [astro, only-hidden-tag]\n---\nPrivate listing example.\n',
    );
    await writeFile(
      path.join(root, 'content/categories/only-hidden.en.md'),
      '---\ntitle: TEST-ONLY-HIDDEN-CATEGORY\nslug: only-hidden-category\nimage: " https://cdn.example.test/taxonomy-cover.webp "\n---\nCategory introduction.\n',
    );
    await writeFile(
      path.join(root, 'content/categories/unused.en.md'),
      '---\ntitle: TEST-UNUSED-CATEGORY\nslug: unused-category\nimage: " https://cdn.example.test/public-taxonomy-cover.webp "\n---\nUnused definition.\n',
    );
    for (const kind of ['categories', 'tags'])
      for (const state of ['unused', 'referenced']) {
        const slug = `hidden-${kind}-${state}`;
        const directory = path.join(root, 'content', kind, slug);
        await mkdir(directory);
        for (const locale of ['en', 'zh'])
          await writeFile(
            path.join(directory, `index.${locale}.md`),
            `---\ntitle: ${slug}\nslug: ${slug}\nhidden: ${locale === 'en'}\n---\nDefinition.\n`,
          );
        await writeFile(
          path.join(directory, 'download.txt'),
          'Hidden definition attachment',
        );
      }
    await writeFile(
      path.join(root, 'content/posts/review-hidden-terms.en.md'),
      '---\ntitle: TEST-PUBLIC-HIDDEN-TERMS\nslug: review-hidden-terms\ndate: 2026-01-01\ncategories: [hidden-categories-referenced]\ntags: [hidden-tags-referenced]\n---\nPublic article.\n',
    );
    for (const [status, field] of [
      ['draft', 'draft: true\ndate: 2026-01-01'],
      ['future', 'date: 2099-01-01'],
    ])
      await writeFile(
        path.join(root, `content/posts/only-${status}.en.md`),
        `---\ntitle: TEST-${status}\nslug: only-${status}\n${field}\ntags: [only-${status}-tag]\n---\nUnpublished.\n`,
      );
    const build = () =>
      new Promise((resolve, reject) => {
        const child = spawn(
          process.execPath,
          [path.join(workspace, 'node_modules/astro/bin/astro.mjs'), 'build'],
          {
            cwd: root,
            windowsHide: true,
            stdio: ['ignore', 'pipe', 'pipe'],
          },
        );
        let output = '';
        child.stdout.on('data', (chunk) => {
          output += chunk;
        });
        child.stderr.on('data', (chunk) => {
          output += chunk;
        });
        child.on('error', reject);
        child.on('close', (code) => resolve({ code, output }));
      });
    const result = await build();
    assert.equal(result.code, 0, result.output);
    assert.match(
      result.output,
      /Invalid relative URL in \/posts\/2026\/test-visibility\/.*missing-article/,
    );
    const indexed = spawnSync(
      process.execPath,
      [path.join(root, 'scripts/build-search.mjs')],
      { cwd: root, encoding: 'utf8', windowsHide: true },
    );
    assert.equal(indexed.status, 0, indexed.stdout + indexed.stderr);
    const output = (file) => readFile(path.join(root, 'dist', file), 'utf8');
    const assertSitemap = async (base = '', policy = 'omit-default-prefix') => {
      const sitemap = await output('sitemap-0.xml');
      for (const locale of ['zh', 'en', 'en-US-u-nu-latn']) {
        const prefix =
          policy === 'omit-default-prefix' && locale === 'zh'
            ? base
            : `${base}${locale}/`;
        for (const slug of ['search', '404'])
          for (const kind of ['posts/2026', 'categories', 'tags']) {
            const route = `${prefix}${kind}/${slug}/`;
            await access(
              path.join(root, 'dist', route.slice(base.length), 'index.html'),
            );
            assert.ok(
              sitemap.includes(`<loc>https://example.com/${route}</loc>`),
              route,
            );
            const html = await output(`${route.slice(base.length)}index.html`);
            if (kind === 'tags') {
              assert.equal(
                (html.match(/class="post-row(?:\s|")/g) ?? []).length,
                1,
                route,
              );
              assert.match(html, /class="taxonomy-count">\s*1\s/);
            } else if (kind === 'posts/2026')
              assert.equal((html.match(/class="tag"/g) ?? []).length, 1, route);
          }
        assert.ok(
          !sitemap.includes(`<loc>https://example.com/${prefix}search/</loc>`),
        );
      }
      assert.ok(
        !sitemap.includes(`<loc>https://example.com/${base}404/</loc>`),
      );
    };
    await assertSitemap();
    assert.match(
      await output('en/posts/2026/review-dates/index.html'),
      /TEST-DATE-BOUNDARIES/,
    );
    assert.match(
      await output('en/review-dates/index.html'),
      /TEST-MDX-DATE-BOUNDARIES/,
    );
    await access(
      path.join(root, 'dist/en/posts/2026/review-dates/download.txt'),
    );
    for (const kind of ['posts', 'pages', 'categories', 'tags'])
      for (const prefix of ['', 'en/', 'en-US-u-nu-latn/']) {
        const route = `${prefix}${kind === 'pages' ? '' : `${kind}/`}${kind === 'posts' ? '2026/' : ''}review-merged-draft`;
        await assert.rejects(
          access(path.join(root, `dist/${route}/index.html`)),
        );
        await assert.rejects(
          access(path.join(root, `dist/${route}/private.txt`)),
        );
      }
    await assert.rejects(access(path.join(root, 'dist/ja')));
    const en = await output('en/posts/2026/test-visibility/index.html');
    assert.match(en, /TEST-HIDDEN-EN/);
    assert.match(en, /noindex,nofollow/);
    assert.doesNotMatch(en, /data-search-record="posts"/);
    await access(
      path.join(root, 'dist/en/posts/2026/test-visibility/download.txt'),
    );
    const zh = await output('posts/2026/test-visibility/index.html');
    assert.match(zh, /data-search-record="posts"/);
    assert.doesNotMatch(en + zh, /TEST-DISABLED-JA/);
    assert.match(zh, /href="\/posts\/2026\/missing-article\/"/);
    assert.match(await output('posts/index.html'), /TEST-PUBLIC-ZH/);
    assert.match(
      await output('posts/index.html'),
      /src="https:\/\/cdn\.example\.test\/visibility-cover\.webp"/,
    );
    assert.match(
      zh,
      /src="https:\/\/cdn\.example\.test\/visibility-cover\.webp"|src=" https:\/\/cdn\.example\.test\/visibility-cover\.webp "/,
    );
    const { searchRecords } = await import('../scripts/lib/search-records.mjs');
    for (const kind of ['categories', 'tags'])
      for (const state of ['unused', 'referenced']) {
        const slug = `hidden-${kind}-${state}`;
        const hidden = await output(`en/${kind}/${slug}/index.html`);
        assert.match(hidden, /noindex,nofollow/);
        assert.deepEqual(searchRecords(hidden), []);
        assert.equal(/class="post-row/.test(hidden), state === 'referenced');
        assert.doesNotMatch(
          await output(`en/${kind}/index.html`),
          new RegExp(slug),
        );
        assert.doesNotMatch(
          await output('en/categories/index.html'),
          new RegExp(slug),
        );
        assert.equal(
          await output(`en/${kind}/${slug}/download.txt`),
          'Hidden definition attachment',
        );
        assert.doesNotMatch(
          await output('sitemap-0.xml'),
          new RegExp(`/en/${kind}/${slug}/`),
        );
        // The same family is public in Chinese; English hidden must not affect it.
        const visible = await output(`${kind}/${slug}/index.html`);
        assert.doesNotMatch(visible, /noindex,nofollow/);
        assert.equal(searchRecords(visible)[0].kind, kind);
        assert.match(await output(`${kind}/index.html`), new RegExp(slug));
      }
    for (const [kind, slug] of [
      ['categories', 'only-hidden-category'],
      ['tags', 'only-hidden-tag'],
      ['tags', 'visibility-check'],
    ]) {
      const html = await output(`en/${kind}/${slug}/index.html`);
      assert.match(html, /noindex,nofollow/);
      assert.doesNotMatch(html, /class="post-row/);
      assert.deepEqual(searchRecords(html), []);
      assert.doesNotMatch(
        await output(`en/${kind}/index.html`),
        new RegExp(slug),
      );
      assert.doesNotMatch(
        await output('en/categories/index.html'),
        new RegExp(slug),
      );
    }
    assert.match(await output('categories/index.html'), /TEST-UNUSED-CATEGORY/);
    assert.match(
      await output('categories/index.html'),
      /src="https:\/\/cdn\.example\.test\/public-taxonomy-cover\.webp"/,
    );
    assert.match(
      await output('en/categories/only-hidden-category/index.html'),
      /src="https:\/\/cdn\.example\.test\/taxonomy-cover\.webp"/,
    );
    assert.match(
      await output('tags/visibility-check/index.html'),
      /TEST-PUBLIC-ZH/,
    );
    for (const [kind, slug] of [
      ['categories', 'guide'],
      ['tags', 'astro'],
    ]) {
      const html = await output(`en/${kind}/${slug}/index.html`);
      assert.match(html, /class="post-row/);
      assert.doesNotMatch(html, /TEST-ONLY-HIDDEN/);
    }
    for (const status of ['draft', 'future'])
      await assert.rejects(
        access(path.join(root, `dist/en/tags/only-${status}-tag/index.html`)),
      );
    // Check all English generated HTML, including pagination, sidebar, taxonomy,
    // completion, random candidates and statistics, for accidental fallback links.
    const { readdir } = await import('node:fs/promises');
    for (const file of await readdir(path.join(root, 'dist/en'), {
      recursive: true,
    })) {
      const normalized = file.replaceAll('\\', '/');
      if (
        !normalized.endsWith('.html') ||
        normalized === 'posts/2026/test-visibility/index.html'
      )
        continue;
      const html = await output(`en/${file}`);
      assert.doesNotMatch(
        html,
        /TEST-HIDDEN-EN|TEST-PUBLIC-ZH|\/en\/posts\/2026\/test-visibility\//,
        normalized,
      );
    }
    assert.doesNotMatch(await output('en/rss.xml'), /test-visibility/);
    const regional = await output(
      'en-US-u-nu-latn/posts/2026/test-visibility/index.html',
    );
    assert.match(regional, /lang="en-US-u-nu-latn"/);
    // Rebuilds also validate raw scalar types, including cached/inactive aliases.
    for (const [file, fields, field, value, prefix = '', close = '---'] of [
      [
        'posts/test-visibility/index.en.md',
        'date: 1767225600000',
        'date',
        '1767225600000',
      ],
      [
        'pages/review-date.ja.mdx',
        'date: 2026-01-01\npublished: false',
        'published',
        'false',
      ],
      ['pages/review-date.md', 'updated: null', 'updated', 'null'],
      [
        'posts/review-date.ja.mdx',
        'date: 2099-01-01\nlastmod: not-a-date',
        'lastmod',
        'not-a-date',
      ],
      [
        'tags/review-date.en.md',
        'updated: false',
        'updated',
        'false',
        '\n',
        '--- \t',
      ],
      [
        'categories/review-date.ja.mdx',
        'lastmod: null',
        'lastmod',
        'null',
        '',
        '--- \t',
      ],
      [
        'tags/review-merged-date.en.md',
        'defaults: &defaults\n  updated: false\n<<: *defaults',
        'updated',
        'false',
      ],
      [
        'posts/review-merged-date.ja.mdx',
        'defaults: &defaults\n  date: 1767225600000\n<<: *defaults',
        'date',
        '1767225600000',
      ],
    ]) {
      const source = path.join(root, 'content', file);
      await writeFile(
        source,
        `${prefix}---\ntitle: Date validation\nslug: ${file.includes('test-visibility') ? 'test-visibility' : 'review-date'}\ndraft: true\nhidden: true\n${fields}\n${close}\n`,
      );
      const invalidDate = await build();
      assert.notEqual(invalidDate.code, 0, invalidDate.output);
      assert.ok(invalidDate.output.includes('[WARN]'), invalidDate.output);
      assert.ok(
        invalidDate.output.includes(`Invalid ${field} in content/${file}:`),
        invalidDate.output,
      );
      assert.ok(invalidDate.output.includes(value), invalidDate.output);
      assert.doesNotMatch(invalidDate.output, /RangeError|Invalid time value/);
      if (file.includes('test-visibility')) await writeFile(source, hidden);
      else await rm(source);
    }
    // Invalid slugs must fail even though the differing translation is hidden.
    await writeFile(
      path.join(bundle, 'index.en.md'),
      hidden.replace('slug: test-visibility', 'slug: different'),
    );
    const invalid = await build();
    assert.notEqual(invalid.code, 0);
    assert.match(invalid.output, /Content translations must use the same slug/);
    await writeFile(
      path.join(bundle, 'index.en.md'),
      hidden.replace('slug: test-visibility', 'slug: review%25'),
    );
    const invalidSlug = await build();
    assert.notEqual(invalidSlug.code, 0);
    assert.match(
      invalidSlug.output,
      /Invalid slug in content\/posts\/test-visibility\/index\.en\.md.*review%25.*ASCII letters/,
    );
    assert.doesNotMatch(invalidSlug.output, /NoMatchingStaticPathFound/);
    await writeFile(
      path.join(bundle, 'index.en.md'),
      hidden.replace('slug: test-visibility', 'slug: ReviewCase'),
    );
    const uppercase = await build();
    assert.notEqual(uppercase.code, 0);
    assert.match(
      uppercase.output,
      /Invalid slug in content\/posts\/test-visibility\/index\.en\.md.*ReviewCase.*lowercase ASCII letters/,
    );
    await writeFile(path.join(bundle, 'index.en.md'), hidden);
    const leadingSlug = path.join(root, 'content/pages/review-leading.ja.mdx');
    await writeFile(
      leadingSlug,
      '---\ntitle: Invalid slug\nslug: -review\ndraft: true\nhidden: true\n---\n',
    );
    const leading = await build();
    assert.notEqual(leading.code, 0, leading.output);
    assert.match(
      leading.output,
      /\[WARN\][^\n]*Invalid slug in content\/pages\/review-leading\.ja\.mdx.*-review.*starting with a letter or digit/,
    );
    await rm(leadingSlug);
    // The same rule applies before draft/hidden/disabled-language filtering in all collections.
    for (const kind of ['pages', 'posts', 'categories', 'tags']) {
      const first = path.join(root, `content/${kind}/review-matching.en.md`);
      const second = path.join(root, `content/${kind}/review-matching.ja.mdx`);
      await writeFile(
        first,
        '---\ntitle: English\nslug: review-matching\ndate: 2026-01-01\n---\n',
      );
      await writeFile(
        second,
        '---\ntitle: Disabled draft\nslug: different-slug\ndate: 2099-01-01\ndraft: true\nhidden: true\n---\n',
      );
      const mismatch = await build();
      assert.notEqual(mismatch.code, 0, kind);
      assert.match(
        mismatch.output,
        /\[WARN\][^\n]*Content translations must use the same slug/,
      );
      assert.ok(
        mismatch.output.includes(`content/${kind}/review-matching.en.md`),
      );
      assert.ok(
        mismatch.output.includes(`content/${kind}/review-matching.ja.mdx`),
      );
      await rm(first);
      await rm(second);
    }
    // Standalone 404 pages must fail explicitly before Astro drops the route.
    await writeFile(
      path.join(root, 'content/pages/review-404.zh.md'),
      "---\ntitle: Reserved page\nslug: '404'\nhidden: true\n---\n",
    );
    for (const policy of [
      'omit-default-prefix',
      'redirect-to-default',
      'require-prefix',
    ]) {
      await writeFile(
        path.join(root, 'blog.config.ts'),
        config.replace("'omit-default-prefix'", `'${policy}'`),
      );
      const reserved = await build();
      assert.notEqual(reserved.code, 0, reserved.output);
      assert.match(reserved.output, /Reserved page slug: 404/);
      assert.match(reserved.output, /review-404/);
      assert.doesNotMatch(reserved.output, /Could not render \/404/);
    }
    await rm(path.join(root, 'content/pages/review-404.zh.md'));
    // Exercise the same names with prefixed locales and a deployment subdirectory.
    await writeFile(
      path.join(root, 'blog.config.ts'),
      config
        .replace("'omit-default-prefix'", "'redirect-to-default'")
        .replace(
          'export default config;',
          "config.site.baseUrl = 'https://example.com/blog/';\nexport default config;",
        ),
    );
    const subdirectory = await build();
    assert.equal(subdirectory.code, 0, subdirectory.output);
    await assertSitemap('blog/', 'redirect-to-default');
  },
);
