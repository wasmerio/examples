import { test, expect, type Locator } from '@playwright/test';

const URL = '/posts/kitchen-sink/';

test.beforeEach(async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto(URL);
  await page.evaluate(() => document.fonts.ready);
});

const folded = (page: import('@playwright/test').Page) =>
  page.locator('.wisp-code[data-fold]').first();
const lineHeight = (box: Locator) =>
  box.locator('pre').evaluate((el) => parseFloat(getComputedStyle(el).lineHeight));

test('长代码块默认折叠，可见高度约为 previewLines 行', async ({ page }) => {
  const box = folded(page);
  await expect(box).toHaveAttribute('data-folded', '');
  const btn = box.locator('.wisp-fold');
  await expect(btn).toHaveAttribute('aria-expanded', 'false');
  await expect(btn).toContainText('展开全部 40 行');
  const preH = (await box.locator('pre').boundingBox())!.height;
  const lh = await lineHeight(box);
  const pt = await box.locator('pre').evaluate((el) => parseFloat(getComputedStyle(el).paddingTop));
  // 上内边距 + 12 行 + 半行余量
  expect(preH).toBeGreaterThan(pt + lh * 12);
  expect(preH).toBeLessThan(pt + lh * 13);
  const full = await box.locator('code').evaluate((c) => c.getBoundingClientRect().height);
  expect(full).toBeGreaterThan(preH * 2);
});

test('aria-controls 指向 pre', async ({ page }) => {
  const box = folded(page);
  const id = await box.locator('.wisp-fold').getAttribute('aria-controls');
  expect(id).toBeTruthy();
  await expect(box.locator('pre')).toHaveAttribute('id', id!);
});

test('点击展开显示全部，再次点击收起', async ({ page }) => {
  const box = folded(page);
  const btn = box.locator('.wisp-fold');
  const folded0 = (await box.locator('pre').boundingBox())!.height;
  await btn.click();
  await expect(btn).toHaveAttribute('aria-expanded', 'true');
  await expect(btn).toContainText('收起');
  await expect(box).not.toHaveAttribute('data-folded', '');
  const code = (await box.locator('code').boundingBox())!.height;
  const open = (await box.locator('pre').boundingBox())!.height;
  expect(open).toBeGreaterThanOrEqual(code);
  expect(open).toBeGreaterThan(folded0 * 2);
  await btn.click();
  await expect(btn).toHaveAttribute('aria-expanded', 'false');
  await expect(box).toHaveAttribute('data-folded', '');
  expect((await box.locator('pre').boundingBox())!.height).toBeCloseTo(folded0, 0);
});

test('收起时若按钮已滚出视口，会被滚回可见位置', async ({ page }) => {
  const box = folded(page);
  const btn = box.locator('.wisp-fold');
  await btn.click();
  await page.evaluate(() => window.scrollTo(0, 0)); // 展开后的按钮在视口之外
  expect(await btn.evaluate((b) => b.getBoundingClientRect().top > innerHeight)).toBe(true);
  await btn.evaluate((b: HTMLElement) => b.click());
  await expect(btn).toHaveAttribute('aria-expanded', 'false');
  await expect(btn).toBeInViewport({ ratio: 1 });
});

test('在展开的长代码底部点「收起」：代码块顶端回到页眉下方，焦点留在按钮上', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); // 减少动态效果时立即跳转，不必等平滑滚动
  const box = folded(page);
  const btn = box.locator('.wisp-fold');
  await btn.click();
  await btn.evaluate((b) => b.scrollIntoView({ block: 'end' }));
  expect(await box.evaluate((b) => b.getBoundingClientRect().top)).toBeLessThan(0);
  await btn.focus();
  await page.keyboard.press('Enter');
  await expect(btn).toHaveAttribute('aria-expanded', 'false');
  const pad = await page.evaluate(() =>
    parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop),
  );
  const top = await box.evaluate((b) => b.getBoundingClientRect().top);
  expect(Math.abs(top - pad)).toBeLessThanOrEqual(2);
  await expect(btn).toBeFocused();
});

test('展开 / 收起按钮在触屏宽度下高 44px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  const h = await folded(page)
    .locator('.wisp-fold')
    .evaluate((b) => b.getBoundingClientRect().height);
  expect(h).toBeGreaterThanOrEqual(44);
});

test('nofold 的长代码块不折叠，也没有展开按钮', async ({ page }) => {
  const box = page.locator('.wisp-code[data-lines="40"]:not([data-fold])');
  await expect(box).toHaveCount(1);
  await expect(box.locator('.wisp-fold')).toHaveCount(0);
  await expect(box).not.toHaveAttribute('data-folded', '');
});

test('短代码块没有折叠按钮，但有复制按钮', async ({ page }) => {
  const box = page.locator('.wisp-code[data-lines="4"]').first();
  await expect(box.locator('.wisp-fold')).toHaveCount(0);
  await expect(box.locator('.wisp-copy')).toHaveCount(1);
});

test('复制按钮使用 Invoker Commands 与唯一定位标签，成功后切换为勾并播报“已复制”', async ({
  page,
}) => {
  const box = page.locator('.wisp-code[data-lines="4"]').first();
  const btn = box.locator('.wisp-copy');
  await expect(btn).toHaveAttribute('aria-label', /^复制 .* 代码/);
  await expect(btn).toHaveAttribute('command', '--copy');
  const boxId = await box.getAttribute('id');
  expect(boxId).toBeTruthy();
  await expect(btn).toHaveAttribute('commandfor', boxId!);
  await expect(btn.locator('svg')).toHaveCount(1);
  await expect(btn).toHaveText('');
  const before = await btn.innerHTML();
  await box.hover();
  await btn.click();
  await expect(btn).toHaveAttribute('data-done', '');
  expect(await btn.innerHTML()).not.toBe(before);
  await expect(box.locator('[role=status]')).toHaveText(/已复制/);
  await expect(btn).not.toHaveAttribute('data-done', '', { timeout: 4000 });
  await expect(box.locator('[role=status]')).toHaveText('');
});

test('折叠态下复制得到完整代码', async ({ page }) => {
  const box = folded(page);
  await expect(box).toHaveAttribute('data-folded', '');
  await box.hover();
  await box.locator('.wisp-copy').click();
  const copied = (await page.evaluate(() => navigator.clipboard.readText())).replace(/\r\n/g, '\n');
  const expected = await box.locator('code').evaluate((c) => c.textContent ?? '');
  expect(copied.split('\n').length).toBeGreaterThanOrEqual(40);
  expect(copied).toBe(expected);
  expect(copied).toContain('step40');
});

test('键盘可以操作：Tab 聚焦，Enter / Space 展开收起', async ({ page }) => {
  const box = folded(page);
  const btn = box.locator('.wisp-fold');
  await btn.focus();
  await expect(btn).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(btn).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Space');
  await expect(btn).toHaveAttribute('aria-expanded', 'false');
  // 复制按钮在 Tab 序列中可达
  const copy = box.locator('.wisp-copy');
  await copy.focus();
  await expect(copy).toBeFocused();
  await expect(copy).toHaveCSS('opacity', '1');
  await page.keyboard.press('Enter');
  await expect(copy).toHaveAttribute('data-done', '');
});

test('无 JS 时折叠块完整显示、没有按钮', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(URL);
  const box = page.locator('.wisp-code[data-fold]').first();
  await expect(box).not.toHaveAttribute('data-folded', '');
  await expect(box.locator('.wisp-fold')).toHaveCount(0);
  const pre = (await box.locator('pre').boundingBox())!.height;
  const code = (await box.locator('code').boundingBox())!.height;
  expect(pre).toBeGreaterThanOrEqual(code);
  await ctx.close();
});

test('打印时折叠块完整显示', async ({ page }) => {
  const box = folded(page);
  await page.emulateMedia({ media: 'print' });
  const pre = (await box.locator('pre').boundingBox())!.height;
  const code = (await box.locator('code').boundingBox())!.height;
  expect(pre).toBeGreaterThanOrEqual(code);
});

test('折叠态下行号和横向滚动仍可用', async ({ page }) => {
  const box = folded(page);
  const pre = box.locator('pre');
  const content = await pre
    .locator('.line')
    .first()
    .evaluate((el) => getComputedStyle(el, '::before').content);
  expect(content).not.toBe('none');
  expect(await pre.evaluate((el) => getComputedStyle(el).overflowX)).toBe('auto');
});

test('自动换行按钮只出现在横向溢出的代码块上', async ({ page }) => {
  const wide = page.locator('.wisp-code[data-language="bash"]').first();
  await expect(wide).toHaveAttribute('data-wisp-wide', '');
  await expect(wide.locator('.wisp-wrap')).toBeVisible();
  await expect(wide.locator('.wisp-wrap')).toHaveAttribute('aria-label', /^切换 .* 自动换行/);
  await expect(wide.locator('.wisp-wrap')).toHaveAttribute('aria-pressed', 'false');
  const short = page.locator('.wisp-code[data-lines="4"]').first();
  await expect(short.locator('.wisp-wrap')).toBeHidden();
});

test('溢出提示是边缘渐隐（不是阴影），随滚动位置更新', async ({ page }) => {
  const pre = page.locator('.wisp-code[data-language="bash"] pre').first();
  await expect(pre).toHaveAttribute('data-wisp-overflow', 'end');
  expect(await pre.evaluate((el) => getComputedStyle(el).boxShadow)).toBe('none');
  expect(await pre.evaluate((el) => getComputedStyle(el).maskImage)).toContain('linear-gradient');
  await pre.evaluate((el) => (el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2));
  await expect(pre).toHaveAttribute('data-wisp-overflow', 'both');
  await pre.evaluate((el) => (el.scrollLeft = el.scrollWidth));
  await expect(pre).toHaveAttribute('data-wisp-overflow', 'start');
});

test('切换自动换行：整页生效、记住选择、刷新后首帧即换行', async ({ page }) => {
  const box = page.locator('.wisp-code[data-language="bash"]').first();
  const pre = box.locator('pre');
  const h0 = (await pre.boundingBox())!.height;
  await box.hover();
  await box.locator('.wisp-wrap').click();
  await expect(box.locator('.wisp-wrap')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('html')).toHaveAttribute('data-wisp-code-wrap', 'on');
  expect(await page.evaluate(() => localStorage.getItem('wisp-code-wrap'))).toBe('on');
  await expect(pre).not.toHaveAttribute('data-wisp-overflow');
  expect((await pre.boundingBox())!.height).toBeGreaterThan(h0 * 1.5);
  // 换行后行号只有 1 个（一个逻辑行）
  expect(await pre.locator('.line').count()).toBe(1);
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-wisp-code-wrap', 'on');
  await expect(box.locator('.wisp-wrap')).toHaveAttribute('aria-pressed', 'true');
  // 复制仍得到原始的一行
  await box.hover();
  await box.locator('.wisp-copy').click();
  const copied = (await page.evaluate(() => navigator.clipboard.readText())).replace(/\r\n/g, '\n');
  expect(copied.split('\n').filter(Boolean)).toHaveLength(1);
});
