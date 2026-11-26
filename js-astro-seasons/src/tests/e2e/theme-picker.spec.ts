import { expect, test, type Page } from '@playwright/test';
import { AUTUMN_SEASON, SUMMER_SEASON } from '../seasons';

const FIXED_THEMES: string[] = ['neon', 'autumn', 'winter', 'spring', 'summer'];

async function chooseTheme(page: Page, theme: string): Promise<void> {
  await page.locator('#theme-picker summary').click();
  await page.locator(`[data-theme-option="${theme}"]`).click();
}

for (const theme of FIXED_THEMES) {
  test(`theme picker applies the ${theme} theme and keeps it after a reload`, async ({ page }) => {
    await page.clock.setFixedTime(new Date(SUMMER_SEASON.date));
    await page.goto('/');

    await chooseTheme(page, theme);
    await expect(page.locator('html')).toHaveAttribute('data-palette', new RegExp(`^${theme}-`));
    await expect(page.locator('#theme-picker')).not.toHaveAttribute('open', '');

    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-palette', new RegExp(`^${theme}-`));
    await expect(page.locator(`[data-theme-option="${theme}"]`)).toHaveAttribute('aria-pressed', 'true');
  });
}

test('theme picker returns to the date based theme when automatic is chosen', async ({ page }) => {
  await page.clock.setFixedTime(new Date(AUTUMN_SEASON.date));
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-palette', /^autumn-/);

  await chooseTheme(page, 'neon');
  await expect(page.locator('html')).toHaveAttribute('data-palette', /^neon-/);

  await chooseTheme(page, 'auto');
  await expect(page.locator('html')).toHaveAttribute('data-palette', /^autumn-/);
});

test('theme picker shows the falling particles of the chosen theme', async ({ page }) => {
  await page.clock.setFixedTime(new Date(SUMMER_SEASON.date));
  await page.goto('/');
  await expect(page.locator('.falling-particles:visible')).toHaveCount(0);

  await chooseTheme(page, 'winter');
  await expect(page.locator('.falling-particles[data-family="winter"]')).toBeVisible();
});

test('theme picker keeps the light or dark mode when the theme changes', async ({ page }) => {
  await page.clock.setFixedTime(new Date(SUMMER_SEASON.date));
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');

  await chooseTheme(page, 'spring');
  await expect(page.locator('html')).toHaveAttribute('data-palette', 'spring-dark');
});

test('theme picker closes on escape and on an outside click', async ({ page }) => {
  await page.goto('/');
  const picker = page.locator('#theme-picker');

  await page.locator('#theme-picker summary').click();
  await expect(picker).toHaveAttribute('open', '');
  await page.keyboard.press('Escape');
  await expect(picker).not.toHaveAttribute('open', '');

  await page.locator('#theme-picker summary').click();
  await page.locator('h2').first().click();
  await expect(picker).not.toHaveAttribute('open', '');
});

test('theme picker and mode toggle stay visible on a phone-sized screen', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 700 });
  await page.goto('/');

  await expect(page.locator('#theme-picker summary')).toBeVisible();
  await expect(page.locator('#theme-toggle')).toBeVisible();
});
