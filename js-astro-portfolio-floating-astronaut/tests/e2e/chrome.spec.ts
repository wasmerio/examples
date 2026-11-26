import { test, expect } from '@playwright/test';
import { site, socialLinks } from '../../src/lib/site';
import { projects } from '../../src/data/projects';

test('floating header: glass, section links, contact', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const header = page.locator('header.float-header');
  await expect(header).toBeVisible();
  await expect(header).toHaveCSS('position', 'fixed');
  expect(await header.evaluate((el) => getComputedStyle(el).backdropFilter || getComputedStyle(el).getPropertyValue('-webkit-backdrop-filter'))).toContain('blur');
  // Header sits outside <main> so landmarks stay correct.
  expect(await header.evaluate((el) => !!el.closest('main'))).toBe(false);
  await expect(header.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', /^mailto:/);
  const links = page.locator('[data-section-link]');
  await expect(links).toHaveCount(4);
  await expect(links).toHaveText(['Skills', 'Craft', 'Projects', 'Experience']);
  await header.getByRole('link', { name: 'Projects', exact: true }).click();
  await expect(page.locator('#projects')).toBeInViewport({ timeout: 8000 });
  await expect(page.locator('[data-section-link="projects"]')).toHaveAttribute('aria-current', '', { timeout: 8000 });
  // The section heading lands below the floating header, not under it.
  await expect.poll(async () => (await page.locator('#projects-title').boundingBox())!.y, { timeout: 8000 }).toBeGreaterThan(70);
});

test('floating footer: at the end, outside main, real links', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  const footer = page.locator('footer .float-footer');
  await expect(footer).toBeInViewport();
  expect(await footer.evaluate((el) => !!el.closest('main'))).toBe(false);
  await expect(footer).toContainText(`© ${new Date().getFullYear()} ${site.name}`);
  await expect(footer.getByRole('link', { name: 'GitHub', exact: true })).toHaveAttribute('href', site.github);
  await expect(footer.getByRole('link', { name: 'Email' })).toHaveAttribute('href', /^mailto:/);
});

test('phone: compact header, no overflow; reduced motion stops the float', async ({ browser }) => {
  const phone = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true });
  await phone.goto('/');
  await expect(phone.locator('.float-header__name')).toBeHidden();
  await expect(phone.locator('[data-section-link]')).toHaveCount(4);
  const box = await phone.locator('header.float-header').boundingBox();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(390);
  expect(await phone.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await phone.close();
  const calm = await browser.newPage({ reducedMotion: 'reduce' });
  await calm.goto('/');
  await expect(calm.locator('.float-footer')).toHaveCSS('animation-name', 'none');
  await expect(calm.locator('.float-header')).toHaveCSS('animation-name', 'none');
  await calm.close();
});

test('footer lists the site pages, projects and contact channels', async ({ page }) => {
  await page.goto('/');
  const footer = page.locator('footer');
  for (const label of ['Home', 'Skills', 'Craft', 'Projects', 'Experience', 'Contact']) {
    await expect(footer.getByRole('navigation', { name: 'Footer: explore' }).getByRole('link', { name: label, exact: true })).toHaveAttribute('href', /^#/);
  }
  for (const { name } of projects.filter((project) => project.href)) {
    await expect(footer.getByRole('navigation', { name: 'Footer: projects' }).getByRole('link', { name })).toHaveAttribute('href', /^https:\/\//);
  }
  await expect(footer.getByRole('link', { name: 'GitLab' })).toHaveAttribute('href', /gitlab\.com/);
  await expect(footer.getByRole('link', { name: /Back to top/ })).toHaveAttribute('href', '#top');
});

test('brand marquee: real logos, two moving rows, static under reduced motion', async ({ browser }) => {
  const page = await browser.newPage();
  await page.goto('/');
  const rows = page.locator('.logos__row');
  await expect(rows).toHaveCount(2);
  await expect(page.locator('.logos__row').first()).toContainText('Market with');
  // Inline SVG brand marks, each with an accessible name.
  expect(await page.locator('.logos__tile svg').count()).toBeGreaterThan(40);
  for (const name of ['Meta Ads', 'Google Ads', 'Shopify', 'Claude', 'Python', 'Cloudflare']) await expect(page.locator('.logos').getByText(name, { exact: true }).first()).toBeAttached();
  await expect(page.locator('.logos__track').first()).toHaveCSS('animation-name', 'logos-scroll');
  await expect(rows.first()).toHaveCSS('animation-name', 'logos-float');
  await page.close();
  const calm = await browser.newPage({ reducedMotion: 'reduce' });
  await calm.goto('/');
  await expect(calm.locator('.logos__track').first()).toHaveCSS('animation-name', 'none');
  await calm.close();
});

test('social icons appear once (footer) and link to every profile', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.socials')).toHaveCount(1);
  // Each profile is linked exactly once on the page's chrome (no LinkedIn duplicate in Connect).
  await expect(page.locator('footer a[href*="linkedin.com"]')).toHaveCount(1);
  for (const nav of ['Footer: social profiles']) {
    const icons = page.getByRole('navigation', { name: nav });
    for (const { name, href } of socialLinks) {
      await expect(icons.getByRole('link', { name, exact: true })).toHaveAttribute('href', href);
    }
  }
});

test('footer brand column: status line and social icons never overlap', async ({ page }) => {
  for (const width of [1680, 1280, 1000, 760, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
    const gap = await page.evaluate(() => {
      const status = document.querySelector('.float-footer__status')!.getBoundingClientRect();
      const icons = document.querySelector('.float-footer .socials')!.getBoundingClientRect();
      return icons.top - status.bottom;
    });
    expect(gap, `gap at ${width}px`).toBeGreaterThanOrEqual(12);
  }
});

test('glass cards tilt toward the pointer and settle back on leave', async ({ page }) => {
  await page.goto('/');
  const tile = page.locator('.project').first();
  await tile.scrollIntoViewIfNeeded();
  const box = (await tile.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.move(box.x + box.width * 0.9, box.y + box.height * 0.1, { steps: 5 });
  await expect(tile).toHaveClass(/is-tilting/);
  await expect.poll(() => tile.evaluate((el) => el.style.transform)).toMatch(/rotateY\([1-9]/);
  await page.mouse.move(2, 2);
  await expect(tile).not.toHaveClass(/is-tilting/);
  await expect.poll(() => tile.evaluate((el) => el.style.transform)).not.toMatch(/rotate/);
});
