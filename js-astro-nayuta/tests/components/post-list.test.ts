import { afterAll, beforeAll, expect, test } from 'bun:test';
import { cp, mkdtemp, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { openChromium } from '../fixtures/chromium';
import {
  getQueryPageUrl,
  getVisiblePages,
  normalizePageNumber,
} from '../../src/assets/utils/pagination';

const repositoryRoot = join(import.meta.dir, '../..');
const chrome =
  process.env.CHROME_BIN ??
  Bun.which('chromium') ??
  Bun.which('google-chrome') ??
  ((await Bun.file(
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ).exists())
    ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    : undefined);
let fixtureRoot: string;
let server: ReturnType<typeof Bun.serve>;

beforeAll(async () => {
  fixtureRoot = await mkdtemp(join(tmpdir(), 'nayuta-post-list-'));
  await Promise.all(
    ['src', 'astro.config.ts', 'package.json', 'tsconfig.json'].map((path) =>
      cp(join(repositoryRoot, path), join(fixtureRoot, path), {
        recursive: true,
      }),
    ),
  );
  await symlink(
    join(repositoryRoot, 'node_modules'),
    join(fixtureRoot, 'node_modules'),
    'dir',
  );
  await Promise.all(
    ['posts', 'pages'].map((directory) =>
      rm(join(fixtureRoot, 'src/content', directory), { recursive: true }),
    ),
  );
  for (const [id, title, publishDate, cover, draft] of [
    [
      'first',
      '<script>Plain title</script> 中文',
      '2026-02-01',
      '/cover.svg',
      false,
    ],
    ['second', 'Second article', '2026-01-01', './local.svg', false],
    ['draft', 'Hidden draft fixture', '2026-03-01', '/cover.svg', true],
  ] as const) {
    await Bun.write(
      join(fixtureRoot, 'src/content/posts', `${id}.md`),
      `---\n${JSON.stringify({ title, publishDate, cover, draft, description: 'A readable summary for both renderers.' })}\n---\n\nArticle body.\n`,
    );
  }
  const cover =
    '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360"><rect width="640" height="360" fill="#3890c8"/><circle cx="320" cy="180" r="100" fill="#abb5c4"/></svg>';
  await Bun.write(join(fixtureRoot, 'public/cover.svg'), cover);
  await Bun.write(join(fixtureRoot, 'src/content/posts/local.svg'), cover);
  await cp(
    join(import.meta.dir, '../fixtures/post-list.astro'),
    join(fixtureRoot, 'src/pages/post-list-test.astro'),
  );
  // Keep browser fixtures offline, including fonts and icon styles from the site head.
  const globalPath = join(fixtureRoot, 'src/assets/styles/global.css');
  await Bun.write(
    globalPath,
    (await Bun.file(globalPath).text()).replace(/^@import url\([^\n]+;$/gm, ''),
  );
  const headPath = join(fixtureRoot, 'src/layouts/head-base.astro');
  await Bun.write(
    headPath,
    (await Bun.file(headPath).text()).replace(
      /<link\s[^>]*href="https:[\s\S]*?\/>/g,
      '',
    ),
  );
  const build = Bun.spawn(['bun', 'run', 'build'], {
    cwd: fixtureRoot,
    stdout: 'pipe',
    stderr: 'pipe',
  });
  const [code, stdout, stderr] = await Promise.all([
    build.exited,
    new Response(build.stdout).text(),
    new Response(build.stderr).text(),
  ]);
  expect(code, stdout + stderr).toBe(0);
  server = Bun.serve({
    hostname: '127.0.0.1',
    port: 0,
    async fetch(request) {
      const pathname = decodeURIComponent(new URL(request.url).pathname);
      const file = Bun.file(
        join(
          fixtureRoot,
          'dist',
          pathname.endsWith('/') ? `${pathname}index.html` : pathname,
        ),
      );
      return (await file.exists())
        ? new Response(file)
        : new Response('Not found', { status: 404 });
    },
  });
}, 60_000);

afterAll(async () => {
  server?.stop(true);
  if (fixtureRoot) await rm(fixtureRoot, { recursive: true, force: true });
});

test('query pagination preserves search, repeated parameters, Unicode and hash', () => {
  const url = new URL(
    getQueryPageUrl('/search?q=中文&tag=Astro&tag=CSS&page=9#results', 2),
    'https://example.test',
  );
  expect(url.pathname).toBe('/search');
  expect(url.searchParams.get('q')).toBe('中文');
  expect(url.searchParams.getAll('tag')).toEqual(['Astro', 'CSS']);
  expect(url.searchParams.getAll('page')).toEqual(['2']);
  expect(url.hash).toBe('#results');
  expect(getQueryPageUrl('/search?q=Astro', 1)).toBe('/search?q=Astro&page=1');
});

test('dynamic pagination normalizes invalid inputs and bounds controls', () => {
  for (const value of [
    0,
    -1,
    1.5,
    NaN,
    Infinity,
    Number.MAX_SAFE_INTEGER + 1,
  ]) {
    expect(normalizePageNumber(value, 5)).toBe(1);
  }
  expect(normalizePageNumber(99, 5)).toBe(5);
  expect(normalizePageNumber(1, 0)).toBe(1);
  expect(getVisiblePages(5000, 10000)).toEqual([1, 4999, 5000, 5001, 10000]);
});

test('build preserves static content, local images and a no-JavaScript search fallback', async () => {
  const html = await Bun.file(
    join(fixtureRoot, 'dist/post-list-test/index.html'),
  ).text();
  expect(html).toContain('data-mode="static"');
  expect(html).toContain('data-mode="dynamic"');
  expect(html).toContain('data-post-template');
  expect(html).toContain('Search requires JavaScript.');
  expect(html).toContain('Browse all posts.');
  expect(html).toContain('/_astro/local.');
  expect(html).not.toContain('Hidden draft fixture');
  expect(
    await Bun.file(join(fixtureRoot, 'dist/posts/draft/index.html')).exists(),
  ).toBe(false);
});

for (const width of [390, 800, 1280]) {
  for (const theme of ['light', 'dark']) {
    test.skipIf(!chrome)(
      `browser: incremental updates and shared styles at ${width}px in ${theme} theme`,
      async () => {
        const profile = await mkdtemp(join(fixtureRoot, 'chrome-'));
        const browser = await openChromium(chrome!, profile);
        try {
          await browser.send('Emulation.setDeviceMetricsOverride', {
            width,
            height: 900,
            deviceScaleFactor: 1,
            mobile: false,
          });
          await browser.send('Page.enable');
          await browser.send('Page.navigate', {
            url: `${server.url}post-list-test/?q=Astro%20%E4%B8%AD%E6%96%87&page=2&theme=${theme}`,
          });
          let result: { status?: string; text?: string } = {};
          for (let attempt = 0; attempt < 100; attempt++) {
            const evaluation = await browser.send('Runtime.evaluate', {
              expression: `({ status: document.querySelector('#test-result')?.dataset.testResult, text: document.querySelector('#test-result')?.textContent })`,
              returnByValue: true,
            });
            result = evaluation.result.value ?? {};
            if (result.status) break;
            await Bun.sleep(50);
          }
          expect(result.status, result.text).toBe('passed');
          if (process.env.NAYUTA_TEST_ARTIFACTS) {
            await browser.send('Page.navigate', {
              url: `${server.url}post-list-test/?page=2&theme=${theme}&visual=1`,
            });
            await Bun.sleep(200);
            for (let attempt = 0; attempt < 100; attempt++) {
              const ready = await browser.send('Runtime.evaluate', {
                expression: `document.querySelector('#test-result')?.dataset.testResult`,
                returnByValue: true,
              });
              if (ready.result.value === 'passed') break;
              await Bun.sleep(50);
            }
            const { cssContentSize } = await browser.send(
              'Page.getLayoutMetrics',
            );
            const { data } = await browser.send('Page.captureScreenshot', {
              format: 'png',
              captureBeyondViewport: true,
              clip: {
                x: 0,
                y: 0,
                width,
                height: cssContentSize.height,
                scale: 1,
              },
            });
            await Bun.write(
              join(process.env.NAYUTA_TEST_ARTIFACTS, `${width}-${theme}.png`),
              Buffer.from(data, 'base64'),
            );
          }
        } finally {
          await browser.close();
        }
      },
      30_000,
    );
  }
}
