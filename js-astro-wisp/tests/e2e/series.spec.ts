import { test, expect } from '@playwright/test';

const POST = '/posts/series-demo/01-score/';

declare global {
  interface Window {
    __seriesFirst?: { attr: string | undefined; display: string };
  }
}

test('1440px 系列栏默认收起，打开后刷新保持且首帧不闪烁', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(POST);
  await page.evaluate(() => localStorage.removeItem('wisp-series-open'));
  await page.reload();

  const rail = page.locator('.wisp-series-aside .wisp-rail-scroll');
  const toggle = page.locator('.wisp-series-aside [data-series-toggle]');
  await expect(page.locator('html')).toHaveAttribute('data-series', 'collapsed');
  await expect(rail).toBeHidden();

  await toggle.click();
  await expect(page.locator('html')).toHaveAttribute('data-series', 'open');
  await expect(rail).toBeVisible();
  await expect(page.locator('.wisp-series-aside a[aria-current="page"]')).toBeInViewport();

  await page.addInitScript(() => {
    requestAnimationFrame(() => {
      window.__seriesFirst = {
        attr: document.documentElement.dataset.series,
        display: getComputedStyle(document.querySelector('.wisp-series-aside .wisp-rail-scroll')!)
          .display,
      };
    });
  });
  await page.reload();
  await page.waitForFunction(() => window.__seriesFirst);
  expect(await page.evaluate(() => window.__seriesFirst)).toEqual({
    attr: 'open',
    display: 'block',
  });
  await expect(page.locator('.wisp-series-aside a[aria-current="page"]')).toBeInViewport();

  const metrics = await page.evaluate(() => {
    const toggle = document.querySelector<HTMLElement>('.wisp-series-aside [data-series-toggle]')!;
    const scrollBox = document.querySelector<HTMLElement>('.wisp-series-aside [data-rail-scroll]')!;
    const list = document.querySelector<HTMLElement>('.wisp-series-aside ol#wisp-series-list')!;
    const firstLink = list.querySelector<HTMLElement>('li:first-child > a')!;
    const firstText = firstLink.querySelector<HTMLElement>('.wisp-series-text')!;
    const secondNo = list.querySelector<HTMLElement>('li:nth-child(2) .wisp-series-no')!;
    const active = list.querySelector<HTMLElement>('a[aria-current="page"]')!;
    const before = getComputedStyle(active, '::before');
    return {
      hasFirstNo: Boolean(firstLink.querySelector('.wisp-series-no')),
      toggleX: toggle.getBoundingClientRect().left,
      firstTextX: firstText.getBoundingClientRect().left,
      secondNoX: secondNo.getBoundingClientRect().left,
      listBorderLeft: getComputedStyle(list).borderLeftWidth,
      scrollbarWidth: getComputedStyle(scrollBox).scrollbarWidth,
      tickWidth: before.width,
      tickLeftOffset: parseFloat(before.insetInlineStart || before.left),
      scrollBoxLeft: scrollBox.getBoundingClientRect().left,
      activeLeft: active.getBoundingClientRect().left,
    };
  });
  expect(metrics.hasFirstNo).toBe(false);
  expect(Math.abs(metrics.firstTextX - metrics.toggleX)).toBeLessThan(1);
  expect(Math.abs(metrics.secondNoX - metrics.toggleX)).toBeLessThan(1);
  expect(metrics.listBorderLeft).toBe('0px');
  expect(metrics.scrollbarWidth).toBe('none');
  expect(metrics.tickWidth).toBe('2px');
  expect(metrics.activeLeft + metrics.tickLeftOffset).toBeGreaterThanOrEqual(metrics.scrollBoxLeft);
});

test('书眉位置按钮切换系列栏', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(POST);
  const headerToggle = page.locator('.wisp-running-toggle');
  await expect(headerToggle).toBeVisible();
  await expect(headerToggle).toHaveAttribute('aria-expanded', 'false');
  await headerToggle.click();
  await expect(headerToggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('html')).toHaveAttribute('data-series', 'open');
  await headerToggle.click();
  await expect(headerToggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('html')).toHaveAttribute('data-series', 'collapsed');
});

for (const width of [1100, 390]) {
  test(`${width}px 文首系列详情显示名称、篇数并位于标题前`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(POST);
    const summary = page.locator('.wisp-series-inline summary');
    await expect(summary).toContainText('阅读路径');
    await expect(summary).toContainText('3 / 4');
    const series = await page.locator('.wisp-post-series-inline').boundingBox();
    const title = await page.locator('h1').boundingBox();
    expect(series && title && series.y + series.height).toBeLessThanOrEqual(title?.y ?? 0);
  });
}

test('无 JS 时系列篇目完整显示', async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  await page.goto(POST);
  await expect(page.locator('.wisp-series-aside .wisp-rail-scroll')).toBeVisible();
  await expect(page.locator('.wisp-series-aside ol#wisp-series-list > li')).toHaveCount(4);
  await expect(page.locator('.wisp-series-aside [data-series-toggle]')).toBeHidden();
  await context.close();
});
