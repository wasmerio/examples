import { test, expect } from '@playwright/test';
import { SITE_NAME } from '@/lib/site';

test('home page has a title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(SITE_NAME);
});
