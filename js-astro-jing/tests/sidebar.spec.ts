import { expect, test } from "@playwright/test";

const POST_LIST = "/posts";
const BLOG_POST = "/posts/markdown-style-guide";

// The FAB and overlay are only active on mobile
test.use({ viewport: { width: 390, height: 844 } });

test.describe("Sidebar toggle", () => {
  test("FAB is visible on mobile", async ({ page }) => {
    await page.goto(BLOG_POST);
    await expect(page.locator(".sidebar-fab")).toBeVisible();
  });

  test("opens and closes on initial load", async ({ page }) => {
    await page.goto(BLOG_POST);
    const fab = page.locator(".sidebar-fab");
    const sidebar = page.locator(".sidebar").first();

    await expect(sidebar).not.toHaveClass(/\bopen\b/);
    await fab.click();
    await expect(sidebar).toHaveClass(/\bopen\b/);
    // The open sidebar may visually overlap the FAB; force the click to test the handler.
    await fab.click({ force: true });
    await expect(sidebar).not.toHaveClass(/\bopen\b/);
  });

  test("overlay click closes sidebar", async ({ page }) => {
    await page.goto(BLOG_POST);
    const fab = page.locator(".sidebar-fab");
    const sidebar = page.locator(".sidebar").first();
    const overlay = page.locator(".sidebar-overlay");

    await fab.click();
    await expect(sidebar).toHaveClass(/\bopen\b/);
    await overlay.click();
    await expect(sidebar).not.toHaveClass(/\bopen\b/);
  });

  test("toggle works after post-list → blog-post navigation", async ({ page }) => {
    await page.goto(POST_LIST);
    // Use a real link click to trigger Astro View Transitions
    await page.locator(`a[href^="/posts/"]`).first().click();
    await page.waitForURL("**/posts/**");

    const fab = page.locator(".sidebar-fab");
    const sidebar = page.locator(".sidebar").first();

    await expect(fab).toBeVisible();
    await fab.click();
    await expect(sidebar).toHaveClass(/\bopen\b/);
  });

  test("toggle works after blog-post → post-list navigation", async ({ page }) => {
    await page.goto(BLOG_POST);
    // On mobile the nav links are hidden behind the menu-toggle; open it first.
    await page.locator(".menu-toggle").click();
    await page.locator(`a[href="${POST_LIST}"]`).first().click();
    await page.waitForURL(`**${POST_LIST}`);

    const fab = page.locator(".sidebar-fab");
    const sidebar = page.locator(".sidebar").first();

    await expect(fab).toBeVisible();
    await fab.click();
    await expect(sidebar).toHaveClass(/\bopen\b/);
  });

  test("toggle works after multiple navigation", async ({ page }) => {
    await page.goto(POST_LIST);
    const postLink = page.locator(`a[href^="/posts/"]`).first();
    const postHref = await postLink.getAttribute("href");

    // forward
    await postLink.click();
    await page.waitForURL("**/posts/**");

    // back
    await page.goBack();
    await page.waitForURL(`**${POST_LIST}`);

    // forward again
    await page.locator(`a[href="${postHref}"]`).click();
    await page.waitForURL("**/posts/**");

    const fab = page.locator(".sidebar-fab");
    const sidebar = page.locator(".sidebar").first();

    await expect(fab).toBeVisible();
    await fab.click();
    await expect(sidebar).toHaveClass(/\bopen\b/);
  });
});
