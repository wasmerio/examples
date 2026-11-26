import { expect, test } from '@playwright/test';

let errors: string[] = [];
test.beforeEach(async ({ page, baseURL }) => {
	errors = [];
	page.on('pageerror', (error) => errors.push(error.message));
	page.on('response', (response) => {
		if (response.url().startsWith(baseURL!) && response.status() >= 400) {
			errors.push(`${response.status()} ${response.url()}`);
		}
	});
	// Exercise system-font fallback without depending on Google's availability.
	await page.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\//, (route) => route.abort());
});
test.afterEach(() => expect(errors, 'No browser exceptions or failed local assets').toEqual([]));

test('mobile menu supports Escape, breakpoint changes, and navigation', async ({ page }) => {
	await page.setViewportSize({ width: 320, height: 900 });
	await page.goto('/');
	const toggle = page.locator('#mobile-menu-toggle');
	const menu = page.locator('#mobile-menu');
	await expect(menu).toBeHidden();
	await toggle.click();
	await expect(toggle).toHaveAttribute('aria-expanded', 'true');
	await expect(menu).toBeVisible();
	await page.keyboard.press('Escape');
	await expect(menu).toBeHidden();
	await expect(toggle).toBeFocused();
	await toggle.click();
	await page.setViewportSize({ width: 1440, height: 900 });
	await expect(menu).toBeHidden();
	await page.setViewportSize({ width: 320, height: 900 });
	await expect(toggle).toHaveAttribute('aria-expanded', 'false');
	await toggle.click();
	await menu.getByRole('link', { name: 'Projects', exact: true }).click();
	await expect(page).toHaveURL(/\/projects\/?$/);
	await expect(menu).toBeHidden();
	await expect(page.getByRole('heading', { name: 'Nested project' })).toBeVisible();
});

test('theme follows the system until a saved choice overrides it', async ({ page }) => {
	await page.goto('/');
	const root = page.locator('html');
	await expect(root).toHaveAttribute('data-theme', 'light');
	await page.emulateMedia({ colorScheme: 'dark' });
	await expect(root).toHaveAttribute('data-theme', 'dark');
	await page.getByRole('button', { name: 'Switch to light mode', exact: true }).click();
	await expect(root).toHaveAttribute('data-theme', 'light');
	await page.reload();
	await expect(root).toHaveAttribute('data-theme', 'light');
	await expect(page.getByRole('button', { name: 'Switch to dark mode', exact: true })).toBeVisible();
	await page.goto('/researches/');
	await expect(root).toHaveAttribute('data-theme', 'light');
	await expect.poll(() => page.evaluate(() => localStorage.getItem('site-theme'))).toBe('light');
});

test('filters restore deep links and preserve unrelated URL state', async ({ page }) => {
	await page.goto('/researches/?source=regression&filter=working-paper#papers-container');
	const working = page.locator('[data-filter="working-paper"]');
	const publication = page.locator('[data-filter-section="publication"]');
	await expect(working).toHaveAttribute('aria-pressed', 'true');
	await expect(publication).toBeHidden();
	await expect(page.locator('[data-filter-section="working-paper"]')).toBeVisible();
	await expect(page.locator('[data-filter-status]')).toHaveText('1 item shown in working paper.');
	await page.locator('[data-filter="publication"]').click();
	await expect(page).toHaveURL(/source=regression&filter=publication#papers-container$/);
	await page.reload();
	await expect(publication).toBeVisible();
	await expect(page.locator('[data-filter-section="working-paper"]')).toBeHidden();
	await page.locator('[data-filter="all"]').click();
	await expect(page).toHaveURL(/\?source=regression#papers-container$/);
	await expect(page.locator('[data-filter-section]:visible')).toHaveCount(2);
	await page.goto('/researches/?filter=unknown');
	await expect(page.locator('[data-filter="all"]')).toHaveAttribute('aria-pressed', 'true');
	await expect(page.locator('[data-filter-section]:visible')).toHaveCount(2);
});

test('citation formats, native clipboard, and dialog focus work', async ({ page, context, browserName }) => {
	if (browserName === 'chromium') await context.grantPermissions(['clipboard-read', 'clipboard-write']);
	await page.goto('/researches/');
	const trigger = page.getByRole('button', { name: 'Cite Single paper', exact: true });
	await trigger.click();
	const dialog = page.getByRole('dialog', { name: 'Cite this paper' });
	await expect(dialog).toBeVisible();
	await expect(dialog.locator('[data-citation-output]')).toContainText('@article{single,');
	for (const label of ['APA 7', 'Chicago', 'Harvard']) {
		const button = dialog.getByRole('button', { name: label, exact: true });
		await button.click();
		await expect(button).toHaveAttribute('aria-pressed', 'true');
		await expect(dialog.locator('[data-citation-output]')).toContainText('Single paper');
		await expect(dialog.locator('[data-citation-format-label]')).toHaveText(`${label} citation`);
	}
	await dialog.getByRole('button', { name: 'Copy citation', exact: true }).click();
	await expect(dialog.locator('[data-copy-status]')).toHaveText('Harvard citation copied.');
	if (browserName === 'chromium') {
		expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(await dialog.locator('[data-citation-output]').textContent());
	}
	await page.keyboard.press('Escape');
	await expect(dialog).toBeHidden();
	await expect(trigger).toBeFocused();
	await trigger.click();
	await expect(dialog.locator('[data-copy-status]')).toHaveText('Ready to copy.');
	await expect(dialog.getByRole('button', { name: 'BibTeX', exact: true })).toHaveAttribute('aria-pressed', 'true');
	await dialog.getByRole('button', { name: 'Close citation window' }).click();
	await expect(trigger).toBeFocused();
});

test('clipboard denial leaves a readable, focused citation on a narrow screen', async ({ page }) => {
	await page.setViewportSize({ width: 320, height: 900 });
	await page.emulateMedia({ colorScheme: 'dark' });
	await page.addInitScript(() => {
		Object.defineProperty(navigator, 'clipboard', {
			value: { writeText: async () => { throw new DOMException('Denied', 'NotAllowedError'); } },
		});
	});
	await page.goto('/researches/');
	await page.getByRole('button', { name: 'Cite Single paper', exact: true }).click();
	const dialog = page.getByRole('dialog', { name: 'Cite this paper' });
	await dialog.getByRole('button', { name: 'Copy citation', exact: true }).click();
	await expect(dialog.locator('[data-copy-status]')).toHaveText('Copy unavailable. Select the citation text manually.');
	await expect(dialog.locator('pre')).toBeFocused();
	await expect(dialog.locator('[data-citation-output]')).toContainText('Single paper');
	const box = await dialog.boundingBox();
	expect(box!.x).toBeGreaterThanOrEqual(0);
	expect(box!.x + box!.width).toBeLessThanOrEqual(320);
	await test.info().attach('mobile-dark-citation', { body: await page.screenshot(), contentType: 'image/png' });
});

test('real MDX, wide tables, code, images, and enlarged text stay usable', async ({ page }) => {
	await page.setViewportSize({ width: 320, height: 900 });
	await page.goto('/posts/regression/note/');
	await expect(page.locator('[data-mdx-check]')).toHaveText('3');
	const table = page.locator('.prose table');
	await expect(table).toHaveAttribute('tabindex', '0');
	await table.focus();
	await expect(table).toBeFocused();
	// WebKit's native scrolling needs a key held through a rendering frame.
	await table.press('ArrowRight', { delay: 150 });
	await expect.poll(() => table.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
	for (const fontSize of ['16px', '32px']) {
		await page.locator('html').evaluate((element, size) => { element.style.fontSize = size; }, fontSize);
		await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
		await expect.poll(() => table.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
		await expect.poll(() => page.locator('.prose pre').evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
	}
	const skipLink = page.getByRole('link', { name: 'Skip to main content' });
	await expect.poll(async () => {
		const box = await skipLink.boundingBox();
		return box!.y + box!.height;
	}).toBeLessThanOrEqual(0);
	await skipLink.focus();
	await expect(skipLink).toBeInViewport();
	await skipLink.press('Enter');
	await expect(page.locator('#main-content')).toBeFocused();
	await expect(skipLink).not.toBeInViewport();
	await test.info().attach('mobile-enlarged-content', { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
	await page.goto('/posts/regression/covered/');
	const image = page.getByRole('img', { name: 'Solid blue test image' });
	await image.scrollIntoViewIfNeeded();
	await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
	await expect(image).toHaveAttribute('srcset', /\.webp/);
	for (const [route, title] of [['/projects/regression/project/', 'Nested project'], ['/teaching/regression/course/', 'Nested course']]) {
		await page.goto(route);
		await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
		await page.locator('html').evaluate((element) => { element.style.fontSize = '32px'; });
		await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
	}
});

test('delayed assets and reduced motion preserve navigation and back-to-top', async ({ page, context, browserName }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.setViewportSize({ width: 320, height: 900 });
	// Fixed asset latency works in all engines; Chromium also supports bandwidth throttling.
	await page.route('**/_astro/**', async (route) => {
		await new Promise((resolve) => setTimeout(resolve, 300));
		await route.continue();
	});
	if (browserName === 'chromium') {
		const session = await context.newCDPSession(page);
		await session.send('Network.enable');
		await session.send('Network.emulateNetworkConditions', {
			offline: false, latency: 200, downloadThroughput: 175_000, uploadThroughput: 75_000,
		});
	}
	await page.goto('/posts/regression/note/');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Regression note');
	await page.locator('#mobile-menu-toggle').click();
	await expect(page.locator('#mobile-menu')).toBeVisible();
	await page.keyboard.press('Escape');
	await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
	const backToTop = page.locator('#back-to-top');
	await expect(backToTop).toHaveAttribute('data-visible', 'true');
	await backToTop.click();
	await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
	await expect(backToTop).toHaveAttribute('tabindex', '-1');
	const navigation = await page.evaluate(() => performance.getEntriesByType('navigation')[0].toJSON());
	await test.info().attach('navigation-timing', { body: JSON.stringify({ browserName, assetDelayMs: 300, chromiumBandwidthBytesPerSecond: browserName === 'chromium' ? 175_000 : null, navigation }, null, 2), contentType: 'application/json' });
});
