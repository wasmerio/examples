import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Posts", path: "/posts" },
  { name: "Search", path: "/search" },
  { name: "Archives", path: "/archives" },
  { name: "404", path: "/404" },
  { name: "Posts/md", path: "/posts/markdown-style-guide" },
];

for (const { name, path } of pages) {
  test(`${name} (${path}) should have no a11y violations`, async ({ page }) => {
    await page.goto(path);
    const res = await new AxeBuilder({ page }).analyze();
    expect(res.violations).toEqual([]);
  });
}
