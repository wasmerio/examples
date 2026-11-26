import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test.beforeEach(async ({ page }) => await page.goto("localhost:4321"));

  test("Correct title", async ({ page }) => {
    await expect(page).toHaveTitle("Your Company - What You Do");
  });

  test("navigation links exist, can be clicked and redirect", async ({
    page,
  }) => {
    const aboutLink = page.locator('[data-testid="nav-link-About"]');
    const servicesLink = page.locator('[data-testid="nav-link-Services"]');
    const reviewsLink = page.locator('[data-testid="nav-link-Reviews"]');
    const contactLink = page.locator('[data-testid="nav-link-Contact"]');
    const faqLink = page.locator('[data-testid="nav-link-FAQ"]');

    await expect(aboutLink).toBeVisible();
    await aboutLink.click();
    await expect(page).toHaveURL("http://localhost:4321/About");

    await expect(servicesLink).toBeVisible();
    await servicesLink.click();
    await expect(page).toHaveURL("http://localhost:4321/Services");

    await expect(reviewsLink).toBeVisible();
    await reviewsLink.click();
    await expect(page).toHaveURL("http://localhost:4321/Reviews");

    await expect(contactLink).toBeVisible();
    await contactLink.click();
    await expect(page).toHaveURL("http://localhost:4321/Contact");

    await expect(faqLink).toBeVisible();
    await faqLink.click();
    await expect(page).toHaveURL("http://localhost:4321/#FAQ");
  });

  test("desktop theme toggle works", async ({ page }) => {
    const themeToggle = page.locator('[data-testid="theme-toggle-desktop"]');
    await expect(themeToggle).toBeVisible();
    await themeToggle.click();
    await expect(page.locator("body")).toHaveClass(/dark/);
    await themeToggle.click();
  });

  test("hero section to have correct text", async ({ page }) => {
    const heroImg = page.locator('[data-testid="hero-img"]');
    const heroText = page.locator('[data-testid="hero-text"]');
    const IntroText = page.locator('[data-testid="intro-text"]');

    await expect(heroImg).toBeVisible();

    await expect(heroText).toBeVisible();
    await expect(heroText).toHaveText("Main Keywords");

    await expect(IntroText).toBeVisible();
    await expect(IntroText).toHaveText("brief description of services");
  });

  test("services section to have working links", async ({ page }) => {
    await page
      .locator("section")
      .filter({ hasText: "Name of this service Lorem" })
      .getByRole("link")
      .click();
    await expect(page).toHaveURL("http://localhost:4321/Services");
    await page.locator("h1").filter({ hasText: "LOGO" }).click();
    await expect(page).toHaveURL("http://localhost:4321/");
    await page.getByRole("link", { name: "About Our Services" }).nth(1).click();
    await expect(page).toHaveURL("http://localhost:4321/Services");
  });
});
