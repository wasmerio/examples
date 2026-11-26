import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

test('showcase tabs work with the keyboard', async ({ page }) => {
  await page.goto('showcase');
  const tabs = page.getByRole('tablist').first().getByRole('tab');
  await tabs.first().focus();
  await page.keyboard.press('End');
  await expect(tabs.last()).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('Home');
  await expect(tabs.first()).toBeFocused();
});

test('mode selection persists', async ({ page }) => {
  await page.goto('');
  await page.getByRole('button', { name: 'Paper', exact: true }).click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('mobile navigation is reachable from the keyboard', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('');
  const links = page.getByRole('navigation', { name: 'Main' }).getByRole('link');
  await links.first().focus();
  await expect(links.first()).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(links.nth(1)).toBeFocused();
});

test('escape closes the lightbox and returns focus', async ({ page }) => {
  await page.goto('showcase');
  const open = page.getByRole('button', { name: 'Full size' });
  await open.focus();
  await open.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(open).toBeFocused();
});

test('integration search announces an empty result', async ({ page }) => {
  await page.goto('integrations');
  await page.getByRole('searchbox', { name: 'Search integrations' }).fill('zzzz-not-real');
  await expect(page.getByText('No integration matches that search.')).toBeVisible();
  await expect(page.locator('#search-status')).toContainText('0');
});

test('install tabs on one page do not share ids', async ({ page }) => {
  await page.goto('showcase');
  const ids = await page.getByRole('tab').evaluateAll(nodes => nodes.map(node => node.id));
  expect(new Set(ids).size).toBe(ids.length);
  expect(ids.length).toBeGreaterThan(1);
});

test('clipboard success and rejection are announced', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: async () => {} },
    });
  });
  await page.goto('');
  await page.getByRole('button', { name: 'Copy' }).first().click();
  await expect(page.getByRole('status')).toHaveText('Copied to clipboard');
});

test('clipboard rejection is announced', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL });
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async () => {
          throw new Error('denied');
        },
      },
    });
  });
  const page = await context.newPage();
  await page.goto('');
  await page.getByRole('button', { name: 'Copy' }).first().click();
  await expect(page.getByRole('status')).toHaveText('Copy failed');
  await context.close();
});

test('theme selection survives denied storage', async ({ page }) => {
  await page.addInitScript(() => {
    const denied = () => {
      throw new DOMException('denied', 'SecurityError');
    };
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: { getItem: denied, setItem: denied, removeItem: denied, clear() {}, key: () => null, length: 0 },
    });
  });
  await page.goto('');
  await page.getByRole('button', { name: 'Paper', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('reduced motion stops the cursor blink', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('');
  await expect(page.locator('.cursor').first()).toHaveCSS('animation-name', 'none');
});

async function expectClean(page: Page) {
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
}

for (const viewport of [
  { width: 1280, height: 800 },
  { width: 375, height: 800 },
]) {
  for (const path of ['', 'showcase']) {
    for (const mode of ['Noir', 'Paper'] as const) {
      test(`axe ${path || 'home'} ${mode} ${viewport.width}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto(path);
        if (mode === 'Paper') await page.getByRole('button', { name: 'Paper', exact: true }).click();
        await expectClean(page);
      });
    }
  }
}
