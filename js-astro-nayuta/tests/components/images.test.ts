import { afterAll, beforeAll, expect, test } from 'bun:test';
import { cp, mkdtemp, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { resolveImageDimensions } from '../../src/assets/utils/image-metadata';
import { openChromium } from '../fixtures/chromium';

const root = join(import.meta.dir, '../..');
const chrome =
  process.env.CHROME_BIN ??
  Bun.which('chromium') ??
  Bun.which('google-chrome') ??
  ((await Bun.file(
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ).exists())
    ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    : undefined);
const landscape =
  '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="640" height="360" fill="#3890c8"/></svg>';
const portrait =
  '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="480"><rect width="240" height="480" fill="#f87171"/></svg>';
let fixture: string;
let server: ReturnType<typeof Bun.serve>;
let runtime = false;
let farRequests = 0;
let releaseRemote: () => void;
let remoteGate: Promise<void>;
let releasePartial: () => void;
let partialGate: Promise<void>;
let partialStarted = false;
const partialBytes = new Uint8Array(
  await Bun.file(join(root, 'public/assets/images/banner.png')).arrayBuffer(),
);

beforeAll(async () => {
  fixture = await mkdtemp(join(tmpdir(), 'nayuta-images-'));
  await Promise.all(
    ['src', 'astro.config.ts', 'package.json', 'tsconfig.json'].map((path) =>
      cp(join(root, path), join(fixture, path), { recursive: true }),
    ),
  );
  await symlink(
    join(root, 'node_modules'),
    join(fixture, 'node_modules'),
    'dir',
  );
  await rm(join(fixture, 'src/content'), { recursive: true });
  await Bun.write(
    join(fixture, 'src/content/index.md'),
    '---\ntitle: Test\n---\nTest.',
  );
  remoteGate = new Promise((resolve) => {
    releaseRemote = resolve;
  });
  partialGate = new Promise((resolve) => {
    releasePartial = resolve;
  });
  server = Bun.serve({
    hostname: '127.0.0.1',
    port: 0,
    async fetch(request) {
      const url = new URL(request.url);
      if (url.pathname === '/partial.png') {
        const stream = new ReadableStream<Uint8Array>({
          async start(controller) {
            const split = Math.floor(partialBytes.length / 2);
            controller.enqueue(partialBytes.slice(0, split));
            partialStarted = true;
            await partialGate;
            controller.enqueue(partialBytes.slice(split));
            controller.close();
          },
        });
        return new Response(stream, {
          headers: { 'content-type': 'image/png' },
        });
      }
      if (url.pathname === '/runtime.svg') {
        if (!runtime)
          return new Response('Offline at build time', { status: 503 });
        await remoteGate;
        return new Response(portrait, {
          headers: { 'content-type': 'image/svg+xml' },
        });
      }
      if (url.pathname === '/far.svg') {
        farRequests++;
        return new Response(landscape, {
          headers: { 'content-type': 'image/svg+xml' },
        });
      }
      const pathname = decodeURIComponent(url.pathname);
      const file = Bun.file(
        join(
          fixture,
          'dist',
          pathname.endsWith('/') ? `${pathname}index.html` : pathname,
        ),
      );
      return (await file.exists())
        ? new Response(file)
        : new Response('Missing', { status: 404 });
    },
  });
  await Bun.write(join(fixture, 'public/landscape.svg'), landscape);
  await Bun.write(join(fixture, 'public/portrait.svg'), portrait);
  await Bun.write(
    join(fixture, 'src/pages/assets/image-test-portrait.svg'),
    portrait,
  );
  await Bun.write(
    join(fixture, 'src/pages/image-test.astro'),
    (await Bun.file(join(root, 'tests/fixtures/images.astro')).text()).replace(
      '__REMOTE_IMAGE__',
      `${server.url}runtime.svg`,
    ),
  );
  for (const [path, pattern] of [
    ['src/assets/styles/global.css', /^@import url\([^\n]+;$/gm],
    ['src/layouts/head-base.astro', /<link\s[^>]*href="https:[\s\S]*?\/>/g],
  ] as const) {
    const file = Bun.file(join(fixture, path));
    await Bun.write(file, (await file.text()).replace(pattern, ''));
  }

  for (const extension of ['md', 'mdx']) {
    await Bun.write(
      join(fixture, `src/content/pages/images-${extension}/index.${extension}`),
      `---\ntitle: Markdown images\n---\n\n![Public landscape](/landscape.svg)\n\n![Bundled portrait](./portrait.svg)\n\nBefore ![Inline](/landscape.svg) after.\n\n[![Linked](/landscape.svg)](/demo)\n\n![Remote fallback](${server.url}runtime.svg)\n`,
    );
    await Bun.write(
      join(fixture, `src/content/pages/images-${extension}/portrait.svg`),
      portrait,
    );
  }

  const build = Bun.spawn(['bun', 'run', 'build'], {
    cwd: fixture,
    stdout: 'pipe',
    stderr: 'pipe',
  });
  const [code, out, err] = await Promise.all([
    build.exited,
    new Response(build.stdout).text(),
    new Response(build.stderr).text(),
  ]);
  expect(code, out + err).toBe(0);
  runtime = true;
}, 60_000);

afterAll(async () => {
  releaseRemote?.();
  releasePartial?.();
  server?.stop(true);
  if (fixture) await rm(fixture, { recursive: true, force: true });
});

test('image sizes respect explicit dimensions, local metadata and remote failure', async () => {
  expect(
    await resolveImageDimensions('/landscape.svg', { root: fixture }),
  ).toEqual({ width: 640, height: 360 });
  expect(
    await resolveImageDimensions('missing', { width: 12, height: 24 }),
  ).toEqual({ width: 12, height: 24 });
  expect(
    await resolveImageDimensions(`${server.url}missing.svg`),
  ).toBeUndefined();
  expect(
    await resolveImageDimensions('/missing.svg', { root: fixture }),
  ).toBeUndefined();
  const html = await Bun.file(
    join(fixture, 'dist/image-test/index.html'),
  ).text();
  expect(html).toContain('width="640" height="360"');
  expect(html).toContain('width="320" height="180"');
  let importedSource = '';
  await new HTMLRewriter()
    .on('img[alt="Imported SVG"]', {
      element(element) {
        importedSource = element.getAttribute('src') ?? '';
      },
    })
    .transform(new Response(html))
    .text();
  expect(importedSource).toMatch(/^\/_astro\/.+\.svg$/);
  expect(html).toContain('--ny-image-ratio:16 / 9');
});

test('Markdown and MDX preserve local assets, dimensions, links and valid paragraphs', async () => {
  for (const extension of ['md', 'mdx']) {
    const html = await Bun.file(
      join(fixture, `dist/images-${extension}/index.html`),
    ).text();
    expect(html).toContain('--ny-image-ratio:240 / 480');
    expect(html).toContain('--ny-image-ratio:640 / 360');
    expect(html).toContain(`${server.url}runtime.svg`);
    let count = 0;
    let invalid = 0;
    let bundledSource = '';
    await new HTMLRewriter()
      .on('img[alt="Bundled portrait"]', {
        element(element) {
          bundledSource = element.getAttribute('src') ?? '';
        },
      })
      .on('nayuta-image', {
        element() {
          count++;
        },
      })
      .on('p div', {
        element() {
          invalid++;
        },
      })
      .transform(new Response(html))
      .text();
    expect(count).toBe(5);
    expect(invalid).toBe(0);
    expect(bundledSource).toMatch(/^\/_astro\/.+\.svg$/);
    expect(await Bun.file(join(fixture, 'dist', bundledSource)).exists()).toBe(
      true,
    );
    expect(html).toMatch(/href="\/demo"[^>]*><nayuta-image/);
  }
});

test.skipIf(!chrome)(
  'browser: reserved space, lazy requests, decoded reveal, runtime sizes and errors',
  async () => {
    const browser = await openChromium(
      chrome!,
      await mkdtemp(join(fixture, 'chrome-')),
    );
    async function evaluate(expression: string) {
      const result = await browser.send('Runtime.evaluate', {
        expression,
        returnByValue: true,
        awaitPromise: true,
      });
      if (result.exceptionDetails)
        throw new Error(JSON.stringify(result.exceptionDetails));
      return result.result.value;
    }
    async function until(expression: string) {
      for (let i = 0; i < 100; i++) {
        if (await evaluate(expression)) return;
        await Bun.sleep(50);
      }
      throw new Error(`Timed out: ${expression}`);
    }
    try {
      await browser.send('Emulation.setDeviceMetricsOverride', {
        width: 900,
        height: 900,
        deviceScaleFactor: 1,
        mobile: false,
      });
      await browser.send('Page.navigate', { url: `${server.url}image-test/` });
      await until(
        `document.querySelector('#known nayuta-image')?.dataset.state === 'ready'`,
      );
      expect(
        await evaluate(
          `getComputedStyle(document.querySelector('#unknown img')).opacity`,
        ),
      ).toBe('0');
      expect(
        await evaluate(
          `getComputedStyle(document.querySelector('#unknown .ny-image-placeholder')).aspectRatio`,
        ),
      ).toBe('16 / 9');
      expect(
        await evaluate(
          `getComputedStyle(document.querySelector('#unknown .ny-image-placeholder')).animationName`,
        ),
      ).toBe('ny-image-pulse');
      expect(farRequests).toBe(0);
      await until(
        `document.querySelector('#imported nayuta-image')?.dataset.state === 'ready'`,
      );
      expect(
        await evaluate(
          `document.querySelector('#imported img').getAttribute('width')`,
        ),
      ).toBe('120');
      expect(
        await evaluate(
          `document.querySelector('#imported img').getAttribute('height')`,
        ),
      ).toBe('240');
      await until(
        `document.querySelector('#broken nayuta-image')?.dataset.state === 'error'`,
      );
      expect(
        await evaluate(
          `document.querySelector('#broken .ny-image-error')?.getAttribute('aria-label')`,
        ),
      ).toContain('Missing image');
      expect(
        await evaluate(
          `getComputedStyle(document.querySelector('#broken .ny-image-placeholder')).animationName`,
        ),
      ).toBe('none');
      expect(partialStarted).toBe(true);
      expect(
        await evaluate(`document.querySelector('#partial img').complete`),
      ).toBe(false);
      expect(
        await evaluate(
          `getComputedStyle(document.querySelector('#partial img')).opacity`,
        ),
      ).toBe('0');
      releasePartial();
      await until(
        `document.querySelector('#partial nayuta-image')?.dataset.state === 'ready'`,
      );
      releaseRemote();
      await until(
        `document.querySelector('#unknown nayuta-image')?.dataset.state === 'ready'`,
      );
      expect(
        await evaluate(
          `getComputedStyle(document.querySelector('#unknown .ny-image-placeholder')).aspectRatio`,
        ),
      ).toBe('240 / 480');
      expect(
        await evaluate(
          `getComputedStyle(document.querySelector('#known img')).transitionTimingFunction`,
        ),
      ).toBe('ease-in');
      expect(
        await evaluate(
          `getComputedStyle(document.querySelector('#known img')).transitionDuration`,
        ),
      ).toBe('0.18s');
      expect(
        await evaluate(
          `getComputedStyle(document.querySelector('#fixed .ny-image-placeholder')).aspectRatio`,
        ),
      ).toBe('16 / 9');
      await until(
        `document.querySelector('#raw nayuta-image')?.dataset.state === 'ready' && document.querySelector('#picture nayuta-image')?.dataset.state === 'ready'`,
      );
      expect(
        await evaluate(
          `getComputedStyle(document.querySelector('#picture img')).opacity`,
        ),
      ).not.toBeUndefined();
      expect(
        await evaluate(
          `document.querySelector('#picture source').srcset.endsWith('/portrait.svg')`,
        ),
      ).toBe(true);
      await evaluate(`document.querySelector('#far').scrollIntoView()`);
      await until(
        `document.querySelector('#far nayuta-image')?.dataset.state === 'ready'`,
      );
      expect(farRequests).toBeGreaterThan(0);
      await evaluate(
        `document.querySelector('#broken img').src = '/portrait.svg'`,
      );
      await until(
        `document.querySelector('#broken nayuta-image')?.dataset.state === 'ready'`,
      );
      expect(
        await evaluate(
          `Boolean(document.querySelector('#broken .ny-image-error'))`,
        ),
      ).toBe(false);
      await evaluate(
        `{ const host = document.querySelector('#known nayuta-image'); const parent = host.parentElement; host.remove(); parent.append(host); }`,
      );
      await until(
        `document.querySelector('#known nayuta-image')?.dataset.state === 'ready'`,
      );
      await browser.send('Emulation.setEmulatedMedia', {
        features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
      });
      expect(
        await evaluate(
          `getComputedStyle(document.querySelector('#known img')).transitionDuration`,
        ),
      ).toBe('0s');
      await browser.send('Emulation.setScriptExecutionDisabled', {
        value: true,
      });
      await browser.send('Page.navigate', { url: `${server.url}image-test/` });
      await until(`document.querySelector('#known img')?.complete`);
      expect(
        await evaluate(
          `getComputedStyle(document.querySelector('#known img')).opacity`,
        ),
      ).toBe('1');
      expect(
        await evaluate(
          `getComputedStyle(document.querySelector('#known .ny-image-placeholder')).display`,
        ),
      ).toBe('none');
    } finally {
      await browser.close();
    }
  },
  30_000,
);
