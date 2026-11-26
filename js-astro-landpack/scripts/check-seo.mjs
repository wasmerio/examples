import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const args = process.argv.slice(2);
if (args.includes("--help")) {
  console.log(
    "Usage: npm run seo:check -- [--allow-placeholder]\nChecks generated dist/ metadata, indexability, sitemap, robots, and local social images. Run npm run build first. No network requests.",
  );
  process.exit(0);
}
assert(
  args.every((arg) => arg === "--allow-placeholder"),
  "Unknown argument. Use --help.",
);
const allowPlaceholder = args.includes("--allow-placeholder");
const dist = resolve(fileURLToPath(new URL("../dist/", import.meta.url)));
const decode = (s = "") =>
  s.replace(
    /&(?:amp|quot|apos|lt|gt|#39|#x27);/g,
    (c) =>
      ({
        "&amp;": "&",
        "&quot;": '"',
        "&apos;": "'",
        "&#39;": "'",
        "&#x27;": "'",
        "&lt;": "<",
        "&gt;": ">",
      })[c],
  );
const elements = (html, tag) =>
  [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>`, "gi"))].map(([raw]) =>
    Object.fromEntries(
      [
        ...raw
          .replace(/^<[^\s>]+/, "")
          .matchAll(/([\w:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g),
      ].map(([, key, a, b, c]) => [
        key.toLowerCase(),
        decode(a ?? b ?? c ?? ""),
      ]),
    ),
  );
async function htmlFiles(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await htmlFiles(path)));
    else if (entry.name.endsWith(".html")) files.push(path);
  }
  return files;
}
try {
  const files = await htmlFiles(dist);
  assert(files.length, "No HTML output. Run npm run build first.");
  const sitemapFiles = (await readdir(dist)).filter((name) =>
    /^sitemap-\d+\.xml$/.test(name),
  );
  assert(sitemapFiles.length, "Missing generated sitemap.");
  const locations = new Set();
  for (const file of sitemapFiles) {
    const xml = await readFile(resolve(dist, file), "utf8");
    for (const [, loc] of xml.matchAll(/<loc>([^<]+)<\/loc>/g))
      locations.add(decode(loc));
  }
  const robots = await readFile(resolve(dist, "robots.txt"), "utf8");
  const index = await readFile(resolve(dist, "sitemap-index.xml"), "utf8");
  const titles = new Set();
  let placeholder = false;
  const remote = new Set();
  for (const file of files) {
    const label = file.slice(dist.length + 1);
    const html = await readFile(file, "utf8");
    const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1];
    assert(head, `${label}: missing document head`);
    const metas = elements(head, "meta");
    const links = elements(head, "link");
    const meta = (key) => {
      const matches = metas.filter((m) => m.name === key || m.property === key);
      assert(matches.length <= 1, `${label}: duplicate ${key}`);
      return matches[0]?.content;
    };
    const titleMatches = [...head.matchAll(/<title>([^<]+)<\/title>/g)];
    assert.equal(
      titleMatches.length,
      1,
      `${label}: exactly one nonempty title required`,
    );
    const title = decode(titleMatches[0][1]);
    assert(!titles.has(title), `${label}: duplicate page title`);
    titles.add(title);
    assert(meta("description")?.trim(), `${label}: missing description`);
    assert(
      elements(html, "html")[0]?.lang,
      `${label}: missing document language`,
    );
    if (!meta("robots")?.includes("noindex"))
      assert.equal(
        [...html.matchAll(/<h1\b/gi)].length,
        1,
        `${label}: expected one main h1`,
      );
    for (const img of elements(html, "img"))
      assert("alt" in img, `${label}: image missing alt`);
    const canonicals = links.filter((l) => l.rel === "canonical");
    assert.equal(
      canonicals.length,
      1,
      `${label}: exactly one canonical required`,
    );
    const canonical = new URL(canonicals[0].href);
    assert(
      ["https:", "http:"].includes(canonical.protocol),
      `${label}: canonical must be HTTP(S)`,
    );
    assert(
      !canonical.search && !canonical.hash,
      `${label}: canonical contains query or fragment`,
    );
    const host = canonical.hostname;
    const isPlaceholder =
      /(^|\.)example\.(com|org|net)$/.test(host) ||
      /\.(test|invalid|localhost)$/.test(host) ||
      ["localhost", "127.0.0.1", "your-project.dev"].includes(host);
    placeholder ||= isPlaceholder;
    assert(
      allowPlaceholder || !isPlaceholder,
      `${label}: set PUBLIC_SITE_URL to your production domain and rebuild (use --allow-placeholder only for local structural checks)`,
    );
    assert.equal(
      meta("og:url"),
      canonical.href,
      `${label}: og:url differs from canonical`,
    );
    assert.equal(meta("og:title"), title, `${label}: OG title mismatch`);
    assert.equal(
      meta("twitter:title"),
      title,
      `${label}: Twitter title mismatch`,
    );
    assert.equal(
      meta("og:description"),
      meta("description"),
      `${label}: OG description mismatch`,
    );
    assert.equal(
      meta("twitter:description"),
      meta("description"),
      `${label}: Twitter description mismatch`,
    );
    assert(
      meta("og:type") && meta("og:site_name") && meta("og:locale"),
      `${label}: missing OG metadata`,
    );
    assert.equal(
      meta("twitter:card"),
      "summary_large_image",
      `${label}: missing large social card`,
    );
    assert(
      meta("og:image:alt")?.trim(),
      `${label}: missing social image description`,
    );
    assert.equal(
      meta("twitter:image:alt"),
      meta("og:image:alt"),
      `${label}: social alt mismatch`,
    );
    const social = new URL(meta("og:image"));
    assert(
      ["https:", "http:"].includes(social.protocol),
      `${label}: social image must be HTTP(S)`,
    );
    assert.equal(
      meta("twitter:image"),
      social.href,
      `${label}: social image mismatch`,
    );
    if (social.origin === canonical.origin) {
      const imageFile = resolve(
        dist,
        `.${decodeURIComponent(social.pathname)}`,
      );
      assert(
        imageFile.startsWith(dist + sep),
        `${label}: invalid local social image path`,
      );
      const image = await sharp(imageFile).metadata();
      assert(
        ["jpeg", "png", "webp"].includes(image.format),
        `${label}: use a raster social image`,
      );
      if (meta("og:image:width"))
        assert.equal(
          Number(meta("og:image:width")),
          image.width,
          `${label}: social image width mismatch`,
        );
      if (meta("og:image:height"))
        assert.equal(
          Number(meta("og:image:height")),
          image.height,
          `${label}: social image height mismatch`,
        );
    } else remote.add(social.href);
    const sitemap = new URL("sitemap-index.xml", canonical.origin).href;
    assert(
      links.some((l) => l.rel === "sitemap" && l.href === sitemap),
      `${label}: missing sitemap head link`,
    );
    assert(
      robots.includes(`Sitemap: ${sitemap}`),
      `${label}: robots sitemap URL mismatch`,
    );
    assert(
      index.includes(canonical.origin),
      `${label}: sitemap origin mismatch`,
    );
    const noindex = meta("robots")?.includes("noindex");
    if (label === "404.html" || label === "example-components/index.html")
      assert(noindex, `${label}: utility page must be noindex`);
    assert.equal(
      locations.has(canonical.href),
      !noindex,
      `${label}: sitemap and noindex policy disagree`,
    );
  }
  console.log(
    `SEO structure: PASS (${files.length} pages; metadata, headings, image alt, local social assets, sitemap, robots).`,
  );
  if (placeholder)
    console.log(
      "Production URL: PLACEHOLDER — set PUBLIC_SITE_URL and rebuild before publishing.",
    );
  for (const url of remote)
    console.log(
      `Remote social image requires a manual availability/dimension check: ${url}`,
    );
  console.log(
    "This local check does not measure search ranking, live HTTP status, crawler access, or social-platform caches.",
  );
} catch (error) {
  console.error(`SEO check failed: ${error.message}`);
  process.exitCode = 1;
}
