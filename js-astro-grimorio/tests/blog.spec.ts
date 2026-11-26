import { test, expect } from "@playwright/test";
import { ogLocales, translate, useTranslations } from "../src/i18n";
import settings from "../src/site.config.json" with { type: "json" };

const language = "en";
const t = useTranslations(language);

test("Home categories and URL state after reload", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".post-feed")).toHaveAttribute(
    "data-ready",
    "true",
  );
  await expect(page.locator(".post-card")).toHaveCount(3);
  for (const category of ["guides", "notes", "stories"] as const) {
    await page
      .getByRole("button", { name: t(`category.${category}`), exact: true })
      .click();
    await expect(page.locator(".post-card")).toHaveCount(1);
    await expect(
      page.locator(`.post-card:not([data-category="${category}"])`),
    ).toHaveCount(0);
  }
  await expect(page).toHaveURL(/category=stories/);
  await page.reload();
  await expect(page.locator(".post-card")).toHaveCount(1);
  await expect(
    page.locator('.post-card[data-category="stories"]'),
  ).toHaveCount(1);
});

test("Tags, month archives, and an unknown category", async ({ page }) => {
  await page.goto("/posts/?tag=Markdown");
  await expect(page.locator(".post-card")).toHaveCount(1);
  await page.goto("/posts/?month=2026-03");
  await expect(page.locator(".post-card")).toHaveCount(2);
  await expect(page.locator(".filter-summary")).toContainText("2026-03");
  await page.goto("/posts/?category=missing&page=-5");
  await expect(page.getByText(t("post.emptyTitle"))).toBeVisible();
  await page.getByRole("button", { name: t("post.viewAll") }).click();
  await expect(page.locator(".post-card")).toHaveCount(3);
});

test("Search, empty results, and focus restoration", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".post-feed")).toHaveAttribute(
    "data-ready",
    "true",
  );
  const opener = page.getByRole("button", {
    name: t("nav.search"),
    exact: true,
  });
  await opener.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await page
    .getByRole("searchbox", { name: t("search.keywords") })
    .fill("signal");
  await expect(dialog.locator(".search-result")).toHaveCount(1);
  await page
    .getByRole("searchbox", { name: t("search.keywords") })
    .fill("no-such-post-9876");
  await expect(dialog.getByText(t("search.emptyTitle"))).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(opener).toBeFocused();
  await page.keyboard.press("Control+k");
  await expect(dialog).toBeVisible();
  await page
    .getByRole("searchbox", { name: t("search.keywords") })
    .fill("signal");
  await dialog.locator(".search-result").click();
  await expect(page).toHaveURL(/a-weekend-in-the-mountains/);
  await expect(page.locator("#article-body")).toBeVisible();
});

test("Theme persistence across reloads and pages", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".post-feed")).toHaveAttribute(
    "data-ready",
    "true",
  );
  await page.getByRole("button", { name: t("nav.dark") }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect(page.locator("html")).toHaveCSS("filter", "none");
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.goto("/about/");
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.getByRole("button", { name: t("nav.light") }).click();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
});

test("Blocked storage: themes still switch without errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => {
    Object.defineProperty(Storage.prototype, "getItem", {
      value: () => {
        throw new Error("Storage blocked");
      },
    });
    Object.defineProperty(Storage.prototype, "setItem", {
      value: () => {
        throw new Error("Storage blocked");
      },
    });
  });
  await page.goto("/");
  await expect(page.locator(".post-feed")).toHaveAttribute(
    "data-ready",
    "true",
  );
  await page.getByRole("button", { name: t("nav.dark") }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  expect(errors).toEqual([]);
});

test("Article contents, code blocks, and adjacent posts", async ({
  page,
  isMobile,
}) => {
  await page.goto("/posts/writing-with-markdown/");
  await expect(page.locator(".article-header h1")).toContainText("Markdown");
  await expect(page.locator("#article-body h2")).toHaveCount(6);
  await expect(page.locator("#article-body table")).toHaveCount(1);
  await expect(page.locator(".copy-code")).toHaveCount(3);
  if (isMobile) {
    await page.locator(".mobile-toc summary").click();
    await page.locator(".mobile-toc a").last().click();
  } else {
    await page.locator(".toc a").last().click();
  }
  await expect(page).toHaveURL(/#/);
  await expect(page.locator("#reading-progress")).not.toHaveAttribute(
    "style",
    "width: 0%;",
  );
  await page.locator(".adjacent-posts a").click();
  await expect(page).toHaveURL(/a-weekend-in-the-mountains/);
});

test("Page layouts, assets, and browser errors", async ({ page, isMobile }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  for (const path of [
    "/",
    "/posts/",
    "/projects/",
    "/about/",
    "/posts/writing-with-markdown/",
  ]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await page.evaluate(() => document.fonts.ready);
    const size = await page.evaluate(() => ({
      width: innerWidth,
      content: document.documentElement.scrollWidth,
    }));
    expect(size.content, path).toBeLessThanOrEqual(size.width);
    await expect(page.locator("img")).not.toHaveCount(0);
    // Bring lazy images into view; hidden ones (e.g. mobile sidebar) never load.
    await page.evaluate(async () => {
      scrollTo(0, document.body.scrollHeight);
      await Promise.all(
        [...document.images]
          .filter((image) => image.getClientRects().length > 0)
          .map((image) => image.decode().catch(() => {})),
      );
      scrollTo(0, 0);
    });
    // Only check same-origin images: remote demo images may be unreachable in CI.
    const broken = await page.locator("img").evaluateAll((images) =>
      images
        .filter((image) => image.getClientRects().length > 0)
        .filter((image) => {
          try {
            return (
              new URL((image as HTMLImageElement).src, location.href).origin ===
              location.origin
            );
          } catch {
            return false;
          }
        })
        .filter(
          (image) =>
            !(image as HTMLImageElement).complete ||
            (image as HTMLImageElement).naturalWidth === 0,
        )
        .map((image) => image.getAttribute("src")),
    );
    expect(broken).toEqual([]);
  }
  if (isMobile) {
    await page.getByRole("button", { name: t("nav.openMenu") }).click();
    await expect(
      page.getByRole("navigation", { name: t("nav.main") }),
    ).toBeVisible();
    await page
      .getByRole("navigation", { name: t("nav.main") })
      .getByRole("link", { name: t("nav.projects") })
      .click();
    await expect(page).toHaveURL(/projects/);
  }
  expect(errors).toEqual([]);
});

test("Sitemap, RSS, and 404", async ({ page, request }) => {
  const feed = await request.get("/rss.xml");
  expect(feed.status()).toBe(200);
  expect((await feed.text()).match(/<item>/g)).toHaveLength(3);
  expect((await request.get("/sitemap.xml")).status()).toBe(200);
  expect(await (await request.get("/robots.txt")).text()).toContain("Sitemap:");
  const response = await page.goto("/a-page-that-does-not-exist/");
  expect(response?.status()).toBe(404);
  await expect(page.getByText(t("error.heading"))).toBeVisible();
});

test("SEO metadata, official sitemap, and RSS consistency", async ({
  page,
  request,
}) => {
  await page.goto("/posts/writing-with-markdown/?tracking=example#article-body");
  await expect(page.locator("h1")).toHaveCount(1);
  const canonical = await page
    .locator('link[rel="canonical"]')
    .getAttribute("href");
  expect(canonical).toMatch(/\/posts\/writing-with-markdown\/$/);
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    "content",
    canonical!,
  );
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
    "content",
    "article",
  );
  await expect(
    page.locator('meta[property="article:published_time"]'),
  ).toHaveAttribute("content", "2026-01-20T00:00:00.000Z");
  const sitemap = await request.get("/sitemap-0.xml");
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  const locations = await page.evaluate((source) => {
    const doc = new DOMParser().parseFromString(source, "application/xml");
    if (doc.querySelector("parsererror"))
      throw new Error("Invalid sitemap XML");
    return [...doc.querySelectorAll("url > loc")].map(
      (entry) => entry.textContent!,
    );
  }, xml);
  expect(locations).toHaveLength(14);
  expect(locations).toContain(canonical);
  expect(
    locations.some((url) => /\/404(?:\/|\.|$)/.test(new URL(url).pathname)),
  ).toBe(false);
  for (const url of locations) {
    expect(new URL(url).origin).toBe(new URL(canonical!).origin);
    expect((await request.get(new URL(url).pathname)).status()).toBe(200);
  }
  expect((await request.get("/sitemap-index.xml")).status()).toBe(200);
  const feed = await request.get("/rss.xml");
  const feedInfo = await page.evaluate(
    (source) => {
      const doc = new DOMParser().parseFromString(source, "application/xml");
      return {
        errors: doc.querySelectorAll("parsererror").length,
        links: [...doc.querySelectorAll("item > link")].map(
          (link) => link.textContent!,
        ),
      };
    },
    await feed.text(),
  );
  expect(feedInfo.errors).toBe(0);
  expect(feedInfo.links).toHaveLength(3);
  await page.goto("/a-page-that-does-not-exist/");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex, follow",
  );
});

test("Dark theme keeps full contrast", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".post-feed")).toHaveAttribute(
    "data-ready",
    "true",
  );
  await page.getByRole("button", { name: t("nav.dark") }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect(page.locator("html")).toHaveCSS("opacity", "1");
  await expect(page.locator("body")).toHaveCSS("color", "rgb(220, 223, 227)");
});

test("Reading all posts without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
  });
  try {
    const page = await context.newPage();
    await page.goto("/");
    const fallback = page.getByRole("region", {
      name: t("post.all"),
      exact: true,
    });
    await expect(fallback.getByRole("link")).toHaveCount(3);
    await fallback.getByRole("link").last().click();
    await expect(page.locator("#article-body")).toBeVisible();
  } finally {
    await context.close();
  }
});

test("Configured language, localized search, metadata, and local fonts", async ({
  page,
  request,
}) => {
  const fonts: string[] = [];
  const hydrationWarnings: string[] = [];
  page.on("response", (response) => {
    if (/\.woff2(?:\?|$)/.test(response.url()) && response.ok())
      fonts.push(response.url());
  });
  page.on("console", (message) => {
    if (/hydration.*mismatch/i.test(message.text()))
      hydrationWarnings.push(message.text());
  });
  await page.goto("/");
  await expect(page.locator(".post-feed")).toHaveAttribute(
    "data-ready",
    "true",
  );
  await expect(page.locator("html")).toHaveAttribute("lang", language);
  await expect(page).toHaveTitle(
    `${settings.site.name} · ${t("site.titleSuffix")}`,
  );
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
    "content",
    ogLocales[language],
  );
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    t("site.description"),
  );
  await expect(page.locator("h1")).toHaveText(t("hero.title"));
  expect(await page.locator("body").innerText()).not.toMatch(/\p{Script=Han}/u);

  await page
    .getByRole("button", { name: t("nav.search"), exact: true })
    .click();
  await page
    .getByRole("searchbox", { name: t("search.keywords") })
    .fill("emphasis");
  await expect(page.getByRole("dialog").locator(".search-result")).toHaveCount(
    1,
  );
  await page.keyboard.press("Escape");

  await page.evaluate(() => document.fonts.ready);
  const family = "IBM Plex Sans Variable";
  const loaded = await page.evaluate(() =>
    [...document.fonts]
      .filter((face) => face.status === "loaded")
      .map((face) => face.family.replaceAll('"', "")),
  );
  expect(loaded).toContain(family);
  expect(fonts.length).toBeGreaterThan(0);
  expect(
    fonts.every((url) => new URL(url).origin === new URL(page.url()).origin),
  ).toBe(true);
  await page.goto("/posts/welcome/");
  await expect(page.locator("#article-body h2").first()).toHaveCSS(
    "font-family",
    new RegExp(family),
  );

  const rss = await (await request.get("/rss.xml")).text();
  const feedInfo = await page.evaluate((source) => {
    const xml = new DOMParser().parseFromString(source, "application/xml");
    return {
      language: xml.querySelector("channel > language")?.textContent,
      title: xml.querySelector("item > title")?.textContent,
    };
  }, rss);
  expect(feedInfo.language).toBe(language);
  expect(feedInfo.title).toBe(
    await page.locator(".article-header h1").textContent(),
  );
  expect(hydrationWarnings).toEqual([]);
});

test("Spanish routes and the language switch", async ({ page, request }) => {
  const es = (key: Parameters<typeof t>[0]) => translate("es", key);
  await page.goto("/posts/welcome/");
  await page.getByRole("link", { name: t("nav.language") }).click();
  await expect(page).toHaveURL(/\/es\/posts\/welcome\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect(page.locator(".article-header h1")).toContainText("Bienvenido");
  await expect(
    page.locator('link[rel="alternate"][hreflang="en"]'),
  ).toHaveAttribute("href", /\/posts\/welcome\/$/);
  await page.getByRole("link", { name: es("article.back") }).click();
  await expect(page).toHaveURL(/\/es\/posts\/$/);
  await expect(page.locator(".post-feed")).toHaveAttribute(
    "data-ready",
    "true",
  );
  await expect(page.locator(".post-card").first()).toContainText(
    es("category.guides"),
  );
  await page.getByRole("link", { name: es("nav.language") }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  const feed = await (await request.get("/es/rss.xml")).text();
  expect(feed).toContain("<language>es</language>");
  expect(feed).toContain("/es/posts/welcome/");
});

test("Structured data and translated sitemap entries", async ({
  page,
  request,
}) => {
  await page.goto("/posts/welcome/");
  const { "@graph": graph } = JSON.parse(
    (await page
      .locator('script[type="application/ld+json"]')
      .textContent()) as string,
  );
  const byType = (type: string) =>
    graph.find((item: { "@type": string }) => item["@type"] === type);
  const post = byType("BlogPosting");
  expect(post.headline).toContain("Welcome");
  expect(post.datePublished).toBe("2026-03-15T00:00:00.000Z");
  expect(post.dateModified).toBe("2026-03-15T00:00:00.000Z");
  expect(post.inLanguage).toBe("en");
  expect(post.image.width).toBe(1200);
  expect(post.author["@id"]).toBe(byType("Person")["@id"]);
  expect(byType("Person").jobTitle).toBe("Notes & learnings");
  expect(byType("WebSite").alternateName).toBeTruthy();
  expect(byType("BreadcrumbList").itemListElement).toHaveLength(3);
  await expect(
    page.locator('meta[property="og:locale:alternate"]'),
  ).toHaveAttribute("content", "es_ES");
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary_large_image",
  );
  const image = await request.get(
    new URL(
      (await page
        .locator('meta[property="og:image"]')
        .getAttribute("content")) as string,
    ).pathname,
  );
  expect(image.status()).toBe(200);
  expect(image.headers()["content-type"]).toContain("image/png");

  const sitemap = await (await request.get("/sitemap-0.xml")).text();
  expect(sitemap).toContain('hreflang="es-ES"');
  expect(sitemap).toContain("/es/posts/welcome/");
  expect(sitemap).toContain("<lastmod>2026-03-15T00:00:00.000Z</lastmod>");
  const feed = await (await request.get("/rss.xml")).text();
  expect(feed).toContain("<content:encoded>");
  expect(feed).toContain('rel="self"');
  const llms = await (await request.get("/llms.txt")).text();
  expect(llms).toContain("/es/posts/welcome/");
});

test("Profile page and unique descriptions", async ({ page }) => {
  await page.goto("/about/");
  const { "@graph": graph } = JSON.parse(
    (await page
      .locator('script[type="application/ld+json"]')
      .textContent()) as string,
  );
  const profile = graph.find(
    (item: { "@type": string }) => item["@type"] === "ProfilePage",
  );
  expect(profile.mainEntity["@id"]).toMatch(/#person$/);
  const descriptions = new Set<string | null>();
  for (const path of ["/", "/posts/", "/about/", "/projects/"]) {
    await page.goto(path);
    descriptions.add(
      await page.locator('meta[name="description"]').getAttribute("content"),
    );
  }
  expect(descriptions.size).toBe(4);
});
