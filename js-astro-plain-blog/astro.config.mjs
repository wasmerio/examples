import { defineConfig } from "astro/config";
import { satteri } from "@astrojs/markdown-satteri";

const site = process.env.SITE_URL;
if (
  site &&
  (!/^https?:$/.test(new URL(site).protocol) ||
    new URL(site).username ||
    new URL(site).password)
) {
  throw new Error(
    "SITE_URL must be an absolute HTTP(S) URL without credentials",
  );
}

// Sub-path deployments (e.g. a GitHub Pages project site) need Astro's `base` so
// that generated asset URLs and `BASE_URL` carry the prefix. Keep the path out of
// SITE_URL: `base` plus `site` is what makes canonical and RSS URLs correct.
const base = process.env.BASE_PATH;
if (base && !/^\/[A-Za-z0-9._~-]+(\/[A-Za-z0-9._~-]+)*$/.test(base)) {
  throw new Error(
    "BASE_PATH must be a site-root-relative path such as /PlainBlog",
  );
}

// Authors write site-root links in Markdown ("[关于本站](/about/)"), and Astro's
// `base` does not rewrite them. Prefix them here so a sub-path deployment keeps
// them working. Only anchors are touched: the `src` of images Astro generates
// already carries the base path, and prefixing it again would double it.
const basePaths = {
  name: "plainblog-base-paths",
  element: {
    filter: ["a"],
    visit(node, ctx) {
      const href = node.properties?.href;
      if (
        typeof href !== "string" ||
        !href.startsWith("/") ||
        href.startsWith("//") ||
        href.startsWith(`${base}/`)
      ) {
        return;
      }
      ctx.setProperty(node, "href", `${base}${href}`);
    },
  },
};

export default defineConfig({
  output: "static",
  trailingSlash: "always",
  // Astro 7 defaults compressHTML to 'jsx', which drops the inline whitespace
  // produced by template line breaks (e.g. between "也可以在" and the social
  // icons on the home page). Pin HTML-aware compression so the upgrade stays a
  // dependency change and the accepted rendering does not shift.
  compressHTML: true,
  ...(site ? { site } : {}),
  ...(base ? { base } : {}),
  markdown: {
    processor: satteri(base ? { hastPlugins: [basePaths] } : {}),
    shikiConfig: {
      themes: { light: "vitesse-light", dark: "vitesse-dark" },
      defaultColor: false,
    },
  },
  image: { service: { entrypoint: "astro/assets/services/noop" } },
});
