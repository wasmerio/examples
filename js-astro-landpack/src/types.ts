/** Page metadata accepted by `BaseHead` and by every layout that renders it. */
export interface SeoProps {
  /** Page title. Rendered as `{title} | {SITE_NAME}`; omit for `SITE_NAME` alone. */
  title?: string;
  /** Meta description, also used for `og:description` and `twitter:description`. Defaults to `SITE_DESCRIPTION`. */
  description?: string;
  /** Social share image. Defaults to `project.seo.image` or `/og-image.jpg`. Relative paths resolve against `site` in `astro.config.mjs`. */
  image?: string;
  /** Description of the social image; defaults to the configured image description. */
  imageAlt?: string;
  /** Social image width in pixels. Supply actual dimensions for per-page images. */
  imageWidth?: number;
  /** Social image height in pixels. Supply actual dimensions for per-page images. */
  imageHeight?: number;
  /** Open Graph type. Defaults to `website`; use `article` for posts and news pages. */
  type?: "website" | "article";
  /**
   * Force `robots: noindex, nofollow` on or off for this page.
   *
   * Leave unset to inherit from `NOINDEX_ROUTES`, which also drives sitemap
   * exclusion. Setting it here only affects the robots tag — a page kept out of
   * search results should be listed in `NOINDEX_ROUTES` so it leaves the sitemap too.
   */
  noindex?: boolean;
}
