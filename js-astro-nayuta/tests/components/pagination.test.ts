import { afterAll, beforeAll, expect, test } from 'bun:test';
import { cp, mkdtemp, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { paginateList } from '../../src/assets/utils/pagination';

const repositoryRoot = join(import.meta.dir, '../..');
let fixtureRoot: string;

async function readPage(path: string) {
  return Bun.file(join(fixtureRoot, 'dist', path, 'index.html')).text();
}

async function attributes(html: string, selector: string, attribute: string) {
  const values: string[] = [];
  await new HTMLRewriter()
    .on(selector, {
      element(element) {
        const value = element.getAttribute(attribute);
        if (value !== null) values.push(value);
      },
    })
    .transform(new Response(html))
    .text();
  return values;
}

beforeAll(async () => {
  fixtureRoot = await mkdtemp(join(tmpdir(), 'nayuta-pagination-'));
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
  // All fixture content and config changes stay outside the repository.
  await Promise.all(
    ['posts', 'pages'].map((directory) =>
      rm(join(fixtureRoot, 'src/content', directory), { recursive: true }),
    ),
  );
  const configPath = join(fixtureRoot, 'src/config.ts');
  await cp(configPath, join(fixtureRoot, 'src/fixture-config.ts'));
  await Bun.write(
    configPath,
    "import config from './fixture-config';\nexport default { ...config, postsPerPage: 3 };\n",
  );

  for (let number = 23; number >= 1; number--) {
    const id = number === 1 ? '2' : `post-${String(number).padStart(2, '0')}`;
    const tags =
      number % 2 === 0 ? ['Astro', 'CSS Grid', '前端开发', '2026'] : [];
    if (number === 1) tags.push('Solo');
    const metadata = {
      title: `Article ${number}`,
      publishDate: `2026-01-${String(Math.min(number, 22)).padStart(2, '0')}`,
      description: `Summary ${number}.`,
      tags,
    };
    await Bun.write(
      join(fixtureRoot, 'src/content/posts', `${id}.md`),
      `---\n${JSON.stringify(metadata)}\n---\n\nArticle body.\n`,
    );
  }
  for (const number of [1, 2]) {
    await Bun.write(
      join(fixtureRoot, 'src/content/posts', `draft-${number}.md`),
      `---\ntitle: Draft ${number}\npublishDate: '2026-02-01'\ndraft: true\ntags: [Astro, DraftOnly]\n---\n\nDraft body.\n`,
    );
  }

  // Exercise the shared helper with a different data type and 100,000 entries.
  // Emit only representative pages, so this is not a 10,000-page build benchmark.
  await Bun.write(
    join(fixtureRoot, 'src/pages/large/[...page].astro'),
    `---
import Frame from '../../layouts/frame.astro';
import Prose from '../../layouts/components/Prose.astro';
import Pagination from '../../layouts/components/Pagination.astro';
import { paginateList } from '../../assets/utils/pagination';
export function getStaticPaths({ paginate }) {
  const entries = Array.from({ length: 100_000 }, (_, index) => index + 1);
  return paginateList(paginate, entries).filter(({ props }) =>
    [1, 5000, 10000].includes(props.page.currentPage),
  );
}
const { page } = Astro.props;
---
<Frame title="Large archive" withLeftSidebar={false}>
  <Prose>
    <h1>Large archive</h1>
    <ol>{page.data.map((entry) => <li data-entry={entry}>{entry}</li>)}</ol>
    <Pagination page={page} />
  </Prose>
</Frame>
`,
  );
  await Bun.write(
    join(fixtureRoot, 'src/pages/empty/[...page].astro'),
    `---
import PostList from '../../layouts/widgets/post-list/PostList.astro';
import { paginateList } from '../../assets/utils/pagination';
export function getStaticPaths({ paginate }) {
  return paginateList(paginate, []);
}
const { page } = Astro.props;
---
<PostList page={page} />
`,
  );
  const build = Bun.spawn(['bun', 'run', 'build'], {
    cwd: fixtureRoot,
    stdout: 'pipe',
    stderr: 'pipe',
  });
  const [exitCode, stdout, stderr] = await Promise.all([
    build.exited,
    new Response(build.stdout).text(),
    new Response(build.stderr).text(),
  ]);
  expect(exitCode, stdout + stderr).toBe(0);
}, 60_000);

afterAll(async () => {
  if (fixtureRoot) await rm(fixtureRoot, { recursive: true, force: true });
});

test('each URL contains only its page, ordered across boundaries with no duplicates', async () => {
  const links: string[] = [];
  for (let number = 1; number <= 8; number++) {
    const html = await readPage(
      number === 1 ? 'posts' : `posts/page/${number}`,
    );
    const pageLinks = await attributes(html, '.post-summary h2 a', 'href');
    expect(pageLinks).toHaveLength(number === 8 ? 2 : 3);
    links.push(...pageLinks);
    expect(html).not.toContain('Draft 1');
    expect(html).not.toContain('Draft 2');
    expect(
      await attributes(html, '.pagination [aria-current]', 'aria-label'),
    ).toEqual([`Page ${number}, current page`]);
  }
  expect(links).toEqual([
    '/posts/post-22',
    '/posts/post-23',
    ...Array.from(
      { length: 20 },
      (_, index) => `/posts/post-${String(21 - index).padStart(2, '0')}`,
    ),
    '/posts/2',
  ]);
  expect(new Set(links).size).toBe(23);
});

test('first and last pages expose valid previous/next boundaries and page titles', async () => {
  const first = await readPage('posts');
  const second = await readPage('posts/page/2');
  const last = await readPage('posts/page/8');
  expect(first).not.toContain('[prev]');
  expect(first).toContain('[next]');
  expect(second).toContain('[prev]');
  expect(second).toContain('[2]');
  expect(second).toContain('[next]');
  expect(last).toContain('[prev]');
  expect(last).not.toContain('[next]');
  expect(await attributes(first, '.pagination a[rel="prev"]', 'href')).toEqual(
    [],
  );
  expect(await attributes(first, '.pagination a[rel="next"]', 'href')).toEqual([
    '/posts/page/2',
  ]);
  expect(await attributes(second, '.pagination a[rel="prev"]', 'href')).toEqual(
    ['/posts'],
  );
  expect(await attributes(last, '.pagination a[rel="next"]', 'href')).toEqual(
    [],
  );
  expect(await attributes(last, '.pagination a[rel="prev"]', 'href')).toEqual([
    '/posts/page/7',
  ]);
  expect(second).toContain('<title>Posts — Page 2');
  expect(await readPage('posts/2')).toContain('<title>Article 1');
});

test.each(['Astro', 'CSS Grid', '前端开发', '2026'])(
  'paginates the %s tag independently with navigable encoded links',
  async (tag) => {
    const links: string[] = [];
    for (let number = 1; number <= 4; number++) {
      const html = await readPage(
        `tag/${tag}${number === 1 ? '' : `/page/${number}`}`,
      );
      const pageLinks = await attributes(html, '.post-summary h2 a', 'href');
      expect(pageLinks).toHaveLength(number === 4 ? 2 : 3);
      links.push(...pageLinks);
      const next = await attributes(html, '.pagination a[rel="next"]', 'href');
      expect(next).toEqual(
        number === 4
          ? []
          : [`/tag/${encodeURIComponent(tag)}/page/${number + 1}`],
      );
    }
    expect(links).toEqual(
      Array.from(
        { length: 11 },
        (_, index) => `/posts/post-${String(22 - index * 2).padStart(2, '0')}`,
      ),
    );
  },
);

test('all archive navigation links point to generated HTML', async () => {
  const paths = await Array.fromAsync(
    new Bun.Glob('{posts,tag}/**/index.html').scan(join(fixtureRoot, 'dist')),
  );
  for (const path of paths) {
    const html = await Bun.file(join(fixtureRoot, 'dist', path)).text();
    for (const href of await attributes(html, '.pagination a', 'href')) {
      const pathname = decodeURIComponent(
        new URL(href, 'https://example.test').pathname,
      );
      expect(
        await Bun.file(
          join(fixtureRoot, 'dist', pathname, 'index.html'),
        ).exists(),
        href,
      ).toBe(true);
    }
  }
});

test('single and empty lists hide pagination, and empty lists remain readable', async () => {
  const solo = await readPage('tag/Solo');
  expect(await attributes(solo, '.post-summary h2 a', 'href')).toEqual([
    '/posts/2',
  ]);
  expect(solo).not.toContain('aria-label="Pagination"');
  const empty = await readPage('empty');
  expect(empty).toContain('No posts yet.');
  expect(empty).not.toContain('aria-label="Pagination"');
});

test('invalid, duplicate first, out-of-range, and draft-only archive routes are absent', async () => {
  for (const path of [
    'posts/page/0',
    'posts/page/1',
    'posts/page/-1',
    'posts/page/1.5',
    'posts/page/nope',
    'posts/page/9',
    'tag/Astro/page/5',
    'tag/DraftOnly',
  ]) {
    expect(
      await Bun.file(join(fixtureRoot, 'dist', path, 'index.html')).exists(),
      path,
    ).toBe(false);
  }
});

test.each([1, 5000, 10000])(
  '100,000 entries keep page %i and its controls bounded',
  async (number) => {
    const html = await readPage(
      number === 1 ? 'large' : `large/page/${number}`,
    );
    expect(await attributes(html, '[data-entry]', 'data-entry')).toEqual(
      Array.from({ length: 10 }, (_, index) =>
        String((number - 1) * 10 + index + 1),
      ),
    );
    expect(
      (await attributes(html, '.pagination a', 'href')).length,
    ).toBeLessThanOrEqual(6);
    expect(
      (await attributes(html, '.pagination-pages [aria-label]', 'aria-label'))
        .length,
    ).toBeLessThanOrEqual(5);
    expect(html).toContain('pagination-gap');
    if (number === 5000) {
      expect(
        await attributes(html, '.pagination-pages [aria-label]', 'aria-label'),
      ).toEqual([
        'Page 1',
        'Page 4999',
        'Page 5000, current page',
        'Page 5001',
        'Page 10000',
      ]);
    }
  },
);

test.each([0, -1, 1.5, Infinity, NaN, Number.MAX_SAFE_INTEGER + 1])(
  'rejects an invalid page size: %s',
  (pageSize) => {
    expect(() => paginateList(() => [], [], { pageSize })).toThrow(
      'positive safe integer',
    );
  },
);
