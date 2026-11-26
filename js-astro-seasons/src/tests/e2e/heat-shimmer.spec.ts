import { expect, test } from '@playwright/test';
import { AUTUMN_SEASON, SUMMER_SEASON } from '../seasons';

test('home page applies the heat shimmer filter in summer', async ({ page }) => {
  await page.clock.setFixedTime(new Date(SUMMER_SEASON.date));
  await page.goto('/');

  await expect(page.locator('[data-shimmer]')).toHaveCSS('filter', /heat-shimmer/);
});

test('home page leaves the heat shimmer off outside summer', async ({ page }) => {
  await page.clock.setFixedTime(new Date(AUTUMN_SEASON.date));
  await page.goto('/');

  await expect(page.locator('[data-shimmer]')).toHaveCSS('filter', 'none');
});

test('home page leaves the heat shimmer off when reduced motion is preferred', async ({ page }) => {
  await page.clock.setFixedTime(new Date(SUMMER_SEASON.date));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  await expect(page.locator('[data-shimmer]')).toHaveCSS('filter', 'none');
});
