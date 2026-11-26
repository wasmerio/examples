import { expect, test } from "@playwright/test";

test.describe("Pagefind search", () => {
  test("search skeleton is replaced by the searchbox", async ({ page }) => {
    await page.goto("/search");

    await expect(page.locator("#search")).toBeVisible();
    await expect(page.locator(".pf-searchbox-input")).toBeVisible();
    await expect(page.locator("#search-skeleton")).toBeHidden();
  });

  test("searchbox is horizontally centered in the search stack", async ({ page }) => {
    await page.goto("/search");
    await expect(page.locator(".pf-searchbox-input")).toBeVisible();

    const stack = await page.locator("#search-stack").boundingBox();
    const box = await page.locator(".pf-searchbox").boundingBox();
    if (!stack || !box) throw new Error("expected elements to have a layout box");

    const leftGap = box.x - stack.x;
    const rightGap = stack.x + stack.width - (box.x + box.width);
    expect(leftGap).toBeCloseTo(rightGap, 0);
  });

  test("skeleton is sized to match the searchbox, avoiding layout shift", async ({ page }) => {
    await page.goto("/search");
    await expect(page.locator(".pf-searchbox-input")).toBeVisible();

    // the real skeleton element may already be hidden by the time the page settles, so measure
    // a fresh probe with the same class instead of racing against hideSkeleton().
    const skeleton = await page.evaluate(() => {
      // wrap it the same way #search-skeleton does, since a bare grid item with
      // `margin: auto` shrinks to content instead of stretching like a block child does.
      const wrapper = document.createElement("div");
      wrapper.style.visibility = "hidden";
      const probe = document.createElement("div");
      probe.className = "skeleton-input";
      wrapper.appendChild(probe);
      const stack = document.getElementById("search-stack");
      if (!stack) throw new Error("expected #search-stack to exist");
      stack.appendChild(wrapper);
      const rect = probe.getBoundingClientRect();
      wrapper.remove();
      return { width: rect.width, height: rect.height };
    });
    const box = await page.locator(".pf-searchbox").boundingBox();
    if (!box) throw new Error("expected .pf-searchbox to have a layout box");

    expect(box.width).toBeCloseTo(skeleton.width, 0);
    expect(box.height).toBeCloseTo(skeleton.height, 0);
  });

  test("typing a query returns a matching result", async ({ page }) => {
    await page.goto("/search");

    await page.locator(".pf-searchbox-input").fill("markdown");

    const results = page.locator(".pf-searchbox-result");
    await expect(results.first()).toBeVisible();
    await expect(results.first()).toHaveAttribute("href", /\/posts\/markdown-style-guide/);
  });

  test("clicking a result navigates to the matching page", async ({ page }) => {
    await page.goto("/search");

    await page.locator(".pf-searchbox-input").fill("markdown");
    await page.locator(".pf-searchbox-result").first().click();

    await page.waitForURL("**/posts/markdown-style-guide**");
  });
});
