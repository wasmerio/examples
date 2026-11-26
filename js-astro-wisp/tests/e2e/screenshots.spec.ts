import { test, type Page } from '@playwright/test';

/**
 * 生成 README / 文档用截图到 docs/screenshots/。默认跳过，手动运行：
 *   WISP_SCREENSHOTS=1 pnpm exec playwright test tests/e2e/screenshots.spec.ts --project=desktop
 */
test.skip(!process.env.WISP_SCREENSHOTS, '设置 WISP_SCREENSHOTS=1 才生成截图');

const OUT = 'docs/screenshots';

async function open(page: Page, path: string, theme: 'light' | 'dark', width = 1280, height = 900) {
  await page.setViewportSize({ width, height });
  await page.emulateMedia({ colorScheme: theme });
  await page.addInitScript((t) => localStorage.setItem('color-scheme', t), theme);
  await page.goto(path);
  await page.evaluate(() => document.fonts.ready);
  // 触发 client:visible 岛屿
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 30));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(300);
}

for (const theme of ['light', 'dark'] as const) {
  test(`home ${theme}`, async ({ page }) => {
    await open(page, '/', theme);
    await page.screenshot({ path: `${OUT}/home-${theme}.png` });
  });

  test(`post ${theme}`, async ({ page }) => {
    await open(page, '/posts/attention-explained/', theme, 1280, 1600);
    const y = await page
      .locator('.katex-display')
      .first()
      .evaluate((el) => el.getBoundingClientRect().top + scrollY - 140);
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(200);
    await page.screenshot({ path: `${OUT}/post-${theme}.png` });
  });

  test(`diagram ${theme}`, async ({ page }) => {
    await open(page, '/posts/attention-explained/', theme);
    await page
      .locator('figure.wisp-diagram')
      .first()
      .screenshot({ path: `${OUT}/diagram-${theme}.png` });
  });

  test(`mobile ${theme}`, async ({ page }) => {
    await open(page, '/posts/attention-explained/', theme, 375, 812);
    await page.screenshot({ path: `${OUT}/mobile-${theme}.png` });
  });

  test(`toc ${theme}`, async ({ page }) => {
    await open(page, '/posts/kitchen-sink/', theme);
    const y = await page
      .locator('h2')
      .nth(5)
      .evaluate((el) => el.getBoundingClientRect().top + scrollY - 80);
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT}/toc-${theme}.png` });
  });
}

test('drawio light', async ({ page }) => {
  await open(page, '/posts/kitchen-sink/', 'light');
  await page
    .locator('figure.wisp-diagram[data-page]')
    .first()
    .screenshot({ path: `${OUT}/drawio-light.png` });
});

test('explainer dark', async ({ page }) => {
  await open(page, '/posts/matrix-multiplication/', 'dark');
  const ex = page.locator('.wisp-explainer').first();
  await ex.scrollIntoViewIfNeeded();
  await ex.focus();
  for (let i = 0; i < 4; i++) await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(300);
  await ex.screenshot({ path: `${OUT}/explainer-dark.png` });
});

test('code dark (folded)', async ({ page }) => {
  await open(page, '/posts/kitchen-sink/', 'dark');
  const code = page.locator('.wisp-code[data-folded]').first();
  await code.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await code.screenshot({ path: `${OUT}/code-dark.png` });
});
