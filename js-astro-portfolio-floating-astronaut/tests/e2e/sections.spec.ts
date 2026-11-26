import { test, expect } from '@playwright/test';
import { experience, education, certifications } from '../../src/data/profile';
import { projects } from '../../src/data/projects';
import { primary, secondary } from '../../src/data/capabilities';
import { site } from '../../src/lib/site';

test('sections render in order with real content (JS off too)', async ({ browser }) => {
  const page = await browser.newPage({ javaScriptEnabled: false });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(new RegExp(site.name.split(' ').join('\\s*')));
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  const order = await page.locator('main section[id]').evaluateAll((els) => els.map((el) => el.id));
  expect(order).toEqual(['top', 'skills', 'craft', 'projects', 'experience', 'contact']);
  for (const item of [...primary, ...secondary]) await expect(page.getByRole('heading', { name: item.title, exact: true })).toBeVisible();
  for (const project of projects) {
    await expect(page.getByRole('heading', { name: project.name, exact: true })).toBeVisible();
    if (project.href) await expect(page.getByRole('link', { name: `Visit ${project.name}` })).toHaveAttribute('href', project.href);
    else await expect(page.getByRole('link', { name: `Visit ${project.name}` })).toHaveCount(0);
  }
  for (const role of experience) {
    await expect(page.locator('#experience')).toContainText(role.org);
    // Full original bullets stay in the DOM (inside <details>) for recruiters, ATS and search.
    const text = await page.locator('#experience').textContent();
    expect(text).toContain(role.summary);
    for (const bullet of role.bullets) expect(text).toContain(bullet);
  }
  for (const school of education.slice(0, 3)) await expect(page.locator('#experience')).toContainText(school.school);
  for (const cert of certifications) await expect(page.locator('#experience')).toContainText(cert);
  await expect(page.locator('#contact').getByRole('link', { name: 'Email me' })).toHaveAttribute('href', /^mailto:/);
  await page.close();
});

test('film spans the whole page and the background is dimmed', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.locator('.film-world')).toHaveClass(/is-ready/);
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  await expect(page.locator('html')).toHaveAttribute('data-chapter', '4', { timeout: 8000 });
  const dim = await page.locator('.film-video__grade').evaluate((el) => getComputedStyle(el).getPropertyValue('--film-dim').trim());
  expect(Number(dim)).toBeGreaterThanOrEqual(0.4);
});
