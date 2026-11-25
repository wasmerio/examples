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
let fixtureRoot: string;
let buildOutput: string;
let server: ReturnType<typeof Bun.serve>;

async function write(path: string, text: string) {
  await Bun.write(join(fixtureRoot, 'src/content', path), text);
}
function markdown(title: string, body = 'Page body.', data: object = {}) {
  return `---\n${JSON.stringify({ title, ...data })}\n---\n\n${body}\n`;
}
async function build() {
  const child = Bun.spawn(['bun', 'run', 'build'], {
    cwd: fixtureRoot,
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
async function html(path = '') {
  return Bun.file(join(fixtureRoot, 'dist', path, 'index.html')).text();
}
async function region(document: string, selector: string) {
  let text = '';
  await new HTMLRewriter()
    .on(selector, {
      text(chunk) {
        text += chunk.text;
      },
    })
    .transform(new Response(document))
    .text();
  return text;
}

beforeAll(async () => {
  fixtureRoot = await mkdtemp(join(tmpdir(), 'nayuta-content-pages-'));
  await Promise.all(
    ['src', 'public', 'astro.config.ts', 'package.json', 'tsconfig.json'].map(
      (path) =>
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
  await rm(join(fixtureRoot, 'src/content'), { recursive: true });
  // A third template exercises registration independently of bundled templates.
  await Bun.write(
    join(fixtureRoot, 'src/templates/fixture/index.ts'),
    `
import { z } from 'astro/zod';
import { defineTemplate } from '@templates/define';
export const schema = z.object({
  labels: z.string().default('one,two').transform((value) => value.split(',')),
});
export default defineTemplate({
  id: 'fixture',
  schema,
  load: () => import('@templates/fixture/Template.astro'),
});
`,
  );
  await Bun.write(
    join(fixtureRoot, 'src/templates/fixture/Template.astro'),
    `---
import type { schema } from '@templates/fixture';
import type { TemplateProps } from '@type/template';
type Props = TemplateProps<typeof schema>;
const { entry, headings, isHome } = Astro.props;
---
<h1>{entry.data.title}</h1>
<p>TEMPLATE-LABELS:{entry.data.labels.join('|')}</p>
<p>TEMPLATE-HEADINGS:{headings.map((heading) => heading.text).join('|')}</p>
<p>TEMPLATE-HOME:{String(isHome)}</p>
<section data-fixture-body><slot /></section>
`,
  );
  const registryPath = join(fixtureRoot, 'src/templates/registry.ts');
  await Bun.write(
    registryPath,
    "import fixtureTemplate from '@templates/fixture';\n" +
      (await Bun.file(registryPath).text()).replace(
        'export const templates = [',
        'export const templates = [fixtureTemplate,',
      ),
  );
  await write('index.md', markdown('Content home', 'HOMEPAGE-MARKDOWN'));
  await write(
    '_left.astro',
    `---\nconst { entry, pathname } = Astro.props;\n---\n<p>ROOT-LEFT {entry?.data.title ?? 'System'} {pathname}</p><a href="/about">Root link</a>`,
  );
  await write('about.md', markdown('Not a route outside pages'));
  await write('pages/about.md', markdown('About', 'ABOUT-CONTENT'));
  for (const extension of ['md', 'mdx', 'astro']) {
    const fixtureMetadata = {
      title: `${extension} fixture`,
      template: 'fixture',
    };
    await write(
      `pages/registered/${extension}.${extension}`,
      extension === 'astro'
        ? `---\nexport const page = ${JSON.stringify(fixtureMetadata)};\nconst { entry } = Astro.props;\n---\n<p>REGISTERED-BODY:{entry.data.labels.join('|')}</p>`
        : markdown(
            fixtureMetadata.title,
            extension === 'md'
              ? '## Registered heading\n\nREGISTERED-BODY'
              : "## Registered heading\n\n<p>REGISTERED-BODY:{props.entry.data.labels.join('|')}</p>",
            fixtureMetadata,
          ),
    );
    const metadata = {
      title: `${extension} friends`,
      description: 'Friend template description',
      template: 'friend',
      categories: [{ id: 'writers', title: 'Fixture writers' }],
      friends: [
        {
          name: 'Known writer',
          href: 'https://writer.example/',
          category: 'writers',
          tags: ['Fixture tag'],
        },
        {
          name: 'Unlisted category',
          href: 'https://unlisted.example/',
          category: 'unlisted',
        },
        { name: 'Uncategorized friend', href: 'https://friend.example/' },
      ],
      mySite: { name: 'Fixture site', url: 'https://site.example/' },
    };
    await write(
      `pages/friends/${extension}.${extension}`,
      extension === 'astro'
        ? `---\nexport const page = ${JSON.stringify(metadata)};\n---\n<p>FRIEND-BODY</p>`
        : markdown(metadata.title, 'FRIEND-BODY', metadata),
    );
  }
  await write(
    'pages/registered/_right.astro',
    `---\nconst { entry } = Astro.props;\n---\n<p>SIDEBAR-LABELS:{entry.data.labels.join('|')}</p>`,
  );
  for (const extension of ['mdx', 'astro']) {
    const metadata = {
      title: 'Defaulted friends',
      template: 'friend',
      extra: 'PRESERVED-CUSTOM-FIELD',
    };
    await write(
      `pages/friends/default-${extension}.${extension}`,
      extension === 'astro'
        ? `---\nexport const page = ${JSON.stringify(metadata)};\nconst { entry } = Astro.props;\n---\n<p>DEFAULT-FRIENDS:{entry.data.friends.length}</p><p>{entry.data.extra}</p>`
        : markdown(
            metadata.title,
            '<p>DEFAULT-FRIENDS:{props.entry.data.friends.length}</p><p>{props.entry.data.extra}</p>',
            metadata,
          ),
    );
  }
  await write(
    'pages/friends/_right.astro',
    `---\nconst { entry } = Astro.props;\n---\n<p>SIDEBAR-FRIENDS:{entry.data.friends.length}</p>`,
  );
  await write(
    'pages/own-fields.astro',
    `---\nexport const page = { title: 'Own fields', friends: 'A custom string', categories: 42, mySite: false };\nconst { entry } = Astro.props;\n---\n<p>OWN-FIELDS:{entry.data.friends}:{entry.data.categories}:{String(entry.data.mySite)}</p>`,
  );
  await write(
    'pages/a/b/c/index.mdx',
    markdown(
      'Nested page',
      '## Nested heading\n\nNESTED-CONTENT\n\n![Local image](./assets/cover.svg)',
    ),
  );
  await write(
    'pages/a/b/c/assets/cover.svg',
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="10"><rect width="20" height="10" fill="red"/></svg>',
  );
  await write(
    'pages/a/b/c/_left.astro',
    '<p>LOCAL-LEFT</p><a href="/about">Local left link</a>',
  );
  await write(
    'pages/a/b/c/_right.astro',
    `---\nconst { headings } = Astro.props;\n---\n<p>LOCAL-RIGHT {headings[0]?.text}</p><a href="#nested-heading">Local right link</a>`,
  );
  await write('pages/a/b/c/child.md', markdown('Child', 'DIRECTORY-SIDEBARS'));
  await write(
    'pages/a/b/c/deeper/index.md',
    markdown('Deeper', 'NO-ANCESTOR-INHERITANCE'),
  );
  await write(
    'pages/projects/index.astro',
    `---\nexport const page = { title: 'Astro projects', description: 'Astro page description' };\nconst { entry } = Astro.props;\n---\n<p class="astro-project">ASTRO-PAGE {entry.data.title}</p>\n<style>.astro-project { color: var(--ny-color-primary); }</style>`,
  );
  await write(
    'pages/moved/source/index.mdx',
    markdown('Moved page', 'MOVED-BODY', { slug: 'published/elsewhere' }),
  );
  await write('pages/moved/source/_left.astro', '<p>MOVED-LOCAL-LEFT</p>');
  await write(
    'pages/no-sidebars.md',
    markdown('Opt out', 'OPT-OUT', {
      withLeftSidebar: false,
      withRightSidebar: false,
    }),
  );
  await write(
    'pages/no-profile.md',
    markdown('No profile', 'NO-PROFILE', { withProfileCard: false }),
  );
  await write(
    'pages/no-right-yet.md',
    markdown('No empty column', 'NO-EMPTY-COLUMN', { withRightSidebar: true }),
  );
  for (const path of [
    'assets/bad.md',
    'pages/assets/bad.md',
    'pages/a/b/c/assets/bad.mdx',
    'pages/_private/bad.md',
    'pages/a/_private/deep/bad.mdx',
    'pages/_partial.md',
  ]) {
    await write(
      path,
      'Missing required title: this must never enter a collection.',
    );
  }
  for (const path of [
    'pages/assets/bad.astro',
    'pages/_private/bad.astro',
    'pages/_partial.astro',
  ]) {
    await write(path, '---\nthis is invalid javascript\n---');
  }
  await write(
    'posts/bundle/index.mdx',
    markdown('Bundle post', '## Article heading\n\nPOST-BODY', {
      publishDate: '2026-01-03',
      tags: ['Fixtures'],
    }),
  );
  await write('posts/bundle/_left.astro', '<p>POST-LOCAL-LEFT</p>');
  await write('posts/bundle/_right.astro', '<p>POST-EXTRA-RIGHT</p>');
  await write(
    'posts/plain.md',
    markdown('Plain post', '## Plain heading', {
      publishDate: '2026-01-02',
      tags: ['Fixtures'],
    }),
  );
  await write(
    'posts/quiet/index.md',
    markdown('Quiet post', '## Required heading', {
      publishDate: '2026-01-01',
      withRightSidebar: false,
    }),
  );
  await write('posts/quiet/_right.astro', '<p>DISABLED-POST-EXTRA</p>');
  await write('posts/bundle/assets/bad.md', 'This asset is not a post.');
  await write('posts/_private/bad.md', 'This private file is not a post.');
  for (const path of [
    'index',
    'search',
    'posts',
    'posts/bundle',
    'posts/page/2',
    'tag/Fixtures',
    'tag/Fixtures/page/2',
  ]) {
    await write(
      `pages/${path}.mdx`,
      markdown('System conflict', `USER-CONFLICT-${path}`),
    );
  }
  const configPath = join(fixtureRoot, 'src/config.ts');
  await Bun.write(
    configPath,
    (await Bun.file(configPath).text()).replace(
      'postsPerPage: 10',
      'postsPerPage: 1',
    ),
  );
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
  const result = await build();
  expect(result.code, result.output).toBe(0);
  buildOutput = result.output;
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

test('renders the content homepage and both nested page formats with metadata', async () => {
  expect(await html()).toContain('HOMEPAGE-MARKDOWN');
  expect(await html('a/b/c')).toContain('NESTED-CONTENT');
  expect(await html('a/b/c')).toContain('alt="Local image"');
  const astro = await html('projects');
  expect(astro).toContain('ASTRO-PAGE Astro projects');
  expect(astro).toContain('content="Astro page description"');
  expect(astro.match(/<!DOCTYPE html>/gi)).toHaveLength(1);
});

test('renders template-specific fields from Markdown, MDX and Astro', async () => {
  for (const extension of ['md', 'mdx', 'astro']) {
    const document = await html(`friends/${extension}`);
    expect(document).toContain('FRIEND-BODY');
    expect(document).toContain('content="Friend template description"');
    const known = await region(document, '#category-writers');
    expect(known).toContain('Fixture writers');
    expect(known).toContain('Known writer');
    expect(known).toContain('Fixture tag');
    expect(known).not.toContain('Unlisted category');
    const other = await region(document, '#category-other');
    expect(other).toContain('Unlisted category');
    expect(other).toContain('Uncategorized friend');
    expect(await region(document, '.exchange-section')).toContain(
      'Fixture site',
    );
    expect(await region(document, '#right-sidebar')).toContain(
      'SIDEBAR-FRIENDS:3',
    );
  }
});

test('registered templates receive parsed metadata, headings and body slots for every page format', async () => {
  for (const extension of ['md', 'mdx', 'astro']) {
    const document = await html(`registered/${extension}`);
    expect(document.match(/<!DOCTYPE html>/gi)).toHaveLength(1);
    expect(document).toContain('TEMPLATE-LABELS:one|two');
    expect(document).toContain('TEMPLATE-HOME:false');
    const body = await region(document, '[data-fixture-body]');
    expect(body).toContain(
      extension === 'md' ? 'REGISTERED-BODY' : 'REGISTERED-BODY:one|two',
    );
    expect(document).toContain(
      extension === 'astro'
        ? 'TEMPLATE-HEADINGS:</p>'
        : 'TEMPLATE-HEADINGS:Registered heading',
    );
    expect(await region(document, '#right-sidebar')).toContain(
      'SIDEBAR-LABELS:one|two',
    );
  }
});

test('passes parsed defaults and preserved custom metadata to bodies and sidebars', async () => {
  for (const extension of ['mdx', 'astro']) {
    const document = await html(`friends/default-${extension}`);
    expect(await region(document, '.top-prose-wrapper')).toContain(
      'DEFAULT-FRIENDS:0',
    );
    expect(document).toContain('PRESERVED-CUSTOM-FIELD');
    expect(await region(document, '#right-sidebar')).toContain(
      'SIDEBAR-FRIENDS:0',
    );
    expect(document).not.toContain('class="friend-section"');
    expect(document).not.toContain('class="exchange-section"');
  }
  expect(await region(await html('own-fields'), 'main')).toContain(
    'OWN-FIELDS:A custom string:42:false',
  );
});

test('does not generate routes for assets, helpers or arbitrary content-root files', async () => {
  const routes = await Array.fromAsync(
    new Bun.Glob('**/*.html').scan(join(fixtureRoot, 'dist')),
  );
  expect(
    routes.filter((path) => /assets|_private|_partial|bad/.test(path)),
  ).toEqual([]);
  expect(await html('about')).toContain('ABOUT-CONTENT');
  expect(await html('about')).not.toContain('Not a route outside pages');
});

test('system routes win without failing the build, including archives and homepage', async () => {
  for (const path of [
    '',
    'search',
    'posts',
    'posts/bundle',
    'posts/page/2',
    'tag/Fixtures',
    'tag/Fixtures/page/2',
  ]) {
    expect(await html(path)).not.toContain('USER-CONFLICT-');
  }
  expect(buildOutput).toContain('higher priority route');
});

test('uses local sidebars independently, otherwise root defaults, without ancestor inheritance', async () => {
  expect(await region(await html('a/b/c'), '#left-sidebar')).toContain(
    'LOCAL-LEFT',
  );
  expect(await region(await html('a/b/c'), '#left-sidebar')).not.toContain(
    'ROOT-LEFT',
  );
  expect(await region(await html('a/b/c'), '#right-sidebar')).toContain(
    'LOCAL-RIGHT Nested heading',
  );
  expect(await html('a/b/c/child')).toContain('LOCAL-LEFT');
  expect(await html('a/b/c/deeper')).toContain('ROOT-LEFT');
  expect(await html('a/b/c/deeper')).not.toContain('LOCAL-LEFT');
  expect(await html('published/elsewhere')).toContain('MOVED-LOCAL-LEFT');
  for (const path of [
    '',
    'about',
    'projects',
    'no-right-yet',
    'posts',
    'tag/Fixtures',
  ]) {
    const document = await html(path);
    expect(document).toContain('ROOT-LEFT');
    expect(document).not.toContain('id="right-sidebar"');
    expect(document).not.toContain('id="open-context-btn"');
  }
});

test('post bundles override both sides and always retain TOC before optional content', async () => {
  const document = await html('posts/bundle');
  expect(await region(document, '#left-sidebar')).toContain('POST-LOCAL-LEFT');
  const right = await region(document, '#right-sidebar');
  expect(right).toContain('Article heading');
  expect(right.indexOf('Table of Contents')).toBeLessThan(
    right.indexOf('POST-EXTRA-RIGHT'),
  );
  for (const path of ['posts/plain', 'posts/quiet']) {
    const document = await html(path);
    expect(document).toContain('Table of Contents');
    expect(document).toContain('id="right-sidebar"');
    expect(document).not.toContain('DISABLED-POST-EXTRA');
  }
});

test('layout opt-outs remove regions or just the profile card', async () => {
  expect(await html('no-sidebars')).not.toContain('id="left-sidebar"');
  expect(await html('no-sidebars')).not.toContain('id="widgets-drawer"');
  expect(await html('no-profile')).not.toContain('class="profile-card"');
  expect(await html('no-profile')).toContain('ROOT-LEFT');
});

for (const width of [390, 800, 1440]) {
  for (const theme of ['light', 'dark']) {
    test.skipIf(!chrome)(
      `custom sidebar layout and keyboard at ${width}px in ${theme}`,
      async () => {
        const profile = await mkdtemp(join(fixtureRoot, 'chrome-'));
        const browser = await openChromium(chrome!, profile);
        const evaluate = async (expression: string) =>
          (
            await browser.send('Runtime.evaluate', {
              expression,
              returnByValue: true,
            })
          ).result.value;
        try {
          await browser.send('Emulation.setDeviceMetricsOverride', {
            width,
            height: 900,
            deviceScaleFactor: 1,
            mobile: false,
          });
          await browser.send('Page.enable');
          await browser.send('Page.navigate', { url: `${server.url}a/b/c/` });
          for (let attempt = 0; attempt < 100; attempt++) {
            if (
              await evaluate(
                `document.readyState === 'complete' && 'drawersReady' in document.documentElement.dataset`,
              )
            )
              break;
            await Bun.sleep(50);
          }
          expect(
            await evaluate(
              `'drawersReady' in document.documentElement.dataset`,
            ),
          ).toBe(true);
          if (theme === 'light') {
            // Fixture-only light palette exercises the same semantic tokens.
            const palette = `:root {
              --ny-color-bg: #f8fafc; --ny-color-surface: #ffffff;
              --ny-color-surface-container: #eef2f6; --ny-color-text: #17212e;
              --ny-color-text-muted: #42546b; --ny-color-text-subtle: #52647b;
              --ny-color-primary: #24669c; --ny-color-outline: #24669c;
              --ny-color-border: #c4ceda;
            }`;
            await evaluate(
              `(() => { const style = document.createElement('style'); style.textContent = ${JSON.stringify(palette)}; document.head.append(style); })()`,
            );
          }
          expect(
            await evaluate('document.documentElement.scrollWidth'),
          ).toBeLessThanOrEqual(width);
          expect(
            await evaluate(`document.querySelector('#context-drawer').inert`),
          ).toBe(true);
          if (width <= 1120) {
            await evaluate(
              `document.querySelector('#open-context-btn').focus()`,
            );
            await browser.send('Input.dispatchKeyEvent', {
              type: 'keyDown',
              text: '\r',
              unmodifiedText: '\r',
              key: 'Enter',
              code: 'Enter',
              windowsVirtualKeyCode: 13,
            });
            await browser.send('Input.dispatchKeyEvent', {
              type: 'keyUp',
              key: 'Enter',
              code: 'Enter',
              windowsVirtualKeyCode: 13,
            });
            expect(await evaluate(`document.activeElement.id`)).toBe(
              'close-context-btn',
            );
            expect(
              await evaluate(`document.querySelector('#context-drawer').inert`),
            ).toBe(false);
            expect(
              await evaluate(
                `document.querySelector('#open-context-btn').getAttribute('aria-expanded')`,
              ),
            ).toBe('true');
            await browser.send('Input.dispatchKeyEvent', {
              type: 'keyDown',
              key: 'Tab',
              code: 'Tab',
              windowsVirtualKeyCode: 9,
              modifiers: 8,
            });
            expect(await evaluate(`document.activeElement.textContent`)).toBe(
              'Local right link',
            );
            await browser.send('Input.dispatchKeyEvent', {
              type: 'keyDown',
              key: 'Escape',
              code: 'Escape',
              windowsVirtualKeyCode: 27,
            });
            expect(await evaluate('document.activeElement.id')).toBe(
              'open-context-btn',
            );
            expect(
              await evaluate(`document.querySelector('#context-drawer').inert`),
            ).toBe(true);
            if (width <= 768) {
              await evaluate(
                `document.querySelector('#open-widgets-btn').click()`,
              );
              expect(await evaluate('document.activeElement.id')).toBe(
                'close-widgets-btn',
              );
              await browser.send('Input.dispatchKeyEvent', {
                type: 'keyDown',
                key: 'Escape',
                code: 'Escape',
                windowsVirtualKeyCode: 27,
              });
              expect(await evaluate('document.activeElement.id')).toBe(
                'open-widgets-btn',
              );
            }
          } else {
            expect(
              await evaluate(
                `document.querySelector('#right-sidebar').getBoundingClientRect().width`,
              ),
            ).toBeGreaterThan(0);
          }
          if (process.env.NAYUTA_TEST_ARTIFACTS) {
            const { data } = await browser.send('Page.captureScreenshot', {
              format: 'png',
            });
            await Bun.write(
              join(
                process.env.NAYUTA_TEST_ARTIFACTS,
                `content-${width}-${theme}.png`,
              ),
              Buffer.from(data, 'base64'),
            );
          }
          await browser.send('Emulation.setScriptExecutionDisabled', {
            value: true,
          });
          await browser.send('Page.navigate', { url: `${server.url}a/b/c/` });
          for (let attempt = 0; attempt < 100; attempt++) {
            if (
              await evaluate(
                `document.readyState === 'complete' && !('drawersReady' in document.documentElement.dataset)`,
              )
            )
              break;
            await Bun.sleep(50);
          }
          expect(
            await evaluate(
              `document.querySelector('#right-sidebar').getBoundingClientRect().width`,
            ),
          ).toBeGreaterThan(0);
          expect(
            await evaluate(
              `document.querySelector('.left-sidebar-content').getBoundingClientRect().height`,
            ),
          ).toBeGreaterThan(0);
          expect(
            await evaluate('document.documentElement.scrollWidth'),
          ).toBeLessThanOrEqual(width);
        } finally {
          await browser.close();
        }
      },
      30_000,
    );
  }
}

test('root right content reaches pages and system pages, while local right replaces it', async () => {
  await write(
    '_right.astro',
    '<p>ROOT-RIGHT</p><a href="/about">Root right link</a>',
  );
  const result = await build();
  expect(result.code, result.output).toBe(0);
  for (const path of [
    '',
    'about',
    'projects',
    'posts',
    'tag/Fixtures',
    'published/elsewhere',
    'a/b/c/deeper',
  ]) {
    expect(await region(await html(path), '#right-sidebar')).toContain(
      'ROOT-RIGHT',
    );
  }
  expect(await region(await html('a/b/c'), '#right-sidebar')).not.toContain(
    'ROOT-RIGHT',
  );
  const post = await region(await html('posts/plain'), '#right-sidebar');
  expect(post.indexOf('Table of Contents')).toBeLessThan(
    post.indexOf('ROOT-RIGHT'),
  );
  expect(await html('posts/quiet')).not.toContain('ROOT-RIGHT');
  expect(await html('posts/quiet')).toContain('Table of Contents');
  expect(await html('no-sidebars')).not.toContain('id="right-sidebar"');
}, 60_000);

for (const extension of ['mdx', 'astro']) {
  test(`supports ${extension} as the homepage format`, async () => {
    await Promise.all(
      ['md', 'mdx', 'astro'].map((ext) =>
        rm(join(fixtureRoot, `src/content/index.${ext}`), { force: true }),
      ),
    );
    await write(
      `index.${extension}`,
      extension === 'astro'
        ? `---\nexport const page = { title: 'Astro homepage', template: 'fixture' };\n---\n<p>HOME-ASTRO-FORMAT</p>`
        : markdown('MDX homepage', '<p>HOME-MDX-FORMAT</p>', {
            template: 'fixture',
          }),
    );
    const result = await build();
    expect(result.code, result.output).toBe(0);
    expect(await html()).toContain(
      extension === 'astro' ? 'HOME-ASTRO-FORMAT' : 'HOME-MDX-FORMAT',
    );
    expect(await html()).toContain('TEMPLATE-HOME:true');
  }, 60_000);
}

for (const [path, body] of [
  ['pages/about.mdx', markdown('About', 'ABOUT-CONTENT')],
  ['pages/about/index.md', markdown('About bundle')],
  ['pages/projects.md', markdown('Markdown project')],
  ['index.md', markdown('Duplicate homepage')],
  ['pages/alias.md', markdown('Slug duplicate', '', { slug: 'about' })],
]) {
  test(`rejects ambiguous authored URL from ${path}`, async () => {
    try {
      await write(path, body);
      const result = await build();
      expect(result.code).not.toBe(0);
      expect(result.output).toContain('Duplicate content URL');
      expect(result.output).toContain(path);
    } finally {
      await rm(join(fixtureRoot, 'src/content', path));
    }
  }, 60_000);
}

test('reports invalid Astro metadata and explains the legacy sidebar migration', async () => {
  try {
    await write('pages/invalid.astro', '<p>Missing metadata</p>');
    let result = await build();
    expect(result.code).not.toBe(0);
    expect(result.output).toContain('Invalid exported page metadata');
    await rm(join(fixtureRoot, 'src/content/pages/invalid.astro'));
    await write(
      'pages/invalid.md',
      markdown('Legacy', '', { rightWidgets: ['tag-cloud'] }),
    );
    result = await build();
    expect(result.code).not.toBe(0);
    expect(result.output).toContain('Move rightWidgets');
  } finally {
    await rm(join(fixtureRoot, 'src/content/pages/invalid.astro'), {
      force: true,
    });
    await rm(join(fixtureRoot, 'src/content/pages/invalid.md'), {
      force: true,
    });
  }
}, 60_000);

for (const extension of ['md', 'mdx', 'astro']) {
  test(`rejects unknown ${extension} template IDs with source and available IDs`, async () => {
    const path = `pages/unknown-template.${extension}`;
    const metadata = {
      title: 'Unknown template',
      template: 'missing-template',
    };
    try {
      await write(
        path,
        extension === 'astro'
          ? `---\nexport const page = ${JSON.stringify(metadata)};\n---\n<p>Unknown</p>`
          : markdown(metadata.title, '', metadata),
      );
      const result = await build();
      expect(result.code).not.toBe(0);
      expect(result.output).toContain('Unknown template "missing-template"');
      expect(result.output).toContain(`src/content/${path}`);
      expect(result.output).toContain(
        'Available templates: fixture, default, friend',
      );
    } finally {
      await rm(join(fixtureRoot, 'src/content', path), { force: true });
    }
  }, 60_000);

  test(`reports source and nested fields for invalid ${extension} template metadata`, async () => {
    const path = `pages/invalid-friend.${extension}`;
    const metadata = {
      title: 'Invalid friends',
      template: 'friend',
      friends: [{ name: 123, href: false }],
      categories: [{ id: 123, title: 'Invalid category' }],
      mySite: { name: 'Invalid site', url: null },
    };
    try {
      await write(
        path,
        extension === 'astro'
          ? `---\nexport const page = ${JSON.stringify(metadata)};\n---\n<p>Invalid friends</p>`
          : markdown(metadata.title, 'Invalid friends', metadata),
      );
      const result = await build();
      expect(result.code).not.toBe(0);
      expect(result.output).toContain('Invalid friend template metadata');
      expect(result.output).toContain(`src/content/${path}`);
      for (const field of [
        'friends.0.name',
        'friends.0.href',
        'categories.0.id',
        'mySite.url',
      ]) {
        expect(result.output).toContain(field);
      }
    } finally {
      await rm(join(fixtureRoot, 'src/content', path), { force: true });
    }
  }, 60_000);
}
