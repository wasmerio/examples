import { afterAll, beforeAll, expect, test } from 'bun:test';
import { cp, mkdtemp, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { openChromium } from '../fixtures/chromium';

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
const fixtures: {
  root: string;
  server: ReturnType<typeof Bun.serve>;
  control: ServerControl;
}[] = [];
const temporaryRoots: string[] = [];

type Browser = Awaited<ReturnType<typeof openChromium>>;
interface ServerControl {
  failIndex: boolean;
  failFragments: boolean;
  indexRequests: number;
  fragmentRequests: Set<string>;
}

async function build(root: string) {
  const child = Bun.spawn(['bun', 'run', '--bun', 'build'], {
    cwd: root,
    stdout: 'pipe',
    stderr: 'pipe',
  });
  const [code, stdout, stderr] = await Promise.all([
    child.exited,
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
  ]);
  return { code, output: stdout + stderr };
}

async function prepare() {
  const root = await mkdtemp(join(tmpdir(), 'nayuta-search-'));
  temporaryRoots.push(root);
  await Promise.all(
    ['src', 'astro.config.ts', 'package.json', 'tsconfig.json'].map((path) =>
      cp(join(repositoryRoot, path), join(root, path), { recursive: true }),
    ),
  );
  await symlink(
    join(repositoryRoot, 'node_modules'),
    join(root, 'node_modules'),
    'dir',
  );
  await rm(join(root, 'src/content'), { recursive: true });
  await Bun.write(
    join(root, 'src/content/_left.astro'),
    `---\nimport SearchWidget from '@widgets/sidebar/SearchWidget.astro';\n---\n<SearchWidget />`,
  );
  const configPath = join(root, 'src/config.ts');
  await Bun.write(
    configPath,
    (await Bun.file(configPath).text()).replace(
      /postsPerPage: \d+/,
      'postsPerPage: 5',
    ),
  );
  await Bun.write(
    join(root, 'src/content/index.md'),
    '---\ntitle: Fixture home\n---\n\nFixture home.\n',
  );
  const globalPath = join(root, 'src/assets/styles/global.css');
  await Bun.write(
    globalPath,
    (await Bun.file(globalPath).text()).replace(/^@import url\([^\n]+;$/gm, ''),
  );
  const headPath = join(root, 'src/layouts/head-base.astro');
  await Bun.write(
    headPath,
    (await Bun.file(headPath).text()).replace(
      /<link\s[^>]*href="https:[\s\S]*?\/>/g,
      '',
    ),
  );
  for (let number = 1; number <= 12; number++) {
    const content = [
      'batchneedle',
      number <= 4 ? 'fourneedle' : '',
      number <= 5 ? 'fiveneedle' : '',
      number <= 6 ? 'sixneedle encodeneedle 中文 & Astro + CSS' : '',
    ]
      .filter(Boolean)
      .join(' ');
    await Bun.write(
      join(root, 'src/content/posts', `article-${number}.md`),
      `---\n${JSON.stringify({ title: `Fixture article ${number}`, publishDate: '2026-01-01' })}\n---\n\n${content}.\n`,
    );
  }
  await Bun.write(
    join(root, 'src/content/posts/draft.md'),
    '---\ntitle: Draft hidden article\npublishDate: "2026-01-01"\ndraft: true\n---\n\nbatchneedle sixneedle.\n',
  );
  await Bun.write(
    join(root, 'src/content/posts/excluded.md'),
    '---\ntitle: Excluded published article\npublishDate: "2026-01-01"\ntags: [ExcludedFromSearch]\nexclude_in_search: true\n---\n\nbatchneedle excludedneedle.\n',
  );
  return root;
}

async function fixture(excludeAll = false) {
  const root = await prepare();
  if (excludeAll) {
    await rm(join(root, 'src/content/posts'), { recursive: true });
    await Bun.write(
      join(root, 'src/content/posts/excluded.md'),
      '---\ntitle: Excluded article\npublishDate: "2026-01-01"\nexclude_in_search: true\n---\n\nexcludedneedle.',
    );
  }
  const result = await build(root);
  expect(result.code, result.output).toBe(0);
  const control: ServerControl = {
    failIndex: false,
    failFragments: false,
    indexRequests: 0,
    fragmentRequests: new Set(),
  };
  const server = Bun.serve({
    hostname: '127.0.0.1',
    port: 0,
    async fetch(request) {
      const pathname = decodeURIComponent(new URL(request.url).pathname);
      if (pathname.startsWith('/pagefind/')) {
        control.indexRequests++;
        if (pathname.includes('/fragment/'))
          control.fragmentRequests.add(pathname);
        if (control.failIndex)
          return new Response('Unavailable', { status: 503 });
        if (control.failFragments && pathname.includes('/fragment/'))
          return new Response('Unavailable', { status: 503 });
      }
      const file = Bun.file(join(root, 'dist', pathname));
      if (await file.exists()) return new Response(file);
      const index = Bun.file(join(root, 'dist', pathname, 'index.html'));
      return (await index.exists())
        ? new Response(index)
        : new Response('Not found', { status: 404 });
    },
  });
  const ready = { root, server, control };
  fixtures.push(ready);
  return ready;
}

function url(server: ReturnType<typeof Bun.serve>, path: string) {
  return new URL(path, server.url).href;
}

async function evaluate<T>(browser: Browser, expression: string): Promise<T> {
  const result = await browser.send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value as T;
}

async function until<T>(
  browser: Browser,
  expression: string,
  predicate: (value: T) => boolean,
) {
  let value: T | undefined;
  for (let attempt = 0; attempt < 200; attempt++) {
    value = await evaluate<T>(browser, expression);
    if (predicate(value)) return value;
    await Bun.sleep(50);
  }
  throw new Error(
    `Timed out waiting for ${expression}; last value: ${JSON.stringify(value)}`,
  );
}

async function navigate(
  browser: Browser,
  server: ReturnType<typeof Bun.serve>,
  path: string,
) {
  await browser.send('Page.navigate', { url: url(server, path) });
  await until(
    browser,
    `location.pathname === ${JSON.stringify(new URL(path, server.url).pathname)} && document.readyState === 'complete'`,
    Boolean,
  );
}

async function session(run: (browser: Browser) => Promise<void>, root: string) {
  const profile = await mkdtemp(join(root, 'chrome-'));
  const browser = await openChromium(chrome!, profile);
  try {
    await browser.send('Page.enable');
    await run(browser);
  } finally {
    await browser.close();
  }
}

async function input(browser: Browser, selector: string, value: string) {
  await evaluate(
    browser,
    `(() => { const field = document.querySelector(${JSON.stringify(selector)}); field.value = ${JSON.stringify(value)}; field.dispatchEvent(new Event('input', { bubbles: true })); })()`,
  );
}

async function submit(browser: Browser, selector: string) {
  await evaluate(
    browser,
    `document.querySelector(${JSON.stringify(selector)}).requestSubmit()`,
  );
}

const pageState = `(() => {
  const root = document.querySelector('nayuta-search-page');
  return root && {
    count: root.querySelectorAll('.post-summary').length,
    links: [...root.querySelectorAll('.post-title a')].map(a => new URL(a.href).pathname),
    metadata: [...root.querySelectorAll('.post-meta')].map(n => n.textContent),
    status: root.querySelector('.post-status').textContent,
    fallback: !root.querySelector('[data-search-fallback]').hidden,
    busy: root.querySelector('.post-list').getAttribute('aria-busy')
  };
})()`;
type SearchState = {
  count: number;
  links: string[];
  status: string;
  metadata: string[];
  fallback: boolean;
  busy?: string;
};

let defaults: Awaited<ReturnType<typeof fixture>>;
beforeAll(async () => {
  defaults = await fixture();
}, 120_000);

afterAll(async () => {
  for (const { server } of fixtures) {
    server.stop(true);
  }
  await Promise.all(
    temporaryRoots.map((root) => rm(root, { recursive: true, force: true })),
  );
});

test.skipIf(!chrome)(
  'sidebar search navigates with encoded query and never previews results',
  async () => {
    await session(async (browser) => {
      defaults.control.indexRequests = 0;
      await navigate(browser, defaults.server, '/');
      const encoded = 'encodeneedle 中文 & Astro + CSS';
      await input(browser, '#left-sidebar .search-form input', encoded);
      expect(defaults.control.indexRequests).toBe(0);
      expect(
        await evaluate<number>(
          browser,
          `document.querySelectorAll('#left-sidebar .search-results, #left-sidebar .search-more, #left-sidebar .widget-header a').length`,
        ),
      ).toBe(0);
      await submit(browser, '#left-sidebar .search-form');
      const result = await until<SearchState>(
        browser,
        pageState,
        (value) => value?.status === '6 results. Page 1 of 2.',
      );
      expect(result.count).toBe(5);
      expect(
        new URL(
          await evaluate<string>(browser, 'location.href'),
        ).searchParams.get('q'),
      ).toBe(encoded);
      expect(
        await evaluate<string[]>(
          browser,
          `[...document.querySelectorAll('.breadcrumbs a[href^="/search"]')].map(a => a.textContent)`,
        ),
      ).toEqual([`Search: ${encoded}`, `Search: ${encoded}`]);

      await navigate(browser, defaults.server, '/');
      await input(
        browser,
        '#left-sidebar .search-form input',
        '  fourneedle  ',
      );
      await submit(browser, '#left-sidebar .search-form');
      const clicked = await until<SearchState>(
        browser,
        pageState,
        (value) => value?.status === '4 results. Page 1 of 1.',
      );
      expect(clicked.count).toBe(4);
      expect(
        new URL(
          await evaluate<string>(browser, 'location.href'),
        ).searchParams.get('q'),
      ).toBe('  fourneedle  ');
    }, defaults.root);
  },
  30_000,
);

test.skipIf(!chrome)(
  'search paginates with shared summaries, metadata, refresh and query history',
  async () => {
    await session(async (browser) => {
      await navigate(browser, defaults.server, '/search?q=batchneedle');
      let result = await until<SearchState>(
        browser,
        pageState,
        (value) => value?.status === '12 results. Page 1 of 3.',
      );
      expect([result.count, result.busy]).toEqual([5, 'false']);
      expect(new Set(result.links).size).toBe(5);
      expect(
        result.links.every((href) => href.startsWith('/posts/article-')),
      ).toBe(true);
      expect(result.metadata).toHaveLength(5);
      expect(
        result.metadata.every(
          (value) =>
            value.includes('Published: 2026-01-01') &&
            value.includes('Reading: 1 min'),
        ),
      ).toBe(true);
      await navigate(browser, defaults.server, '/search?q=batchneedle');
      result = await until<SearchState>(
        browser,
        pageState,
        (value) => value?.status === '12 results. Page 1 of 3.',
      );
      expect(result.count).toBe(5);
      await input(browser, '#left-sidebar .search-form input', 'sixneedle');
      await submit(browser, '#left-sidebar .search-form');
      result = await until<SearchState>(
        browser,
        pageState,
        (value) => value?.status === '6 results. Page 1 of 2.',
      );
      expect(result.count).toBe(5);
      await input(browser, '#left-sidebar .search-form input', 'fourneedle');
      await submit(browser, '#left-sidebar .search-form');
      await until<SearchState>(
        browser,
        pageState,
        (value) => value?.status === '4 results. Page 1 of 1.',
      );
      await browser.send('Page.navigateToHistoryEntry', {
        entryId: (await browser.send('Page.getNavigationHistory')).entries.at(
          -2,
        ).id,
      });
      result = await until<SearchState>(
        browser,
        pageState,
        (value) => value?.status === '6 results. Page 1 of 2.',
      );
      expect(
        await evaluate<string>(
          browser,
          `document.querySelector('.main-region .breadcrumbs a[href^="/search"]').textContent`,
        ),
      ).toBe('Search: sixneedle');
      await navigate(browser, defaults.server, '/search?q=unmatchedneedle');
      result = await until<SearchState>(
        browser,
        pageState,
        (value) => value?.status === 'No results found.',
      );
      expect([result.count, result.fallback]).toEqual([0, true]);
    }, defaults.root);
  },
  30_000,
);
test.skipIf(!chrome)(
  'excluded posts remain in routes and tag archives but not Pagefind',
  async () => {
    await session(async (browser) => {
      await navigate(browser, defaults.server, '/posts/excluded');
      expect(
        await evaluate<string>(
          browser,
          `document.querySelector('h1.page-title').textContent.trim()`,
        ),
      ).toBe('Excluded published article');

      await navigate(browser, defaults.server, '/tag/ExcludedFromSearch');
      expect(
        await evaluate<string>(
          browser,
          `new URL(document.querySelector('.post-list .post-title a').href).pathname`,
        ),
      ).toBe('/posts/excluded');

      await navigate(browser, defaults.server, '/search?q=excludedneedle');
      const result = await until<SearchState>(
        browser,
        pageState,
        (value) => value?.status === 'No results found.',
      );
      expect([result.count, result.fallback]).toEqual([0, true]);
    }, defaults.root);
  },
  30_000,
);

test.skipIf(!chrome)(
  'failed result details show the archive fallback without partial results',
  async () => {
    await session(async (browser) => {
      defaults.control.failFragments = true;
      try {
        await navigate(browser, defaults.server, '/search?q=batchneedle');
        const failed = await until<SearchState>(
          browser,
          pageState,
          (value) => value?.status === 'Search is unavailable.',
        );
        expect([failed.count, failed.fallback, failed.busy]).toEqual([
          0,
          true,
          'false',
        ]);
      } finally {
        defaults.control.failFragments = false;
      }
    }, defaults.root);
  },
  30_000,
);

test.skipIf(!chrome)(
  'empty routes never request Pagefind and failed index shows archive fallback',
  async () => {
    await session(async (browser) => {
      defaults.control.indexRequests = 0;
      await navigate(browser, defaults.server, '/search');
      await navigate(browser, defaults.server, '/search?q=%20%20');
      expect(defaults.control.indexRequests).toBe(0);
      defaults.control.failIndex = true;
      try {
        await navigate(browser, defaults.server, '/search?q=fourneedle');
        const failed = await until<SearchState>(
          browser,
          pageState,
          (value) => value?.status === 'Search is unavailable.',
        );
        expect([failed.count, failed.fallback]).toEqual([0, true]);
        expect(
          await evaluate<string>(
            browser,
            `document.querySelector('nayuta-search-page [data-search-fallback] a').getAttribute('href')`,
          ),
        ).toBe('/posts');
      } finally {
        defaults.control.failIndex = false;
      }
    }, defaults.root);
  },
  30_000,
);

test.skipIf(!chrome)(
  'mobile drawer submits search and no-script fallback remains accessible',
  async () => {
    await session(async (browser) => {
      await browser.send('Emulation.setDeviceMetricsOverride', {
        width: 390,
        height: 844,
        deviceScaleFactor: 1,
        mobile: false,
      });
      await navigate(browser, defaults.server, '/');
      await evaluate(
        browser,
        `document.querySelector('#open-widgets-btn').click()`,
      );
      await input(browser, '#widgets-drawer .search-form input', 'sixneedle');
      await submit(browser, '#widgets-drawer .search-form');
      const result = await until<SearchState>(
        browser,
        pageState,
        (value) => value?.status === '6 results. Page 1 of 2.',
      );
      expect(result.count).toBe(5);
      expect(
        await evaluate<string>(
          browser,
          `document.querySelector('.mobile-sticky-header .breadcrumbs a[href^="/search"]').textContent`,
        ),
      ).toBe('Search: sixneedle');
      await browser.send('Emulation.setScriptExecutionDisabled', {
        value: true,
      });
      await navigate(browser, defaults.server, '/search');
      expect(
        await evaluate<boolean>(
          browser,
          `document.querySelectorAll('nayuta-search-page .post-summary').length === 0`,
        ),
      ).toBe(true);
      expect(
        await evaluate<string>(
          browser,
          `document.querySelector('nayuta-search-page noscript').textContent`,
        ),
      ).toContain('Browse all posts');
      await navigate(browser, defaults.server, '/');
      expect(
        await evaluate<string>(
          browser,
          `document.querySelector('#left-sidebar .search-form').getAttribute('action')`,
        ),
      ).toBe('/search');
    }, defaults.root);
  },
  30_000,
);

test('Astro build emits the index and excludes development-only routes', async () => {
  const entry = await Bun.file(
    join(defaults.root, 'dist/pagefind/pagefind-entry.json'),
  ).json();
  expect(entry.languages.en.page_count).toBe(12);
  expect(
    await Bun.file(join(defaults.root, 'dist/_pagefind/posts.json')).exists(),
  ).toBe(false);
  const search = await Bun.file(
    join(defaults.root, 'dist/search/index.html'),
  ).text();
  expect(search).toContain('data-mode="dynamic"');
  expect(search).toContain('name="robots" content="noindex"');
  expect(search).not.toContain('Search Site');
});

test.skipIf(!chrome)(
  'pagination loads only its page and supports focus, history, refresh and highlights',
  async () => {
    await session(async (browser) => {
      defaults.control.fragmentRequests.clear();
      await navigate(browser, defaults.server, '/search?q=batchneedle&page=2');
      const second = await until<SearchState>(
        browser,
        pageState,
        (value) => value?.status === '12 results. Page 2 of 3.',
      );
      expect(second.count).toBe(5);
      expect(defaults.control.fragmentRequests.size).toBe(5);
      expect(
        await evaluate<string>(
          browser,
          `document.querySelector('h1').textContent`,
        ),
      ).toBe('Search: batchneedle');
      expect(await evaluate<string>(browser, 'document.title')).toStartWith(
        'Search: batchneedle - ',
      );
      expect(
        await evaluate<string[]>(
          browser,
          `[...document.querySelectorAll('.main-region .breadcrumbs a')].map(a => a.textContent)`,
        ),
      ).toEqual(['Home', 'Posts', 'Search: batchneedle']);
      expect(
        await evaluate<number>(
          browser,
          `document.querySelectorAll('.post-description mark').length`,
        ),
      ).toBeGreaterThan(0);
      await evaluate(
        browser,
        `(() => { const next = document.querySelector('a[rel="next"]'); next.focus(); next.click(); })()`,
      );
      const third = await until<SearchState>(
        browser,
        pageState,
        (value) => value?.status === '12 results. Page 3 of 3.',
      );
      expect(third.count).toBe(2);
      expect(third.links.some((link) => second.links.includes(link))).toBe(
        false,
      );
      expect(await evaluate<string>(browser, 'location.search')).toBe(
        '?q=batchneedle&page=3',
      );
      expect(
        await evaluate<boolean>(
          browser,
          `document.activeElement === document.querySelector('.post-title a')`,
        ),
      ).toBe(true);
      await evaluate(browser, 'history.back()');
      expect(
        (
          await until<SearchState>(
            browser,
            pageState,
            (value) => value?.status === '12 results. Page 2 of 3.',
          )
        ).links,
      ).toEqual(second.links);
      await evaluate(browser, 'history.forward()');
      expect(
        (
          await until<SearchState>(
            browser,
            pageState,
            (value) => value?.status === '12 results. Page 3 of 3.',
          )
        ).links,
      ).toEqual(third.links);
      await navigate(browser, defaults.server, '/search?q=batchneedle&page=3');
      expect(
        (
          await until<SearchState>(
            browser,
            pageState,
            (value) => value?.status === '12 results. Page 3 of 3.',
          )
        ).links,
      ).toEqual(third.links);
    }, defaults.root);
  },
  30_000,
);

test.skipIf(!chrome)(
  'missing and empty page values use page one; invalid and out-of-range pages show 404',
  async () => {
    await session(async (browser) => {
      for (const suffix of ['', '&page=', '&page=1']) {
        await navigate(
          browser,
          defaults.server,
          `/search?q=batchneedle${suffix}`,
        );
        expect(
          (
            await until<SearchState>(
              browser,
              pageState,
              (value) => value?.status === '12 results. Page 1 of 3.',
            )
          ).count,
        ).toBe(5);
      }
      for (const query of [
        'q=batchneedle&page=4',
        'q=batchneedle&page=0',
        'q=batchneedle&page=-1',
        'q=batchneedle&page=1.5',
        'q=batchneedle&page=abc',
        'q=batchneedle&page=9007199254740992',
        'q=unmatchedneedle&page=2',
        'page=2',
      ]) {
        await browser.send('Page.navigate', {
          url: url(defaults.server, `/search?${query}`),
        });
        await until(
          browser,
          `location.pathname === '/404.html' && !!document.querySelector('.not-found')`,
          Boolean,
        );
      }
    }, defaults.root);
  },
  30_000,
);

test.skipIf(!chrome)(
  'search summaries wrap and use theme highlights around layout breakpoints',
  async () => {
    await session(async (browser) => {
      for (const theme of [
        'nayuta',
        'nayuta-aqua',
        'midnight-blue',
        'oled-dark',
        'sakura-pink',
      ]) {
        const css = await Bun.file(
          join(repositoryRoot, `src/assets/styles/themes/${theme}.css`),
        ).text();
        await navigate(browser, defaults.server, '/search?q=batchneedle');
        await until<SearchState>(
          browser,
          pageState,
          (value) => value?.count === 5,
        );
        await evaluate(
          browser,
          `(() => { const style = document.createElement('style'); style.textContent = ${JSON.stringify(css)}; document.head.append(style); })()`,
        );
        for (const width of [390, 768, 769, 1120, 1121, 1440]) {
          await browser.send('Emulation.setDeviceMetricsOverride', {
            width,
            height: 900,
            deviceScaleFactor: 1,
            mobile: false,
          });
          expect(
            await evaluate<boolean>(
              browser,
              `(() => {
            const mark = document.querySelector('.post-description mark');
            const probe = document.createElement('span');
            probe.style.backgroundColor = 'var(--ny-color-primary)';
            probe.style.color = 'var(--ny-color-primary-text)';
            document.body.append(probe);
            const matches = getComputedStyle(mark).backgroundColor === getComputedStyle(probe).backgroundColor &&
              getComputedStyle(mark).color === getComputedStyle(probe).color;
            probe.remove();
            return matches && document.documentElement.scrollWidth <= innerWidth;
          })()`,
            ),
          ).toBe(true);
        }
      }
    }, defaults.root);
  },
  30_000,
);

test.skipIf(!chrome)(
  'Astro dev creates a fresh index and refreshes edited, added and removed posts',
  async () => {
    const root = await prepare();
    const reservation = Bun.serve({
      hostname: '127.0.0.1',
      port: 0,
      fetch: () => new Response(),
    });
    const port = reservation.port!;
    reservation.stop(true);
    const dev = Bun.spawn(
      [
        'bun',
        'run',
        'dev',
        '--ignore-lock',
        '--host',
        '127.0.0.1',
        '--port',
        String(port),
      ],
      {
        cwd: root,
        stdout: Bun.file(join(root, 'dev.log')),
        stderr: Bun.file(join(root, 'dev-errors.log')),
      },
    );
    const address = `http://127.0.0.1:${port}`;
    async function waitFor(path: string, predicate: (text: string) => boolean) {
      for (let attempt = 0; attempt < 300; attempt++) {
        try {
          const response = await fetch(`${address}${path}`);
          if (response.ok && predicate(await response.text())) return;
        } catch {
          /* The server is still starting. */
        }
        await Bun.sleep(50);
      }
      throw new Error(
        `Development index did not update: ${path}\n${await Bun.file(join(root, 'dev-errors.log')).text()}`,
      );
    }
    try {
      await waitFor(
        '/pagefind/pagefind-entry.json',
        (text) => JSON.parse(text).languages.en.page_count === 13,
      );
      expect(
        await Bun.file(join(root, 'dist/pagefind/pagefind.js')).exists(),
      ).toBe(false);
      await session(async (browser) => {
        const search = async (query: string, count: number) => {
          await browser.send('Page.navigate', {
            url: `${address}/search?q=${query}`,
          });
          await until<SearchState>(
            browser,
            pageState,
            (value) =>
              value?.status ===
              `${count} results. Page 1 of ${Math.ceil(count / 5)}.`,
          );
        };
        await search('batchneedle', 13);
        await search('Draft', 1);
        expect(
          await evaluate<string>(
            browser,
            `document.querySelector('.badge-draft').textContent`,
          ),
        ).toBe('Draft');
        const source = join(root, 'src/content/posts/article-1.md');
        await Bun.write(
          source,
          (await Bun.file(source).text()) + '\n\nupdatedneedle.',
        );
        await waitFor('/posts/article-1', (text) =>
          text.includes('updatedneedle'),
        );
        await search('updatedneedle', 1);
        const added = join(root, 'src/content/posts/new.md');
        await Bun.write(
          added,
          '---\ntitle: Added article\npublishDate: "2026-01-01"\n---\n\nupdatedneedle.',
        );
        await waitFor('/_pagefind/posts.json', (text) =>
          text.includes('/posts/new'),
        );
        await search('updatedneedle', 2);
        await rm(added);
        await waitFor(
          '/_pagefind/posts.json',
          (text) => !text.includes('/posts/new'),
        );
        await search('updatedneedle', 1);
      }, root);
    } finally {
      dev.kill();
      await dev.exited;
    }
  },
  60_000,
);

test.skipIf(!chrome)(
  'an index with no eligible posts produces an empty result page',
  async () => {
    const empty = await fixture(true);
    const entry = await Bun.file(
      join(empty.root, 'dist/pagefind/pagefind-entry.json'),
    ).json();
    expect(entry.languages).toEqual({});
    await session(async (browser) => {
      await navigate(browser, empty.server, '/search?q=excludedneedle');
      const result = await until<SearchState>(
        browser,
        pageState,
        (value) => value?.status === 'No results found.',
      );
      expect([result.count, result.fallback, result.busy]).toEqual([
        0,
        true,
        'false',
      ]);
    }, empty.root);
  },
  30_000,
);
