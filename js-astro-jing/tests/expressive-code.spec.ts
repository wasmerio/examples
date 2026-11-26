import { expect, test } from "@playwright/test";

const BLOG_POST = "/posts/markdown-style-guide";

test.describe("Expressive Code rendering", () => {
  test("code blocks render with syntax highlighting", async ({ page }) => {
    await page.goto(BLOG_POST);

    const blocks = page.locator(".expressive-code");
    await expect(blocks.first()).toBeVisible();
    expect(await blocks.count()).toBeGreaterThan(1);

    const firstBlock = blocks.first();
    await expect(firstBlock.locator("pre[data-language]")).toBeVisible();
    await expect(firstBlock.locator(".ec-line").first()).toBeVisible();
    // Highlighted tokens are rendered as inline-styled spans, not plain text
    expect(await firstBlock.locator(".ec-line span[style]").count()).toBeGreaterThan(0);
  });

  test("copy-to-clipboard button is present on code blocks", async ({ page }) => {
    await page.goto(BLOG_POST);

    const copyButton = page.locator(".expressive-code .copy button").first();
    await expect(copyButton).toBeVisible();
  });
});
