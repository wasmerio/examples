import { test, expect } from '@playwright/test';

const URL = '/posts/kitchen-sink/';

test.beforeEach(async ({ page }) => {
  await page.goto(URL);
  await page.evaluate(() => document.fonts.ready);
});

test('文内引用是带方括号的上标，紧挨着的合并为 [n, m]', async ({ page }) => {
  const marks = page.locator('sup.wisp-cite');
  expect(await marks.count()).toBeGreaterThanOrEqual(5);
  await expect(marks.first().locator('a')).toHaveAttribute('aria-label', /^参考 \d+$/);
  await expect(page.locator('sup.wisp-cite--joined')).toHaveCount(1);
  const joined = await page
    .locator('sup.wisp-cite--joined a')
    .evaluate((a) => getComputedStyle(a, '::after').content);
  expect(joined).toBe('"," / ""');
});

test('有引用的行与没有引用的行行距一致', async ({ page }) => {
  const p = page.locator('p:has(sup.wisp-cite)').nth(1);
  const { h, lh } = await p.evaluate((el) => ({
    h: el.getBoundingClientRect().height,
    lh: parseFloat(getComputedStyle(el).lineHeight),
  }));
  expect(Math.abs(h / lh - Math.round(h / lh))).toBeLessThan(0.01);
});

test('文末「参考与注释」：可见标题、单枚图标回链、没有 ↩ 字符与序号尾巴', async ({ page }) => {
  const sec = page.locator('section[data-footnotes]');
  await expect(sec.locator('h2')).toHaveText('参考与注释');
  await expect(sec.locator('h2')).toBeVisible();
  await expect(sec).not.toContainText('↩');
  await expect(sec.locator('a[data-footnote-backref] svg').first()).toBeVisible();
  const itemCount = await sec.locator('li').count();
  await expect(sec.locator('a[data-footnote-backref]')).toHaveCount(itemCount);
  await expect(sec.locator('.wisp-backref-n')).toHaveCount(0);
  // 不进目录
  await expect(page.locator('[data-toc-link="footnote-label"]')).toHaveCount(0);
});

test('多处引用的同一条注释：点击第 2 处跳下后，单枚回链精准原路返回第 2 处', async ({ page }) => {
  const refs = page.locator('a[data-footnote-ref][href="#user-content-fn-attention"]');
  await expect(refs).toHaveCount(2);
  const second = refs.nth(1);
  const secondId = (await second.getAttribute('id'))!;
  await second.click();
  const li = page.locator('#user-content-fn-attention');
  await expect(li).toHaveAttribute('data-wisp-flash', '');
  const backref = li.locator('a[data-footnote-backref]');
  await expect(backref).toHaveCount(1);
  await backref.click();
  await expect(page.locator(`#${secondId}`).locator('..')).toHaveAttribute('data-wisp-flash', '');
  await expect(second).toBeFocused();
});

test('中文页里的纯西文强调保持斜体，中文强调显示着重号', async ({ page }) => {
  const zhEm = page.locator('.prose p em', { hasText: '强调' }).first();
  const enEm = page.locator('.prose p em', { hasText: 'emphasis' }).first();
  await expect(enEm).toHaveAttribute('lang', 'en');
  expect(await zhEm.evaluate((el) => getComputedStyle(el).fontStyle)).toBe('normal');
  expect(await zhEm.evaluate((el) => getComputedStyle(el).textEmphasisStyle)).not.toBe('none');
  expect(await enEm.evaluate((el) => getComputedStyle(el).fontStyle)).toBe('italic');
  expect(await enEm.evaluate((el) => getComputedStyle(el).textEmphasisStyle)).toBe('none');
});

test('点击引用跳到注释并短暂标记，焦点移到注释', async ({ page }) => {
  const a = page.locator('sup.wisp-cite a').nth(3);
  const href = (await a.getAttribute('href'))!;
  await a.click();
  const li = page.locator(href.replace('#', '#'));
  await expect(li).toHaveAttribute('data-wisp-flash', '');
  await expect(li).toBeInViewport();
  await expect(li).toBeFocused();
  await expect(li).not.toHaveAttribute('data-wisp-flash', '', { timeout: 6000 });
  // 注释没有被吸顶页眉盖住
  const top = (await li.boundingBox())!.y;
  expect(top).toBeGreaterThanOrEqual(56);
});

test('悬停引用触发原生 interestfor 预览（popover="hint" / aria-describedby），Esc 关闭', async ({
  page,
  isMobile,
}) => {
  test.skip(!!isMobile, '触屏不弹出');
  const a = page.locator('sup.wisp-cite a').nth(3);
  const popId = await a.getAttribute('interestfor');
  expect(popId).toBeTruthy();
  await expect(a).toHaveAttribute('aria-describedby', popId!);
  const pop = page.locator(`#${popId}`);
  await expect(pop).toHaveAttribute('popover', 'hint');
  await expect(pop).toHaveAttribute('role', 'tooltip');
  await a.hover();
  await expect(pop).toBeVisible();
  await expect(pop).toContainText('FlashAttention');
  expect(await pop.evaluate((el) => getComputedStyle(el).boxShadow)).toBe('none');
  await page.keyboard.press('Escape');
  await expect(pop).toBeHidden();
});

test('无 JS 时是普通锚点跳转', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(URL);
  const a = page.locator('sup.wisp-cite a').first();
  await a.click();
  await expect(page).toHaveURL(/#user-content-fn-/);
  await ctx.close();
});
