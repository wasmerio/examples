/**
 * Main theme configuration.
 *
 * `url` is the deployment origin. For GitHub Pages project sites, keep the
 * repository name in `basePath` (for example `/my-blog`). Use `/` for custom
 * domains and `<username>.github.io` repositories.
 */
export const SITE = {
  title: "Bento Blog",
  description: "A bento-style technical archive built with Astro.",
  author: "Your Name",
  language: "ko",
  locale: "ko-KR",
  url: "https://dgddgd314.github.io",
  basePath: "/astro-bento-blog-template",
  brand: {
    name: "bento",
    accent: "blog",
  },
  socialLinks: [
    {
      label: "GitHub",
      href: "https://github.com/dgddgd314/astro-bento-blog-template",
    },
    {
      label: "RSS",
      href: "/rss.xml",
    },
  ],
  storagePrefix: "astro-bento-blog",
  features: {
    transitions: true,
  },
} as const;

export const GENERATE_SLUG_FROM_TITLE = true;

// Named exports keep imports concise throughout the theme.
export const SITE_TITLE = SITE.title;
export const SITE_DESCRIPTION = SITE.description;
export const TRANSITION_API = SITE.features.transitions;
