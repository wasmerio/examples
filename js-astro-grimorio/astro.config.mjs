// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import vue from "@astrojs/vue";
import tailwindcss from "@tailwindcss/vite";
import { readdirSync, readFileSync } from "node:fs";
import { loadEnv } from "vite";

const { SITE_URL = "https://grimorio-astro.pages.dev" } = loadEnv(
  process.env.NODE_ENV ?? "production",
  process.cwd(),
  "SITE_URL",
);
const site = new URL(SITE_URL);
if (
  !["http:", "https:"].includes(site.protocol) ||
  site.pathname !== "/" ||
  site.search ||
  site.hash ||
  site.username ||
  site.password
) {
  throw new Error(
    "SITE_URL must be an HTTP(S) origin, such as https://example.com, without a path, credentials, query, or fragment.",
  );
}

// Last modification date of each post URL, read from its frontmatter, so the
// sitemap can tell search engines which pages changed.
/** @type {Map<string, Date>} */
const lastModified = new Map();
for (const lang of ["es", "en"]) {
  const dir = `./src/content/posts/${lang}`;
  for (const file of readdirSync(dir).filter((name) => name.endsWith(".md"))) {
    const frontmatter = readFileSync(`${dir}/${file}`, "utf8").split("---")[1];
    if (/^draft:\s*true/m.test(frontmatter)) continue;
    const date =
      /^updated:\s*(\S+)/m.exec(frontmatter)?.[1] ??
      /^date:\s*(\S+)/m.exec(frontmatter)?.[1];
    if (!date) continue;
    const prefix = lang === "en" ? "" : `/${lang}`;
    lastModified.set(
      `${prefix}/posts/${file.replace(/\.md$/, "")}/`,
      new Date(date),
    );
  }
}
/** Newest post date for the English ("") or Spanish ("/es/") listings. */
const newest = (/** @type {string} */ prefix) =>
  [...lastModified]
    .filter(([path]) =>
      prefix ? path.startsWith(prefix) : !path.startsWith("/es/"),
    )
    .map(([, date]) => date)
    .sort((a, b) => b.valueOf() - a.valueOf())[0];

// https://astro.build/config
export default defineConfig({
  site: site.href,
  output: "static",
  trailingSlash: "always",
  // Preserve the spacing between inline elements when migrating from Astro 5.
  compressHTML: true,
  // Inline the small stylesheet to avoid a render-blocking request.
  build: { inlineStylesheets: "always" },
  // Fetch pages on hover so navigation feels instant.
  prefetch: { prefetchAll: true, defaultStrategy: "hover" },
  // Prerender prefetched pages with the Speculation Rules API where supported.
  experimental: { clientPrerender: true },
  integrations: [
    vue(),
    sitemap({
      // Link each page to its translation for search engines.
      i18n: { defaultLocale: "en", locales: { es: "es-ES", en: "en-US" } },
      filter: (page) =>
        !["/404/", "/404.html"].includes(new URL(page).pathname),
      serialize(item) {
        const path = new URL(item.url).pathname;
        const listing = /^\/(es\/)?(posts\/)?$/.exec(path);
        const date = listing
          ? newest(listing[1] ? "/es/" : "")
          : lastModified.get(path);
        return date ? { ...item, lastmod: date.toISOString() } : item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
