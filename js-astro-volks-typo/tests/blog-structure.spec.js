import { test, expect } from '@playwright/test';
import { readdir } from 'fs/promises';
import { join } from 'path';

test.describe('Blog Structure', () => {
  test('no markdown files should exist in src/pages/blog/', async () => {
    // Check that no .md files exist in the pages/blog directory
    const pagesDir = join(process.cwd(), 'src/pages/blog');
    let files = [];
    
    try {
      files = await readdir(pagesDir);
    } catch {
      // Directory might not exist, which is fine
      return;
    }
    
    const markdownFiles = files.filter(file => file.endsWith('.md') || file.endsWith('.mdx'));
    
    // This test should fail if there are markdown files in the wrong location
    expect(markdownFiles).toHaveLength(0);
  });

  test('sample blog post renders with proper layout', async ({ page }) => {
    await page.goto('/blog');
    
    // Find the sample post link (The Aesthetic Tension of Modernist Design)
    const samplePostLink = page.locator('a:has-text("The Aesthetic Tension of Modernist Design")').first();
    await expect(samplePostLink).toBeVisible();
    
    // Click on the sample post
    await samplePostLink.click();
    await page.waitForLoadState('networkidle');
    
    // Verify the page has proper blog post layout elements
    // Check for header
    await expect(page.locator('header')).toBeVisible();
    
    // Check for sidebar (on desktop)
    const isDesktop = await page.viewportSize().then(size => size.width >= 1024);
    if (isDesktop) {
      await expect(page.locator('.sidebar')).toBeVisible();
    }
    
    // Check for post content with proper styling
    await expect(page.locator('.post-content')).toBeVisible();
    
    // Check for styled headings (they should have the red accent color)
    const h1 = page.locator('.post-content h1').first();
    if (await h1.isVisible()) {
      const color = await h1.evaluate(el => getComputedStyle(el).color);
      expect(color).toBe('rgb(220, 38, 38)'); // #dc2626 in RGB
    }
    
    // Check for footer
    await expect(page.locator('footer')).toBeVisible();
    
    // Verify it's not just raw markdown rendering
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).not.toContain('---'); // Frontmatter should not be visible
  });
});