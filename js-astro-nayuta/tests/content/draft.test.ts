import { afterAll, beforeAll, expect, test } from 'bun:test';
import { cp, mkdtemp, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const repositoryRoot = join(import.meta.dir, '../..');
let fixtureRoot: string;

async function runScript(...args: string[]) {
  const proc = Bun.spawn(['bun', 'run', ...args], {
    cwd: fixtureRoot,
    stdout: 'pipe',
    stderr: 'pipe',
    env: {
      ...process.env,
      NODE_ENV: 'production',
    },
  });
  const [exitCode, stdout, stderr] = await Promise.all([
    proc.exited,
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
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
  fixtureRoot = await mkdtemp(join(tmpdir(), 'nayuta-draft-'));
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
  // Isolated test content
  await Promise.all(
    ['posts', 'pages'].map((directory) =>
      rm(join(fixtureRoot, 'src/content', directory), { recursive: true }),
    ),
  );
  await writePost('published-one.md', {
    title: 'Published First Article',
    publishDate: '2026-01-01',
    tags: ['Astro', 'Release'],
    description: 'First published article.',
  });
  await writePost('published-two.md', {
    title: 'Published Second Article',
    publishDate: '2026-02-01',
    tags: ['Astro'],
    draft: false,
    description: 'Second published article.',
  });
  await writePost('draft-one.md', {
    title: 'Draft Hidden Article',
    publishDate: '2026-03-01',
    tags: ['SecretTag'],
    draft: true,
    description: 'This draft should not be built in prod.',
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

test('does not compile or emit HTML for draft posts in production build', async () => {
  const draftPageExists = await Bun.file(
    join(fixtureRoot, 'dist/posts/draft-one/index.html'),
  ).exists();
  expect(draftPageExists).toBe(false);

  const publishedOneExists = await Bun.file(
    join(fixtureRoot, 'dist/posts/published-one/index.html'),
  ).exists();
  expect(publishedOneExists).toBe(true);

  const publishedTwoExists = await Bun.file(
    join(fixtureRoot, 'dist/posts/published-two/index.html'),
  ).exists();
  expect(publishedTwoExists).toBe(true);
});

test('excludes draft posts from the /posts listing in production build', async () => {
  const html = await readPage('posts');
  expect(html).not.toContain('Draft Hidden Article');
  expect(html).toContain('Published First Article');
  expect(html).toContain('Published Second Article');

  const links = await attributes(html, '.post-summary h2 a', 'href');
  expect(links).toEqual(['/posts/published-two', '/posts/published-one']);
});

test('excludes draft-only tags from static tag routes and tag cloud', async () => {
  const secretTagPageExists = await Bun.file(
    join(fixtureRoot, 'dist/tag/SecretTag/index.html'),
  ).exists();
  expect(secretTagPageExists).toBe(false);

  const astroTagPageExists = await Bun.file(
    join(fixtureRoot, 'dist/tag/Astro/index.html'),
  ).exists();
  expect(astroTagPageExists).toBe(true);

  const tagCloudLinks = await attributes(
    await readPage('posts/published-one'),
    '.left-region .tag-cloud a',
    'href',
  );
  expect(tagCloudLinks).toEqual(['/tag/Astro', '/tag/Release']);
  expect(tagCloudLinks).not.toContain('/tag/SecretTag');
});

test('excludes draft posts from recent posts widget', async () => {
  const html = await readPage('posts');
  expect(await attributes(html, '.left-region .post-item', 'href')).toEqual([
    '/posts/published-two',
    '/posts/published-one',
  ]);
});

test('excludes draft posts from website status count and last updated', async () => {
  const homeHtml = await readPage('');
  // 2 published posts, draft excluded
  expect(homeHtml).toMatch(/class="status-value"[^>]*>2<\/span>/);
  expect(homeHtml).not.toMatch(/class="status-value"[^>]*>3<\/span>/);
  // Last updated date should reflect latest published post (2026-02-01), not draft (2026-03-01)
  expect(homeHtml).toContain('2026-02-01');
  expect(homeHtml).not.toContain('2026-03-01');
});

test.each([
  ['non-boolean string', 'true'],
  ['non-boolean number', 1],
])(
  'rejects invalid draft field type: %s',
  async (_name, draftValue) => {
    await writePost('invalid-draft.md', {
      title: 'Invalid Draft Value',
      publishDate: '2026-04-01',
      draft: draftValue,
    });
    const result = await runScript('astro', 'sync');
    expect(result.exitCode, result.output).not.toBe(0);
    expect(result.output).toContain('draft');
  },
  30_000,
);
