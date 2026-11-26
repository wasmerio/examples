import { type APIRequestContext, expect, test } from "@playwright/test";
import { SITE } from "@/config/site";

/** Remove a trailing slash from the path unless the URL is a bare origin */
function normalizeUrl(url: string): string {
  return url.replace(/\/$/, "");
}

/** Fetch all page URLs listed across every sitemap referenced in the sitemap index. */
async function getSitemapPageUrls(request: APIRequestContext): Promise<string[]> {
  const indexRes = await request.get("/sitemap-index.xml");
  expect(indexRes.status(), "sitemap-index.xml must return 200").toBe(200);
  const indexText = await indexRes.text();

  const sitemapLocs = [...indexText.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
  expect(sitemapLocs.length, "sitemap index must reference at least one sitemap").toBeGreaterThan(
    0,
  );

  const pageUrls: string[] = [];
  for (const sitemapUrl of sitemapLocs) {
    const path = new URL(sitemapUrl).pathname;
    const res = await request.get(path);
    expect(res.status(), `sitemap ${path} must return 200`).toBe(200);
    const text = await res.text();
    const locs = [...text.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
    pageUrls.push(...locs);
  }

  return pageUrls;
}

test.describe("Sitemap (source of truth)", () => {
  test("all sitemap <loc> values are absolute and use the configured site URL", async ({
    request,
  }) => {
    const urls = await getSitemapPageUrls(request);
    expect(urls.length, "sitemap must list at least one page").toBeGreaterThan(0);

    for (const url of urls) {
      expect(url, `"${url}" must be an absolute URL`).toMatch(/^https?:\/\//);
      expect(url, `"${url}" must use the configured site base URL`).toContain(SITE.url);
    }
  });
});

test.describe("Canonical URL consistency with sitemap", () => {
  test("canonical URL on every sitemap page matches the sitemap URL exactly", async ({
    page,
    request,
  }) => {
    const sitemapUrls = await getSitemapPageUrls(request);

    for (const sitemapUrl of sitemapUrls) {
      const path = new URL(sitemapUrl).pathname;
      await page.goto(path, { waitUntil: "domcontentloaded" });

      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(
        canonical ? normalizeUrl(canonical) : canonical,
        `canonical on ${path} must exist and match sitemap URL "${sitemapUrl}"`,
      ).toBe(normalizeUrl(sitemapUrl));
    }
  });
});

test.describe("RSS feed consistency with sitemap", () => {
  test("RSS feed returns XML with status 200", async ({ request }) => {
    const res = await request.get("/rss.xml");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"], "content-type must be XML").toContain("xml");
  });

  test("every RSS item link matches a URL in the sitemap", async ({ request }) => {
    const sitemapUrls = await getSitemapPageUrls(request);
    const rssText = await (await request.get("/rss.xml")).text();

    const itemLinks = [...rssText.matchAll(/<item>[\s\S]*?<link>(.*?)<\/link>/g)].map((m) => m[1]);
    expect(itemLinks.length, "RSS feed must have at least one item").toBeGreaterThan(0);

    for (const link of itemLinks) {
      expect(sitemapUrls, `RSS item link "${link}" must appear in sitemap`).toContain(link);
    }
  });
});

test.describe("OG image URL consistency with sitemap", () => {
  test("article pages: og:image is /og-images/posts/{slug}.{hash}.png", async ({
    page,
    request,
  }) => {
    const sitemapUrls = await getSitemapPageUrls(request);

    let articleCount = 0;
    for (const sitemapUrl of sitemapUrls) {
      const path = new URL(sitemapUrl).pathname;
      await page.goto(path, { waitUntil: "domcontentloaded" });

      const ogType = await page.locator('meta[property="og:type"]').getAttribute("content");
      if (ogType !== "article") continue;
      articleCount++;

      const ogImage = await page.locator('meta[property="og:image"]').getAttribute("content");
      expect(ogImage, `${path} must have og:image`).toBeTruthy();
      if (!ogImage) continue;

      const ogPath = new URL(ogImage).pathname;
      const slug = path.replace(/\/$/, "").split("/").pop() ?? "";
      const escapedSlug = slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      expect(
        ogPath,
        `og:image path for ${path} must be "/og-images/posts/${slug}.{hash}.png"`,
      ).toMatch(new RegExp(`^/og-images/posts/${escapedSlug}\\.[0-9a-f]{8}\\.png$`));
    }

    expect(articleCount, "sitemap must include at least one article page").toBeGreaterThan(0);
  });

  test("non-article pages: og:image is /og-images/site.{hash}.png", async ({ page, request }) => {
    const sitemapUrls = await getSitemapPageUrls(request);

    for (const sitemapUrl of sitemapUrls) {
      const path = new URL(sitemapUrl).pathname;
      await page.goto(path, { waitUntil: "domcontentloaded" });

      const ogType = await page.locator('meta[property="og:type"]').getAttribute("content");
      if (ogType === "article") continue;

      const ogImage = await page.locator('meta[property="og:image"]').getAttribute("content");
      expect(ogImage, `${path} must have og:image`).toBeTruthy();
      if (!ogImage) continue;

      const ogPath = new URL(ogImage).pathname;
      expect(ogPath, `og:image path for ${path} must be "/og-images/site.{hash}.png"`).toMatch(
        /^\/og-images\/site\.[0-9a-f]{8}\.png$/,
      );
    }
  });

  test("og:image resources are accessible (HTTP 200)", async ({ page, request }) => {
    const sitemapUrls = await getSitemapPageUrls(request);

    // Collect all unique og:image paths across all sitemap pages
    const checked = new Set<string>();
    for (const sitemapUrl of sitemapUrls) {
      const path = new URL(sitemapUrl).pathname;
      await page.goto(path, { waitUntil: "domcontentloaded" });

      const ogImage = await page.locator('meta[property="og:image"]').getAttribute("content");
      if (!ogImage) continue;

      const ogPath = new URL(ogImage).pathname;
      if (checked.has(ogPath)) continue;
      checked.add(ogPath);

      const res = await request.get(ogPath);
      expect(res.status(), `og:image resource "${ogPath}" must return 200`).toBe(200);
    }
  });
});

test.describe("Markdown version (.md) consistency with sitemap", () => {
  test("article pages: .md canonical matches the sitemap URL", async ({ request }) => {
    const sitemapUrls = await getSitemapPageUrls(request);

    let articleCount = 0;
    for (const sitemapUrl of sitemapUrls) {
      const path = new URL(sitemapUrl).pathname;
      const htmlRes = await request.get(path);
      const html = await htmlRes.text();
      // Minified HTML may order meta attributes either way, e.g. <meta content=article property=og:type>
      const ogTypeTag = html.match(/<meta[^>]*\bproperty=["']?og:type["']?[^>]*>/)?.[0];
      const ogType = ogTypeTag?.match(/\bcontent=["']?([^"'\s>]+)["']?/)?.[1];
      if (ogType !== "article") continue;
      articleCount++;

      const mdRes = await request.get(`${path.replace(/\/$/, "")}.md`);
      expect(mdRes.status(), `${path}.md must return 200`).toBe(200);

      const mdText = await mdRes.text();
      const canonical = mdText.match(/^canonical: '(.*)'$/m)?.[1];
      expect(canonical, `${path}.md must have a canonical frontmatter field`).toBeTruthy();
      expect(
        canonical ? normalizeUrl(canonical) : canonical,
        `canonical in ${path}.md must match sitemap URL "${sitemapUrl}"`,
      ).toBe(normalizeUrl(sitemapUrl));
    }

    expect(articleCount, "sitemap must include at least one article page").toBeGreaterThan(0);
  });
});
