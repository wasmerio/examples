/**
 * 主题首屏无闪烁（T8）。
 * 在首帧（第一个 requestAnimationFrame，渲染被样式表阻塞，因此此刻即首次绘制前的状态）读取
 * <html data-theme> 与背景色，确认 head 内联脚本在样式之前就写入了已解析的主题。
 *
 * 服务器由 playwright.config.ts 的 webServer 统一启动（或用 WISP_BASE_URL 指向已有服务器）。
 */
import { test, expect, type Page } from '@playwright/test';

type FirstFrame = {
  meta: string | null;
  colorScheme: string;
  bg: string;
  bodyBg: string | null;
};

declare global {
  interface Window {
    __wispFirstFrame?: FirstFrame;
  }
}

const BASE = ''; // 相对 baseURL
const PATHS = ['/', '/posts/kitchen-sink/'];

/** 在首帧记录 <meta name="color-scheme"> 与背景色；禁用缓存，保证每次都是冷加载。 */
async function firstFrame(page: Page, path: string) {
  await page.route('**/*', (route) => route.continue()); // 拦截所有请求 = 禁用 HTTP 缓存
  await page.addInitScript(() => {
    requestAnimationFrame(() => {
      const html = document.documentElement;
      const meta = document.head.querySelector('meta[name="color-scheme"]');
      window.__wispFirstFrame = {
        meta: meta?.getAttribute('content') ?? null,
        colorScheme: getComputedStyle(html).colorScheme,
        bg: getComputedStyle(html).backgroundColor,
        bodyBg: document.body ? getComputedStyle(document.body).backgroundColor : null,
      };
    });
  });
  await page.goto(BASE + path, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__wispFirstFrame);
  const frame = await page.evaluate(() => window.__wispFirstFrame);
  if (!frame) throw new Error('first-frame probe did not run');
  return frame;
}

/** rgb(a) / color(srgb …) → 相对亮度 0..1 */
function luminance(css: string): number {
  const nums = css.match(/[\d.]+/g)!.map(Number);
  const [r, g, b] = css.startsWith('color(')
    ? nums.slice(0, 3)
    : nums.slice(0, 3).map((v) => v / 255);
  const lin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r!) + 0.7152 * lin(g!) + 0.0722 * lin(b!);
}

for (const path of PATHS) {
  test.describe(`首帧主题 ${path}`, () => {
    test('localStorage=dark → 首帧即暗色', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'light' });
      await page.addInitScript(() => localStorage.setItem('color-scheme', 'dark'));
      const f = await firstFrame(page, path);
      expect(f.meta).toBe('dark');
      expect(f.colorScheme).toBe('dark');
      expect(luminance(f.bg)).toBeLessThan(0.05);
    });

    test('system + prefers-color-scheme: dark → 首帧即暗色', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'dark' });
      const f = await firstFrame(page, path);
      expect(f.meta).toBe('light dark');
      expect(luminance(f.bg)).toBeLessThan(0.05);
    });

    test('localStorage=light 覆盖系统暗色 → 首帧即亮色', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.addInitScript(() => localStorage.setItem('color-scheme', 'light'));
      const f = await firstFrame(page, path);
      expect(f.meta).toBe('light');
      expect(f.colorScheme).toBe('light');
      expect(luminance(f.bg)).toBeGreaterThan(0.8);
    });

    test('system + prefers-color-scheme: light → 首帧即亮色', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'light' });
      const f = await firstFrame(page, path);
      expect(f.meta).toBe('light dark');
      expect(luminance(f.bg)).toBeGreaterThan(0.8);
    });
  });
}

test('双态主题按钮在明暗间切换，切回系统一致时清除覆盖并跟随系统变化', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.addInitScript(() => {
    if (!sessionStorage.getItem('seeded')) {
      localStorage.setItem('color-scheme', 'light');
      sessionStorage.setItem('seeded', '1');
    }
  });
  await page.goto(BASE + '/');
  const btn = page.locator('[data-wisp-theme-toggle]');
  const meta = page.locator('head meta[name="color-scheme"]');
  const bgLum = async () =>
    luminance(
      await page.evaluate(() => getComputedStyle(document.documentElement).backgroundColor),
    );
  const shown = () =>
    btn.evaluate((b) =>
      [...b.querySelectorAll('svg')]
        .filter((i) => getComputedStyle(i).display !== 'none')
        .map((i) => i.getAttribute('class')),
    );

  await expect(meta).toHaveAttribute('content', 'light');
  await expect(btn).toHaveAttribute('aria-pressed', 'false');
  expect(await shown()).toEqual(['wisp-icon i-light']);
  expect(await bgLum()).toBeGreaterThan(0.8);

  // 点击切到暗色（与暗色系统一致）→ 删除 localStorage 覆盖并恢复 light dark
  await btn.click();
  await expect(meta).toHaveAttribute('content', 'light dark');
  await expect(btn).toHaveAttribute('aria-pressed', 'true');
  expect(await shown()).toEqual(['wisp-icon i-dark']);
  expect(await page.evaluate(() => localStorage.getItem('color-scheme'))).toBeNull();
  expect(await bgLum()).toBeLessThan(0.05);

  // 未覆盖时跟随系统切换
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(btn).toHaveAttribute('aria-pressed', 'false');
  expect(await shown()).toEqual(['wisp-icon i-light']);
  expect(await bgLum()).toBeGreaterThan(0.8);

  // 再次点击写入 dark 覆盖，刷新保持暗色
  await btn.click();
  await expect(meta).toHaveAttribute('content', 'dark');
  expect(await page.evaluate(() => localStorage.getItem('color-scheme'))).toBe('dark');
  await page.reload();
  await expect(meta).toHaveAttribute('content', 'dark');
  expect(await bgLum()).toBeLessThan(0.05);
});

test('无 JS 时也能通过 light-dark() 与 meta[name=color-scheme] 原生响应系统暗色', async ({
  browser,
}) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false, colorScheme: 'dark' });
  const page = await ctx.newPage();
  await page.goto(BASE + '/');
  const bg = await page.evaluate(() => getComputedStyle(document.documentElement).backgroundColor);
  expect(luminance(bg)).toBeLessThan(0.05);
  await ctx.close();
});

test('键盘：首个 Tab 聚焦“跳到正文”，回车后焦点进入 main', async ({ page }) => {
  await page.goto(BASE + '/posts/kitchen-sink/');
  await page.keyboard.press('Tab');
  const skip = page.locator('a.wisp-skip');
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main$/);
  await expect(page.locator('#main')).toBeFocused();
});
