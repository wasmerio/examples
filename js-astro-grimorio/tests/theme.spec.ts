import { test, expect } from "@playwright/test";
import { useTranslations } from "../src/i18n";

const t = useTranslations("en");

for (const reducedMotion of ["no-preference", "reduce"] as const) {
  for (const path of ["/", "/posts/"]) {
    test(`Theme colors switch together (${reducedMotion}, ${path})`, async ({
      page,
      isMobile,
    }) => {
      await page.emulateMedia({ colorScheme: "light", reducedMotion });
      await page.goto(path);
      // Guarantee enough height to reach the scrolled header state.
      await page.addStyleTag({ content: "body { min-height: 300vh; }" });
      await expect(
        page.getByRole("button", { name: t("nav.dark") }),
      ).toBeVisible();
      await expect(page.locator(".post-feed")).toHaveAttribute(
        "data-ready",
        "true",
      );

      // Exercise both the transparent header and its themed, scrolled surface.
      for (const scrolled of [false, true]) {
        await page.evaluate((scrolled) => {
          window.scrollTo({ top: scrolled ? 500 : 0, behavior: "instant" });
        }, scrolled);
        if (scrolled) {
          await expect(page.locator(".nav-header")).toHaveClass(/scrolled/);
          if (isMobile) {
            await page.getByRole("button", { name: t("nav.openMenu") }).click();
          }
        }

        for (const theme of ["dark", "light"] as const) {
          const button = page.getByRole("button", { name: t(`nav.${theme}`) });
          const frames = await button.evaluate(async (element) => {
            const snapshot = () =>
              [
                ...document.querySelectorAll(
                  "body, .nav-header, .brand, nav, nav a, .main-container, " +
                    ".card, .site-footer, .site-footer a, .wave-layer, .chip, " +
                    ".post-cover",
                ),
              ].map((node) => {
                const style = getComputedStyle(node);
                return {
                  color: style.color,
                  background: style.backgroundColor,
                  border: style.borderColor,
                  fill: style.fill,
                  filter: style.filter,
                  shadow: style.boxShadow,
                };
              });
            (element as HTMLButtonElement).click();
            const samples = [snapshot()];
            for (let frame = 0; frame < 3; frame++) {
              await new Promise<void>((resolve) =>
                requestAnimationFrame(() => resolve()),
              );
              samples.push(snapshot());
            }
            await new Promise((resolve) => setTimeout(resolve, 350));
            return { samples, settled: snapshot() };
          });
          for (const sample of frames.samples) {
            expect(sample).toEqual(frames.settled);
          }
          await expect(page.locator("html")).toHaveClass(
            theme === "dark" ? /dark/ : /^(?!.*dark)/,
          );
          expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe(
            theme,
          );
        }
      }

      // Rapid toggles must restore hover transitions and keep the final theme.
      await page
        .getByRole("button", { name: t("nav.dark") })
        .evaluate((node) => {
          const button = node as HTMLButtonElement;
          button.click();
          button.click();
          button.click();
        });
      await expect(page.locator("html")).toHaveClass(/dark/);
      await expect(page.locator("html")).not.toHaveAttribute(
        "data-theme-changing",
      );
      if (reducedMotion === "no-preference") {
        await expect(page.locator(".site-footer nav a").first()).toHaveCSS(
          "transition-duration",
          /^0\.18s(?:, 0\.18s)*$/,
        );
      }
      await page.reload();
      await expect(page.locator("html")).toHaveClass(/dark/);
      await expect(
        page.getByRole("button", { name: t("nav.light") }),
      ).toBeVisible();
    });
  }
}
