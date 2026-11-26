import { test, expect } from '@playwright/test';

const URL = '/posts/matrix-multiplication/';

test('MatMul hydrate，键盘 → 前进，caption 的 aria-live 文本变化', async ({ page }) => {
  await page.goto(URL);
  const figure = page.locator('.wisp-explainer').first();
  await figure.scrollIntoViewIfNeeded();
  await expect(figure).toBeVisible();
  await expect(figure.locator('xpath=ancestor::astro-island')).not.toHaveAttribute('ssr', '');
  const caption = figure.locator('.wisp-explainer__caption');
  await expect(caption).toHaveAttribute('aria-live', 'polite');
  const before = await caption.textContent();
  await figure.focus();
  await page.keyboard.press('ArrowRight');
  await expect.poll(() => caption.textContent()).not.toBe(before);
  const count = figure.locator('.wisp-explainer__count');
  await expect(count).toHaveText(/^2 \//);
  await page.keyboard.press('ArrowLeft');
  await expect(count).toHaveText(/^1 \//);
});

test('翻页时卡片高度不变（说明区按最长一步预留高度）', async ({ page }) => {
  await page.goto(URL);
  const figure = page.locator('.wisp-explainer').first();
  await figure.scrollIntoViewIfNeeded();
  await expect(figure.locator('xpath=ancestor::astro-island')).not.toHaveAttribute('ssr', '');
  const total = Number(await figure.locator('.wisp-explainer__range').getAttribute('max')) + 1;
  await figure.focus();
  const heights = new Set<number>();
  for (let i = 0; i < total; i++) {
    heights.add(Math.round(((await figure.boundingBox())?.height ?? 0) * 10));
    await page.keyboard.press('ArrowRight');
  }
  expect([...heights]).toHaveLength(1);
});

test('全屏 dialog 保持步骤状态，Esc 关闭后焦点返回触发按钮', async ({ page }) => {
  await page.goto(URL);
  const figure = page.locator('.wisp-explainer').first();
  await figure.scrollIntoViewIfNeeded();
  await expect(figure.locator('xpath=ancestor::astro-island')).not.toHaveAttribute('ssr', '');

  await figure.getByRole('button', { name: '下一步' }).click();
  await expect(figure.locator('.wisp-explainer__count')).toHaveText('2 / 14');

  const expandBtn = figure.getByRole('button', { name: '全屏查看' });
  await expandBtn.click();

  const dialog = figure.locator('dialog.wisp-explainer__dialog[open]');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('.wisp-explainer__count')).toHaveText('2 / 14');

  await dialog.getByRole('button', { name: '下一步' }).click();
  await expect(dialog.locator('.wisp-explainer__count')).toHaveText('3 / 14');

  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(figure.locator('.wisp-explainer__count')).toHaveText('3 / 14');
  await expect(figure.getByRole('button', { name: '全屏查看' })).toBeFocused();
});

test.describe('boundary focus & offscreen demo pause', () => {
  test('末步下一步使用 aria-disabled 并保留焦点；滚出视口后自动停止演示', async ({ page }) => {
    await page.goto(URL);
    const figure = page.locator('.wisp-explainer').first();
    await figure.scrollIntoViewIfNeeded();
    await expect(figure.locator('xpath=ancestor::astro-island')).not.toHaveAttribute('ssr', '');

    const next = figure.getByRole('button', { name: '下一步' });
    const prev = figure.getByRole('button', { name: '上一步' });
    await expect(prev).toHaveAttribute('aria-disabled', 'true');
    await expect(prev).not.toHaveAttribute('disabled');

    const range = figure.locator('.wisp-explainer__range');
    const lastStep = Number(await range.getAttribute('max'));
    for (let i = 0; i < lastStep; i++) await next.click();
    await expect(next).toHaveAttribute('aria-disabled', 'true');
    await expect(next).not.toHaveAttribute('disabled');
    await expect(next).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(next).toBeFocused();

    const demo = figure.locator('.wisp-explainer__demo');
    await demo.click();
    await expect(demo).toHaveAttribute('aria-label', '停止演示');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(demo).toHaveAttribute('aria-label', '自动演示');
  });
});

test.describe('reduced-motion', () => {
  test.use({ reducedMotion: 'reduce' });
  test('保留自动演示与手动步进，仅关闭过渡动画', async ({ page }) => {
    await page.goto(URL);
    const figure = page.locator('.wisp-explainer').first();
    await figure.scrollIntoViewIfNeeded();
    await expect(figure.locator('xpath=ancestor::astro-island')).not.toHaveAttribute('ssr', '');
    const demo = figure.locator('.wisp-explainer__demo');
    const count = figure.locator('.wisp-explainer__count');
    await figure.focus();
    await page.keyboard.press('End');
    await expect(demo).toBeEnabled();
    await expect(demo).toHaveAttribute('aria-label', '自动演示');
    await expect(demo).toHaveAttribute('aria-description', /手动步进/);
    await expect(count).toHaveText('14 / 14');
    await demo.click();
    await expect(demo).toHaveAttribute('aria-label', '停止演示');
    await expect(count).toHaveText(/^1 \//);
  });
});
