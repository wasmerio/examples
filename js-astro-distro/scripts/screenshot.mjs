/**
 * One-off screenshot capture for the astro-distro template.
 *
 * Captures 4 theme screenshots + 1 featured, all 16:9 / 1280px wide.
 * Scrolled to #about so lazygit (bio + status + paths) is the main subject.
 *
 * Usage:
 *   bun run build
 *   bun run preview &              # serves dist/ at http://127.0.0.1:4321
 *   node scripts/screenshot.mjs    # captures and writes PNGs
 *
 * Requires playwright available via NODE_PATH or installed globally.
 * This file is intentionally NOT wired to package.json so it doesn't
 * add playwright as a project dep.
 */
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

const BASE = process.env.SCREENSHOT_BASE ?? "http://127.0.0.1:4321";
const THEMES = ["debian", "arch", "linuxmint", "kali"];
const VIEWPORT = { width: 1280, height: 720 };

const OUT = "docs/screenshots";
mkdirSync(`${OUT}/themes`, { recursive: true });

const browser = await chromium.launch();

// ── Theme screenshots (1280×720, top of page) ───────────────────────
const themeCtx = await browser.newContext({ viewport: VIEWPORT });
for (const theme of THEMES) {
	await themeCtx.addInitScript((t) => {
		localStorage.setItem("theme", t);
	}, theme);
	const page = await themeCtx.newPage();
	await page.goto(BASE, { waitUntil: "networkidle" });
	await page.waitForTimeout(400);
	const path = `${OUT}/themes/theme-${theme}.png`;
	await page.screenshot({ path });
	await page.close();
	console.log(`✓ ${path}`);
}
await themeCtx.close();

// ── Featured (1280×720, debian theme, top of page) ──────────────────
const featCtx = await browser.newContext({ viewport: VIEWPORT });
await featCtx.addInitScript(() => {
	localStorage.setItem("theme", "debian");
});
const featPage = await featCtx.newPage();
await featPage.goto(BASE, { waitUntil: "networkidle" });
await featPage.waitForTimeout(400);
const featured = `${OUT}/featured.png`;
await featPage.screenshot({ path: featured });
console.log(`✓ ${featured}`);
await featCtx.close();

await browser.close();
