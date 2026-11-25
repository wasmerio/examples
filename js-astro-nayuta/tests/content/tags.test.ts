import { afterAll, beforeAll, expect, test } from 'bun:test';
import { cp, mkdtemp, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const repositoryRoot = join(import.meta.dir, '../..');
let fixtureRoot: string;

async function runScript(...args: string[]) {
  const process = Bun.spawn(['bun', 'run', ...args], {
    cwd: fixtureRoot,
    stdout: 'pipe',
    stderr: 'pipe',
  });
  const [exitCode, stdout, stderr] = await Promise.all([
    process.exited,
    new Response(process.stdout).text(),
    new Response(process.stderr).text(),
  ]);
  return { exitCode, output: stdout + stderr };
}

async function writePost(id: string, metadata: object, body = 'Article body.') {
  await Bun.write(
    join(fixtureRoot, 'src/content/posts', id),
    `---\n${JSON.stringify(metadata)}\n---\n\n${body}\n`,
  );
}

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
  fixtureRoot = await mkdtemp(join(tmpdir(), 'nayuta-tags-'));
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
  const configPath = join(fixtureRoot, 'src/config.ts');
  await cp(configPath, join(fixtureRoot, 'src/fixture-config.ts'));
  await Bun.write(
    configPath,
    "import config from './fixture-config';\nexport default { ...config, postsPerPage: 10 };\n",
  );
  // Only the isolated fixture contains test content; authored posts stay untouched.
  await Promise.all(
    ['posts', 'pages'].map((directory) =>
      rm(join(fixtureRoot, 'src/content', directory), { recursive: true }),
    ),
  );
  await writePost('older.md', {
    title: 'Older tagged article',
    publishDate: '2025-01-01',
    tags: [' Astro ', 'Astro', '前端开发', 'CSS Grid'],
    description: 'Older article description.',
    cover: '/cover.png',
  });
  await writePost(
    'newer.mdx',
    {
      title: 'Newer tagged article',
      publishDate: '2026-01-01',
      tags: ['Astro', 'astro'],
    },
    'word '.repeat(201),
  );
  await writePost('untagged.md', {
    title: 'Untagged article',
    publishDate: '2026-02-01',
  });
  await writePost('empty-tags.md', {
    title: 'Empty tags article',
    publishDate: '2026-03-01',
    tags: [],
  });
  await Bun.write(
    join(fixtureRoot, 'src/content/pages/about/index.md'),
    '---\ntitle: About\n---\n\nAbout this site.\n',
  );
  await Bun.write(
    join(fixtureRoot, 'src/content/pages/about/_right.astro'),
    `---
import TagCloud from '@widgets/sidebar/TagCloud.astro';
---
<TagCloud />
`,
  );
  const build = await runScript('build');
  expect(build.exitCode, build.output).toBe(0);
}, 60_000);

afterAll(async () => {
  if (fixtureRoot) await rm(fixtureRoot, { recursive: true, force: true });
});

test('renders ordered, trimmed, unique tag links after the article body', async () => {
  const html = await readPage('posts/older');
  expect(
    await attributes(html, 'nav[aria-label="Post tags"] a', 'href'),
  ).toEqual([
    '/tag/Astro',
    '/tag/%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91',
    '/tag/CSS%20Grid',
  ]);
  expect(await attributes(html, '.post-tags a', 'rel')).toEqual([
    'tag',
    'tag',
    'tag',
  ]);
  expect(html.indexOf('aria-label="Post tags"')).toBeGreaterThan(
    html.indexOf('Article body.'),
  );
});

test.each(['untagged', 'empty-tags'])(
  'omits the tag bar for %s posts',
  async (id) => {
    expect(await readPage(`posts/${id}`)).not.toContain(
      'aria-label="Post tags"',
    );
  },
);

test('archives include only matching posts, newest first, with no duplicates', async () => {
  const html = await readPage('tag/Astro');
  expect(await attributes(html, '.post-summary h2 a', 'href')).toEqual([
    '/posts/newer',
    '/posts/older',
  ]);
  expect(html).toContain('Tag: Astro');
  expect(html).toContain('Older article description.');
  expect(html).toContain('Reading: 2 mins');
  expect(html).toContain('Reading: 1 min');
  expect(await attributes(html, '.post-summary img', 'src')).toEqual([
    '/cover.png',
  ]);
});

test.each(['前端开发', 'CSS Grid'])(
  'builds a readable archive for %s',
  async (tag) => {
    const html = await readPage(`tag/${tag}`);
    expect(html).toContain(`Tag: ${tag}`);
    expect(await attributes(html, '.post-summary h2 a', 'href')).toEqual([
      '/posts/older',
    ]);
  },
);

test('matches tags with case preserved', async () => {
  expect(
    await attributes(await readPage('tag/astro'), '.post-summary h2 a', 'href'),
  ).toEqual(['/posts/newer']);
});

test('the tag cloud links to real, distinct tags', async () => {
  const links = await attributes(
    await readPage('posts/older'),
    '.left-region .tag-cloud a',
    'href',
  );
  expect(links).toEqual([
    '/tag/Astro',
    '/tag/CSS%20Grid',
    '/tag/astro',
    '/tag/%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91',
  ]);
});

test('the shared post list keeps all posts in descending date order', async () => {
  expect(
    await attributes(await readPage('posts'), '.post-summary h2 a', 'href'),
  ).toEqual([
    '/posts/empty-tags',
    '/posts/untagged',
    '/posts/newer',
    '/posts/older',
  ]);
});

test('does not generate archives for unknown tags', async () => {
  expect(
    await Bun.file(join(fixtureRoot, 'dist/tag/unknown/index.html')).exists(),
  ).toBe(false);
});

test.each([
  ['non-array', 'Astro'],
  ['non-string name', [42]],
  ['blank name', ['   ']],
])(
  'rejects invalid tags: %s',
  async (_name, tags) => {
    await writePost('invalid.md', {
      title: 'Invalid tags',
      publishDate: '2026-01-01',
      tags,
    });
    const result = await runScript('astro', 'sync');
    expect(result.exitCode, result.output).not.toBe(0);
    expect(result.output).toContain('tags');
  },
  30_000,
);

test('builds a site with no tagged posts and hides the tag cloud', async () => {
  for (const id of ['older.md', 'newer.mdx', 'invalid.md']) {
    await rm(join(fixtureRoot, 'src/content/posts', id));
  }
  const build = await runScript('build');
  expect(build.exitCode, build.output).toBe(0);
  expect(
    await attributes(await readPage('about'), '.tag-cloud a', 'href'),
  ).toEqual([]);
  expect(await readPage('about')).not.toContain('Tags Cloud');
  expect(
    await Array.fromAsync(
      new Bun.Glob('tag/**/index.html').scan(join(fixtureRoot, 'dist')),
    ),
  ).toEqual([]);
}, 60_000);
