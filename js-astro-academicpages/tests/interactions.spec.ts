import { expect, test } from '@playwright/test';

import { siteConfig } from '@data/siteConfig';
import { darkThemes, lightThemes, resolveThemes } from '@data/themes';

import { toUrl } from './fixtures/test-utils';

function hexLuminance(hex: string): number {
  const n = parseInt(hex.replace('#', ''), 16);
  const channels = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const s = v / 255;

    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(hex1: string, hex2: string): number {
  const l1 = hexLuminance(hex1);
  const l2 = hexLuminance(hex2);

  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

test.describe('Client-Side Interactive Components Tests', () => {
  test('theme toggle changes data-theme attribute and persists', async ({
    page,
  }) => {
    const resolved = resolveThemes({
      light: { base: '#8c1515' },
      dark: 'catppuccin-mocha',
    });
    expect(resolved.light.base).toBe('#8c1515');
    expect(resolved.light.bg).toBe('#ffffff');
    expect(resolved.dark.bg).toBe('#1e1e2e');
    expect(resolved.css).toContain('--global-link-color:#8c1515');
    expect(resolved.css).toContain('color-mix(in srgb');
    expect(resolved.css).not.toContain('data-light-preset');

    const withPicker = resolveThemes({ picker: true });
    expect(withPicker.css).toContain("data-light-preset='alucard'");
    expect(withPicker.css).toContain("data-dark-preset='dracula'");

    for (const [name, p] of Object.entries(lightThemes)) {
      expect(contrastRatio(p.text, p.bg), `${name} text/bg`).toBeGreaterThan(
        4.5
      );
      expect(
        contrastRatio(p.textLight, p.bg),
        `${name} textLight/bg`
      ).toBeGreaterThan(3);
      expect(contrastRatio(p.base, p.bg), `${name} base/bg`).toBeGreaterThan(
        2.7
      );
    }
    for (const [name, p] of Object.entries(darkThemes)) {
      expect(contrastRatio(p.text, p.bg), `${name} text/bg`).toBeGreaterThan(
        4.5
      );
      expect(
        contrastRatio(p.textLight, p.bg),
        `${name} textLight/bg`
      ).toBeGreaterThan(2.9);
      expect(contrastRatio(p.base, p.bg), `${name} base/bg`).toBeGreaterThan(
        4.5
      );
    }

    const activeThemes = resolveThemes(siteConfig.theme);
    await page.goto(toUrl('/'));
    const initialTheme =
      (await page.locator('html').getAttribute('data-theme')) || 'light';
    const toggleBtn = page.locator('.theme-toggle-btn:visible').first();
    await expect(toggleBtn).toBeVisible();
    await toggleBtn.click();
    await expect(page.locator('html')).not.toHaveAttribute(
      'data-theme',
      initialTheme
    );

    const newTheme = await page.locator('html').getAttribute('data-theme');
    const expectedBg =
      newTheme === 'dark' ? activeThemes.dark.bg : activeThemes.light.bg;
    const metaThemeColor = await page
      .locator('meta[name="theme-color"]')
      .first()
      .getAttribute('content');
    expect(metaThemeColor).toBe(expectedBg);

    const activeCssBg = await page.evaluate(() =>
      getComputedStyle(document.documentElement)
        .getPropertyValue('--global-bg-color')
        .trim()
    );
    expect(activeCssBg).toBe(expectedBg);

    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', newTheme!);
    const reloadedMetaColor = await page
      .locator('meta[name="theme-color"]')
      .first()
      .getAttribute('content');
    expect(reloadedMetaColor).toBe(expectedBg);

    const pickerBtn = page.locator('.theme-picker-btn:visible').first();
    await expect(pickerBtn).toBeVisible();
    await pickerBtn.click();
    const popover = page.locator('.theme-picker-popover:visible').first();
    await expect(popover).toBeVisible();
    await popover.locator('[data-tab-mode="dark"]').click();
    await popover
      .locator('[data-preset-mode="dark"][data-preset-name="dracula"]')
      .click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('html')).toHaveAttribute(
      'data-dark-preset',
      'dracula'
    );
    const draculaBg = await page.evaluate(() =>
      getComputedStyle(document.documentElement)
        .getPropertyValue('--global-bg-color')
        .trim()
    );
    expect(draculaBg).toBe(darkThemes.dracula.bg);
  });

  test('search modal opens with Cmd+K, supports ArrowDown/Up selection, and navigates with Enter', async ({
    page,
    isMobile,
  }) => {
    await page.goto(toUrl('/'));

    await page.keyboard.press('ControlOrMeta+KeyK');
    const modal = page.locator('#search-modal');
    await expect(modal).toBeVisible();

    const searchInput = page.locator('#search-input');
    await searchInput.fill('Paper Title');

    const resultItem = page.locator('.search-result-item').first();
    await expect(resultItem).toBeVisible();
    await expect(resultItem).toContainText('Paper Title Number 1');

    if (!isMobile) {
      await page.keyboard.press('ArrowDown');
      await expect(resultItem).toHaveClass(/ring-1/);

      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(/publications\/paper-1/);
    } else {
      await page.keyboard.press('Escape');
      await expect(modal).not.toBeVisible();
    }
  });

  test('search modal opens with button and closes with Escape', async ({
    page,
  }) => {
    await page.goto(toUrl('/'));
    const searchBtn = page.locator('.search-trigger-btn:visible').first();
    await expect(searchBtn).toBeVisible();
    await searchBtn.click();

    const modal = page.locator('#search-modal');
    await expect(modal).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible();
  });

  test('search modal traps focus within dialog when open', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'Desktop focus trapping test');

    await page.goto(toUrl('/'));
    const searchBtn = page.locator('.search-trigger-btn:visible').first();
    await searchBtn.click();

    const modal = page.locator('#search-modal');
    await expect(modal).toBeVisible();

    const searchInput = page.locator('#search-input');
    await expect(searchInput).toBeFocused();

    await page.keyboard.press('Tab');
    const closeBtn = page.locator('#search-close-btn');
    await expect(closeBtn).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(searchInput).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    await expect(closeBtn).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible();
  });

  test('Table of contents renders on CV and guide pages and is retractable', async ({
    page,
  }) => {
    await page.goto(toUrl('/cv/'));
    const toc = page.locator('#toc-wrapper');
    await expect(toc).toBeVisible();

    const toggleBtn = page.locator('#toc-toggle-btn');
    const collapseWrapper = page.locator('#toc-collapse-wrapper');

    await expect(toggleBtn).toHaveAttribute('aria-expanded', 'false');
    await expect(collapseWrapper).not.toBeVisible();

    await toggleBtn.click();
    await expect(toggleBtn).toHaveAttribute('aria-expanded', 'true');
    await expect(collapseWrapper).toBeVisible();
    await expect(toc).toContainText('Education');
    await expect(toc).toContainText('Publications');

    const tocLinks = page.locator('.toc-link');
    const count = await tocLinks.count();
    expect(count).toBeGreaterThanOrEqual(4);

    await toggleBtn.click();
    await expect(toggleBtn).toHaveAttribute('aria-expanded', 'false');
    await expect(collapseWrapper).not.toBeVisible();
  });

  test('Action badges and BibTeX 1-click copy functionality', async ({
    page,
  }) => {
    await page.goto(toUrl('/publications/'));

    const bibtexButtons = page.locator('.bibtex-toggle-btn');
    await expect(bibtexButtons).toHaveCount(2);

    const bibtexBtn = bibtexButtons.first();
    await expect(bibtexBtn).toBeVisible();
    await bibtexBtn.click();

    const bibtexBox = page.locator('.bibtex-box:not(.hidden)').first();
    await expect(bibtexBox).toBeVisible();
    await expect(bibtexBox).toContainText('@');
    const bibtexText = await bibtexBox.locator('code').first().innerText();
    expect(bibtexText.startsWith('@')).toBe(true);

    const copyBtn = bibtexBox.locator('.copy-bibtex-btn');
    await expect(copyBtn).toBeVisible();
    await copyBtn.click();
    await expect(copyBtn).toContainText('Copied!');

    const downloadLink = bibtexBox.locator('a[download="citation.bib"]');
    await expect(downloadLink).toBeVisible();

    const codeBadge = page.locator('a:has-text("Code")').first();
    await expect(codeBadge).toBeVisible();
    await expect(codeBadge).toHaveAttribute(
      'href',
      'https://github.com/arghyadipchak/academicpages-astro'
    );
  });

  test('Publication category filter tabs work interactively', async ({
    page,
  }) => {
    await page.goto(toUrl('/publications/'));
    const confFilterBtn = page.locator('button[data-filter="conferences"]');
    await expect(confFilterBtn).toBeVisible();
    await confFilterBtn.click();

    const confSection = page.locator('section[data-category="conferences"]');
    await expect(confSection).toBeVisible();

    const journalsSection = page.locator('section[data-category="journals"]');
    await expect(journalsSection).toBeHidden();

    const allBtn = page.locator('button[data-filter="all"]');
    await allBtn.click();
    await expect(journalsSection).toBeVisible();
  });

  test('Mobile author profile Follow button toggles social links list', async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, 'Mobile-only author profile test');

    await page.goto(toUrl('/'));
    const followBtn = page.locator('#author-urls-toggle');
    const urlsList = page.locator('#author-urls-list');

    await expect(followBtn).toBeVisible();
    await expect(urlsList).toHaveClass(/hidden/);

    await followBtn.click();
    await expect(urlsList).not.toHaveClass(/hidden/);

    await followBtn.click();
    await expect(urlsList).toHaveClass(/hidden/);
  });

  test('Reading progress bar updates width on scroll on article pages', async ({
    page,
  }) => {
    await page.goto(toUrl('/markdown/'));
    const progressBar = page.locator('#reading-progress');
    await expect(progressBar).toBeAttached();

    await page.evaluate(() =>
      window.scrollTo(0, document.body.scrollHeight / 2)
    );
    await page.waitForTimeout(100);

    const widthStyle = await progressBar.getAttribute('style');
    expect(widthStyle).toMatch(/width:\s*\d+(\.\d+)?%/);
  });
});
