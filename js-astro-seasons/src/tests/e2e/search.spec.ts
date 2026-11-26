import { expect, test } from '@playwright/test';

const SEARCH_QUERY: string = 'tool';
const NO_MATCH_QUERY: string = 'zzzzqqqq';

test('search overlay opens from the navbar and closes with escape', async ({ page }) => {
  await page.goto('/');
  const overlay = page.locator('#search-overlay');
  await expect(overlay).toBeHidden();

  await page.locator('#search-open').click();
  await expect(overlay).toBeVisible();
  await expect(page.locator('#search-input')).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(overlay).toBeHidden();
});

test('search overlay closes from the esc button', async ({ page }) => {
  await page.goto('/');
  await page.locator('#search-open').click();
  await page.locator('#search-close-btn').click();
  await expect(page.locator('#search-overlay')).toBeHidden();
});

test('search overlay lists matching results and selects the first one', async ({ page }) => {
  await page.goto('/');
  await page.locator('#search-open').click();
  await page.locator('#search-input').fill(SEARCH_QUERY);

  const results = page.locator('.search-result');
  await expect(results.first()).toBeVisible();
  await expect(results.first()).toHaveAttribute('aria-selected', 'true');
  await expect(results.first().locator('mark').first()).toBeVisible();
});

test('search overlay opens the selected result with enter', async ({ page }) => {
  await page.goto('/');
  await page.locator('#search-open').click();
  await page.locator('#search-input').fill(SEARCH_QUERY);
  await expect(page.locator('.search-result').first()).toBeVisible();

  await page.keyboard.press('Enter');
  await expect(page.locator('#search-overlay')).toBeHidden();
  await expect(page).not.toHaveURL('/');
});

test('search overlay explains when nothing matches', async ({ page }) => {
  await page.goto('/');
  await page.locator('#search-open').click();
  await page.locator('#search-input').fill(NO_MATCH_QUERY);

  await expect(page.locator('.search-empty')).toContainText(NO_MATCH_QUERY);
});
