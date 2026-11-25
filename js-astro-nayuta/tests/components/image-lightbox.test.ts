import { afterAll, beforeAll, expect, test } from 'bun:test';
import { cp, mkdtemp, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { openChromium } from '../fixtures/chromium';

const repository = join(import.meta.dir, '../..');
const chrome =
  process.env.CHROME_BIN ??
  Bun.which('chromium') ??
  Bun.which('google-chrome') ??
  ((await Bun.file(
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ).exists())
    ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    : undefined);
const svg = (width: number, height: number) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="#3890c8"/><circle cx="50%" cy="50%" r="20%" fill="#abb5c4"/></svg>`;
let fixture: string;
let server: ReturnType<typeof Bun.serve>;
let largeRequests = 0;
let releaseSlow = () => {};
let slowGate = Promise.resolve();

beforeAll(async () => {
  fixture = await mkdtemp(join(tmpdir(), 'nayuta-lightbox-'));
  await Promise.all(
    ['src', 'astro.config.ts', 'package.json', 'tsconfig.json'].map((path) =>
      cp(join(repository, path), join(fixture, path), { recursive: true }),
    ),
  );
  await symlink(
    join(repository, 'node_modules'),
    join(fixture, 'node_modules'),
    'dir',
  );
  await rm(join(fixture, 'src/content'), { recursive: true });
  await Bun.write(
    join(fixture, 'src/content/index.md'),
    '---\ntitle: Test\n---\nTest.',
  );
  await Bun.write(join(fixture, 'public/thumb.svg'), svg(640, 360));
  await cp(
    join(repository, 'tests/fixtures/image-lightbox.astro'),
    join(fixture, 'src/pages/lightbox-test.astro'),
  );
  for (const [path, pattern] of [
    ['src/assets/styles/global.css', /^@import url\([^\n]+;$/gm],
    ['src/layouts/head-base.astro', /<link\s[^>]*href="https:[\s\S]*?\/>/g],
  ] as const) {
    const file = Bun.file(join(fixture, path));
    await Bun.write(file, (await file.text()).replace(pattern, ''));
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
  server = Bun.serve({
    hostname: '127.0.0.1',
    port: 0,
    async fetch(request) {
      const { pathname } = new URL(request.url);
      if (pathname === '/large.svg') {
        largeRequests++;
        return new Response(svg(1600, 900), {
          headers: { 'content-type': 'image/svg+xml' },
        });
      }
      if (pathname === '/slow.svg') {
        await slowGate;
        return new Response(svg(600, 1000), {
          headers: { 'content-type': 'image/svg+xml' },
        });
      }
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
}, 60_000);
afterAll(async () => {
  releaseSlow();
  server?.stop(true);
  if (fixture) await rm(fixture, { recursive: true, force: true });
});

for (const width of [390, 768, 769, 1120, 1121, 1440]) {
  test.skipIf(!chrome)(
    `lightbox: lazy core, decoding, navigation, failure, focus and theme at ${width}px`,
    async () => {
      slowGate = new Promise((resolve) => {
        releaseSlow = resolve;
      });
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
      async function key(key: string) {
        const windowsVirtualKeyCode =
          {
            ArrowDown: 40,
            ArrowRight: 39,
            Escape: 27,
            Tab: 9,
            Enter: 13,
            ' ': 32,
            z: 90,
          }[key] ?? 0;
        await browser.send('Input.dispatchKeyEvent', {
          type: 'keyDown',
          key,
          text: key === 'Enter' ? '\r' : key === ' ' ? ' ' : undefined,
          windowsVirtualKeyCode,
        });
        await browser.send('Input.dispatchKeyEvent', {
          type: 'keyUp',
          key,
          windowsVirtualKeyCode,
        });
      }
      async function openOriginal(activationKey: string) {
        await evaluate(`
          window.originalImageOpen = { open: window.open, calls: [] };
          window.open = (...args) => {
            window.originalImageOpen.calls.push(args);
            return null;
          };
          document.querySelector('.pswp__button--original').focus();
        `);
        try {
          await key(activationKey);
          return await evaluate('window.originalImageOpen.calls');
        } finally {
          await evaluate(`
            window.open = window.originalImageOpen.open;
            delete window.originalImageOpen;
          `);
        }
      }
      try {
        const before = largeRequests;
        await browser.send('Emulation.setDeviceMetricsOverride', {
          width,
          height: 900,
          deviceScaleFactor: 1,
          mobile: width < 768,
        });
        await browser.send('Page.navigate', {
          url: `${server.url}lightbox-test/`,
        });
        await until(
          `document.querySelector('#first .ny-image-open') && document.querySelector('#first nayuta-image').dataset.state === 'ready'`,
        );
        expect(largeRequests).toBe(before);
        expect(
          await evaluate(
            `performance.getEntriesByType('resource').some(entry => /photoswipe.*\\.js/.test(entry.name))`,
          ),
        ).toBe(false);
        expect(
          await evaluate(
            `document.querySelectorAll('#off .ny-image-open, #linked .ny-image-open').length`,
          ),
        ).toBe(0);
        await evaluate(
          `document.querySelector('#first .ny-image-open').focus(); document.querySelector('#first .ny-image-open').click()`,
        );
        await until(
          `document.querySelector('.pswp img.ny-lightbox-image-ready') && document.activeElement?.classList.contains('pswp__button--close')`,
        );
        expect(
          await evaluate(
            `document.querySelector('.pswp').getAttribute('aria-modal')`,
          ),
        ).toBe('true');
        expect(
          await evaluate(
            `document.querySelector('.main-region').closest('.layout-container').inert`,
          ),
        ).toBe(true);
        expect(
          await evaluate(
            `document.querySelector('.pswp__caption').textContent`,
          ),
        ).toBe('A quiet landscape');
        expect(
          await evaluate(`(() => {
            const original = document.querySelector('.pswp__button--original');
            const close = document.querySelector('.pswp__button--close');
            return {
              tag: original.tagName,
              type: original.type,
              matchingHeight: original.getBoundingClientRect().height === close.getBoundingClientRect().height,
              matchingLineHeight: getComputedStyle(original).lineHeight === getComputedStyle(close).lineHeight,
            };
          })()`),
        ).toEqual({
          tag: 'BUTTON',
          type: 'button',
          matchingHeight: true,
          matchingLineHeight: true,
        });
        expect(await openOriginal('Enter')).toEqual([
          ['/large.svg', '_blank', 'noopener,noreferrer'],
        ]);
        expect(
          await evaluate(
            `document.querySelector('.pswp__counter').textContent`,
          ),
        ).toBe('1 / 3');
        expect(
          await evaluate(`getComputedStyle(document.documentElement).overflow`),
        ).toBe('hidden');
        const beforeZoom = await evaluate(
          `document.querySelector('.pswp__item[aria-hidden="false"] .pswp__zoom-wrap').style.transform`,
        );
        await key('z');
        await until(
          `document.querySelector('.pswp__item[aria-hidden="false"] .pswp__zoom-wrap').style.transform !== ${JSON.stringify(beforeZoom)}`,
        );
        await key('z');
        await key('Tab');
        expect(
          await evaluate(`Boolean(document.activeElement.closest('.pswp'))`),
        ).toBe(true);
        if (width === 390) {
          await browser.send('Emulation.setTouchEmulationEnabled', {
            enabled: true,
          });
          await browser.send('Input.dispatchTouchEvent', {
            type: 'touchStart',
            touchPoints: [{ x: 310, y: 420 }],
          });
          for (const x of [260, 190, 110, 40]) {
            await browser.send('Input.dispatchTouchEvent', {
              type: 'touchMove',
              touchPoints: [{ x, y: 420 }],
            });
            await Bun.sleep(20);
          }
          await browser.send('Input.dispatchTouchEvent', {
            type: 'touchEnd',
            touchPoints: [],
          });
        } else await key('ArrowRight');
        await until(
          `document.querySelector('.pswp__counter')?.textContent === '2 / 3'`,
        );
        expect(
          await evaluate(
            `document.querySelectorAll('.pswp img[src$="/slow.svg"]').length`,
          ),
        ).toBe(0);
        expect(
          await evaluate(
            `Boolean(document.querySelector('.pswp__img--placeholder'))`,
          ),
        ).toBe(true);
        releaseSlow();
        await until(
          `document.querySelector('.pswp img[src$="/slow.svg"]')?.dataset.nyDecoded === 'true'`,
        );
        expect(await openOriginal(' ')).toEqual([
          ['/slow.svg', '_blank', 'noopener,noreferrer'],
        ]);
        expect(
          await evaluate(
            `(() => { const image = document.querySelector('.pswp img[src$="/slow.svg"]'); return Math.abs(image.width / image.height - 0.6) < 0.01; })()`,
          ),
        ).toBe(true);
        await key('ArrowRight');
        await until(
          `document.querySelector('.pswp__counter')?.textContent === '3 / 3' && document.querySelector('.ny-lightbox-error')`,
        );
        expect(
          await evaluate(
            `document.querySelector('.ny-lightbox-error').getAttribute('aria-label')`,
          ),
        ).toContain('Unavailable original');
        expect(
          await evaluate(
            `getComputedStyle(document.querySelector('.ny-lightbox-error')).color`,
          ),
        ).toBe('rgb(248, 113, 113)');
        await key('Escape');
        await until(`!document.querySelector('.pswp')`);
        expect(
          await evaluate(
            `document.activeElement === document.querySelector('#first .ny-image-open')`,
          ),
        ).toBe(true);
        expect(await evaluate(`document.documentElement.style.overflow`)).toBe(
          '',
        );
        expect(
          await evaluate(`document.querySelector('.layout-container').inert`),
        ).toBe(false);
        await browser.send('Emulation.setEmulatedMedia', {
          features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
        });
        await evaluate(
          `document.querySelector('#first .ny-image-open').click()`,
        );
        await until(
          `document.querySelector('.pswp img.ny-lightbox-image-ready')`,
        );
        expect(
          await evaluate(
            `getComputedStyle(document.querySelector('.pswp img.ny-lightbox-image-ready')).animationName`,
          ),
        ).toBe('none');
        for (const theme of [
          'nayuta',
          'nayuta-aqua',
          'midnight-blue',
          'oled-dark',
          'sakura-pink',
        ]) {
          const css = await Bun.file(
            join(repository, `src/assets/styles/themes/${theme}.css`),
          ).text();
          await evaluate(
            `{ document.getElementById('test-palette')?.remove(); const style = document.createElement('style'); style.id = 'test-palette'; style.textContent = ${JSON.stringify(css)}; document.head.append(style); }`,
          );
          expect(
            await evaluate(
              `getComputedStyle(document.querySelector('.pswp__bg')).backgroundColor === getComputedStyle(document.body).backgroundColor`,
            ),
          ).toBe(true);
          if (process.env.NAYUTA_TEST_ARTIFACTS) {
            const shot = await browser.send('Page.captureScreenshot', {
              format: 'png',
            });
            await Bun.write(
              join(
                process.env.NAYUTA_TEST_ARTIFACTS,
                `lightbox-${width}-${theme}.png`,
              ),
              Buffer.from(shot.data, 'base64'),
            );
          }
        }
        await evaluate(
          `document.querySelector('.pswp__button--close').click()`,
        );
        await until(`!document.querySelector('.pswp')`);
        await evaluate(
          `document.querySelector('#first figcaption').textContent = 'Long description. '.repeat(200); document.querySelector('#first .ny-image-open').click()`,
        );
        await until(
          `document.querySelector('.pswp__caption')?.scrollHeight > document.querySelector('.pswp__caption')?.clientHeight`,
        );
        await until(
          `document.activeElement?.classList.contains('pswp__button--close')`,
        );
        await evaluate(`document.querySelector('.pswp__caption').focus()`);
        await key('ArrowDown');
        await until(`document.querySelector('.pswp__caption').scrollTop > 0`);
        await key('Escape');
        await until(`!document.querySelector('.pswp')`);
      } finally {
        releaseSlow();
        await browser.close();
      }
    },
    30_000,
  );
}
