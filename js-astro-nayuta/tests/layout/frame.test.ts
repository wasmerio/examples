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
let homeHtml: string;
let optOutHtml: string;
let customHeaderHtml: string;
let server: ReturnType<typeof Bun.serve>;

beforeAll(async () => {
  fixtureRoot = await mkdtemp(join(tmpdir(), 'nayuta-frame-'));
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
  await Bun.write(
    join(fixtureRoot, 'src/content/_left.astro'),
    '<p>Sidebar remains</p>',
  );
  await Bun.write(
    join(fixtureRoot, 'src/pages/frame-opt-out.astro'),
    `---
import Frame from '../layouts/frame.astro';
---
<Frame title="No profile" withProfileCard={false}>
  <p>Page content</p>
</Frame>
`,
  );
  await Bun.write(
    join(fixtureRoot, 'src/pages/frame-custom-header.astro'),
    `---
import Frame from '../layouts/frame.astro';
---
<Frame title="Custom header" withProfileCard={false}>
  <p slot="left-header">Custom identity</p>
  <p>Page content</p>
</Frame>
`,
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

  homeHtml = await Bun.file(join(fixtureRoot, 'dist/index.html')).text();
  optOutHtml = await Bun.file(
    join(fixtureRoot, 'dist/frame-opt-out/index.html'),
  ).text();
  customHeaderHtml = await Bun.file(
    join(fixtureRoot, 'dist/frame-custom-header/index.html'),
  ).text();
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

test('Frame shows one profile card with an accessible home link by default', () => {
  expect(homeHtml.match(/class="profile-card"/g)).toHaveLength(1);
  expect(homeHtml).toMatch(
    /<a class="avatar-link" href="\/" aria-label="Go to homepage"[^>]*><img class="avatar"/,
  );
});

test('Frame can omit the profile without removing sidebar content or leaving a header', () => {
  expect(optOutHtml).toContain('class="left-region"');
  expect(optOutHtml).toContain('Sidebar remains');
  expect(optOutHtml).not.toContain('class="profile-card"');
  expect(optOutHtml).not.toContain('class="left-header"');
});

test('Frame retains a custom left header when the default profile is hidden', () => {
  expect(customHeaderHtml).toContain('class="left-header"');
  expect(customHeaderHtml).toContain('Custom identity');
  expect(customHeaderHtml).not.toContain('class="profile-card"');
});

for (const width of [390, 800, 1280]) {
  test.skipIf(!chrome)(
    `profile stays usable at ${width}px`,
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
        await browser.send('Page.navigate', { url: `${server.url}posts/` });
        let layout: {
          ready?: boolean;
          card?: { left: number; right: number; bottom: number };
          avatar?: { width: number; height: number };
          main?: { left: number; top: number };
          scrollWidth?: number;
        } = {};
        for (let attempt = 0; attempt < 100; attempt++) {
          const evaluation = await browser.send('Runtime.evaluate', {
            expression: `(() => {
            const card = document.querySelector('.profile-card');
            const avatar = document.querySelector('.avatar-link');
            const main = document.querySelector('.main-region');
            return {
              ready: document.readyState === 'complete' && !!card,
              card: card?.getBoundingClientRect().toJSON(),
              avatar: avatar?.getBoundingClientRect().toJSON(),
              main: main?.getBoundingClientRect().toJSON(),
              scrollWidth: document.documentElement.scrollWidth,
            };
          })()`,
            returnByValue: true,
          });
          layout = evaluation.result.value ?? {};
          if (layout.ready) break;
          await Bun.sleep(50);
        }
        expect(layout.ready).toBe(true);
        expect(layout.avatar?.width).toBeGreaterThan(0);
        expect(layout.avatar?.height).toBeGreaterThan(0);
        expect(layout.scrollWidth).toBeLessThanOrEqual(width);
        if (width <= 768) {
          expect(layout.card!.bottom).toBeLessThanOrEqual(layout.main!.top);
        } else {
          expect(layout.card!.right).toBeLessThanOrEqual(layout.main!.left);
        }

        if (process.env.NAYUTA_TEST_ARTIFACTS) {
          const { data } = await browser.send('Page.captureScreenshot', {
            format: 'png',
          });
          await Bun.write(
            join(process.env.NAYUTA_TEST_ARTIFACTS, `profile-${width}.png`),
            Buffer.from(data, 'base64'),
          );
        }

        await browser.send('Runtime.evaluate', {
          expression: `document.querySelector('.avatar-link').click()`,
        });
        let pathname = '';
        for (let attempt = 0; attempt < 100; attempt++) {
          const evaluation = await browser.send('Runtime.evaluate', {
            expression: 'location.pathname',
            returnByValue: true,
          });
          pathname = evaluation.result.value ?? '';
          if (pathname === '/') break;
          await Bun.sleep(50);
        }
        expect(pathname).toBe('/');
      } finally {
        await browser.close();
      }
    },
    30_000,
  );
}
