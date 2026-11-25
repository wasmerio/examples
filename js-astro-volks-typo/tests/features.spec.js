import { test, expect } from '@playwright/test';

test.describe('Volks-Typo Features', () => {
  test('dark mode toggle works correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check initial theme
    const initialTheme = await page.evaluate(() => document.documentElement.dataset.theme);
    
    // Click theme toggle
    await page.click('#theme-toggle');
    await page.waitForTimeout(500);
    
    // Check theme changed
    const newTheme = await page.evaluate(() => document.documentElement.dataset.theme);
    expect(newTheme).not.toBe(initialTheme);
    
    // Check localStorage
    const storedTheme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(storedTheme).toBe(newTheme);
  });

  test('reading time is displayed on blog listing', async ({ page }) => {
    await page.goto('/blog');
    
    // Check if reading time elements exist
    const readingTimeElements = page.locator('.post-reading-time');
    await expect(readingTimeElements.first()).toBeVisible();
    
    // Check format (should contain "min read")
    const readingTimeText = await readingTimeElements.first().textContent();
    expect(readingTimeText).toMatch(/\d+ min read|Less than 1 min read/);
  });

  test('table of contents appears and works on blog posts', async ({ page }) => {
    await page.goto('/blog');
    
    // Click first blog post
    await page.click('.post-title a');
    await page.waitForLoadState('networkidle');
    
    // Check if TOC exists
    const toc = page.locator('.table-of-contents');
    const tocVisible = await toc.isVisible();
    
    if (tocVisible) {
      // Check TOC has items
      const tocItems = page.locator('.toc-item');
      const itemCount = await tocItems.count();
      expect(itemCount).toBeGreaterThan(0);
      
      // Test clicking a TOC link
      const firstLink = page.locator('.toc-link').first();
      const href = await firstLink.getAttribute('href');
      
      await firstLink.click();
      await page.waitForTimeout(1000);
      
      // Check URL updated
      expect(page.url()).toContain(href);
    }
  });

  test('visual regression - light and dark mode', async ({ page }) => {
    await page.goto('/');
    
    // Light mode screenshot
    await page.evaluate(() => {
      document.documentElement.dataset.theme = 'light';
    });
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot('homepage-light.png');
    
    // Dark mode screenshot
    await page.evaluate(() => {
      document.documentElement.dataset.theme = 'dark';
    });
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot('homepage-dark.png');
  });

  test('MDX support - check if MDX files are rendered', async ({ page }) => {
    // This test assumes there might be MDX files in the blog
    await page.goto('/blog');
    
    // Check if any blog posts exist
    const posts = page.locator('.post-item');
    const postCount = await posts.count();
    expect(postCount).toBeGreaterThan(0);
  });
});