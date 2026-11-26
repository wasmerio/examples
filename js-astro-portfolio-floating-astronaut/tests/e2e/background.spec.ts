import { test, expect, type Page } from '@playwright/test';

async function scrollToProgress(page: Page, progress: number) {
  await page.evaluate((p) => {
    const world = document.querySelector<HTMLElement>('.film-world')!;
    const top = world.getBoundingClientRect().top + scrollY;
    window.scrollTo(0, top + p * (world.offsetHeight - innerHeight));
  }, progress);
  await expect.poll(() => page.evaluate(() => Number(document.documentElement.style.getPropertyValue('--film-progress')))).toBeCloseTo(progress, 2);
}

async function assertTime(page: Page, progress: number) {
  await expect.poll(() => page.locator('video').evaluate((v: HTMLVideoElement, p) =>
    Math.abs(v.currentTime - p * v.duration), progress), { timeout: 20_000 }).toBeLessThan(.3);
}

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  // Keep third-party analytics independent of the deterministic film checks.
  await page.route(/^https?:\/\/(?!localhost[:/]|127\.0\.0\.1[:/])/, (route) => route.fulfill({ body: '', contentType: 'application/javascript' }));
  (page as Page & { filmErrors: string[] }).filmErrors = errors;
});

test.afterEach(async ({ page }) => {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect((page as Page & { filmErrors: string[] }).filmErrors).toEqual([]);
});

test('desktop film scrubs through the geometry chapter to the final frame and back', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.locator('video')).toHaveAttribute('src', '/media/film/film-scrub-1080.mp4');
  await expect(page.locator('.film-world')).toHaveClass(/is-ready/);
  await expect(page.locator('video')).toHaveCSS('opacity', '1');
  await scrollToProgress(page, .5);
  await assertTime(page, .5);
  await expect(page.locator('html')).toHaveAttribute('data-chapter', '2');
  await expect(page.locator('.film-scroll-hint')).toHaveCSS('opacity', '0');
  await scrollToProgress(page, 1);
  await assertTime(page, 1);
  await scrollToProgress(page, .2);
  await assertTime(page, .2);
});

test.describe('touch film', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  test('loads the 540 encode and scrubs', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('video')).toHaveAttribute('src', '/media/film/film-scrub-540.mp4');
    await expect(page.locator('.film-world')).toHaveClass(/is-ready/);
    await scrollToProgress(page, .5);
    await assertTime(page, .5);
    await expect(page.locator('html')).toHaveAttribute('data-chapter', '2');
  });
});

test('reduced motion keeps the poster and never seeks', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => {
    (window as Window & { filmSeeks: number }).filmSeeks = 0;
    document.addEventListener('seeking', () => { (window as Window & { filmSeeks: number }).filmSeeks++; }, true);
  });
  await page.goto('/');
  await scrollToProgress(page, .5);
  await expect(page.locator('html')).toHaveAttribute('data-chapter', '2');
  await scrollToProgress(page, 1);
  expect(await page.locator('video').evaluate((v: HTMLVideoElement) => v.currentTime)).toBe(0);
  expect(await page.evaluate(() => (window as Window & { filmSeeks: number }).filmSeeks)).toBe(0);
  await expect(page.locator('video')).toHaveCSS('opacity', '0');
  await expect(page.locator('.film-video')).toHaveCSS('background-image', /film-poster\.jpg/);
  await expect(page.locator('.film-video__grain')).toHaveCSS('animation-name', 'none');
});
