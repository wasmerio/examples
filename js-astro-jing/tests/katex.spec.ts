import { expect, test } from "@playwright/test";

const BLOG_POST = "/posts/markdown-style-guide";

test.describe("KaTeX math rendering", () => {
  test("inline and block math render without errors", async ({ page }) => {
    await page.goto(BLOG_POST);

    const mathElements = page.locator(".katex");
    expect(await mathElements.count()).toBeGreaterThan(1);
    await expect(mathElements.first()).toBeVisible();

    // KaTeX renders unparsable input inside a `.katex-error` span
    expect(await page.locator(".katex-error").count()).toBe(0);
  });

  test("math fonts load without triggering a network error", async ({ page }) => {
    const failedRequests: string[] = [];
    page.on("requestfailed", (request) => {
      if (request.url().includes("KaTeX")) failedRequests.push(request.url());
    });

    await page.goto(BLOG_POST);
    await page.locator(".katex").first().waitFor();

    expect(failedRequests).toEqual([]);
  });
});
