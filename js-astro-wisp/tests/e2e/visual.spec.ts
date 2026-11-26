import { test, expect } from '@playwright/test';

const PAGES = { home: '/', 'kitchen-sink': '/posts/kitchen-sink/' };
const SIZES = { 375: 812, 1280: 800 } as const;

for (const [name, path] of Object.entries(PAGES)) {
  for (const theme of ['light', 'dark'] as const) {
    for (const [w, h] of Object.entries(SIZES)) {
      test(`视觉 ${name} ${theme} ${w}`, async ({ page }) => {
        await page.setViewportSize({ width: Number(w), height: h });
        await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
        await page.addInitScript((t) => localStorage.setItem('color-scheme', t), theme);
        await page.goto(path);
        await page.evaluate(() => document.fonts.ready);
        // 滚动一遍，确保懒加载内容就绪，再回到顶部
        await page.evaluate(async () => {
          for (let y = 0; y < document.body.scrollHeight; y += 500) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 30));
          }
          window.scrollTo(0, 0);
        });
        await page.waitForTimeout(300);
        await expect(page).toHaveScreenshot(`${name}-${theme}-${w}.png`, { fullPage: true });
      });
    }
  }
}
