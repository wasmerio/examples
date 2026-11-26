import { defineStarglowConfig } from "./src/types/config";

// starglow theme configuration. Every key is documented in src/types/config.ts
// (hover it in your editor) and in the "Configuring starglow" post.
// The site origin is not set here: astro.config.ts reads it from SITE_URL.
export default defineStarglowConfig({
  site: {
    // Header, <title> and feeds. Used by: Layout, Header, rss.xml, OG images.
    title: "mirasol",
    description:
      "Mira Solvik makes pictures with code: generative art, shaders, pixel art and pen plots.",
    // Default post author and the footer copyright name.
    author: "Mira Solvik",
    // Author profile URL, used in structured data.
    profile: "https://github.com/glowing-space",
    // Source repository of your site, linked from the footer. Empty = no link.
    sourceUrl: "https://github.com/glowing-space/starglow",
    lang: "en",
    // IANA timezone for post dates. ./dev.sh reads this line too.
    timezone: "UTC",
    dir: "ltr",
    // Fediverse handle as @user@instance. Empty = no fediverse:creator meta.
    fediverseCreator: "",
    // Header wordmark in the pixel face. Defaults to title.
    wordmark: "mirasol",
    // Printed as an HTML comment at the top of every page, for people who
    // read the source. Text only; it must not contain two hyphens in a row.
    // Remove the whole key for no comment.
    sourceBanner: {
      art: String.raw`
      _                        _
 ___ | |_   __ _  _ __   __ _ | |  ___  __      __
/ __|| __| / _${"`"} || '__| / _${"`"} || | / _ \ \ \ /\ / /
\__ \| |_ | (_| || |   | (_| || || (_) | \ V  V /
|___/ \__| \__,_||_|    \__, ||_| \___/   \_/\_/
                        |___/`,
      message: [
        "hello, fellow source reader.",
        "plain static HTML, a little CSS, almost no JS.",
      ].join("\n"),
    },
  },
  // Optional homepage Person structured data. Empty fields are left out.
  person: {
    jobTitle: "Creative coder",
    description:
      "A fictional creative coder who writes about generative art, GLSL shaders, pixel art and pen plotters.",
  },
  posts: {
    perPage: 10,
    perIndex: 4,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showBackButton: true,
    editPost: {
      enabled: true,
      url: "https://github.com/glowing-space/starglow/edit/main/",
    },
    search: "pagefind",
    toc: true,
  },
  appearance: {
    // Header band light: "none" | "light" | "breathe" | "dawn".
    ambient: "breathe",
    wordmarkGlow: true,
    // Vim-style status bar on post and note pages.
    statusline: true,
    // Colour palettes, chosen separately for dark and light mode. Built in:
    // dark starglow | void | aurora | ember; light starglow | paper | petal |
    // frost | sand. Add your own under `palettes` (see src/palettes.ts).
    palette: { dark: "starglow", light: "starglow" },
    // Floating panel to try palettes and effects live. For demos; turn it
    // off on your own site.
    preview: true,
  },
  // 88x31 footer badges. Configured socials below get one automatically.
  links: [
    { type: "rss", url: "/rss.xml" },
    { type: "github", url: "https://github.com/glowing-space/starglow" },
  ],
  // Fill a url to show that profile in the footer badges, on /contact/ and in
  // the homepage structured data. Empty urls render nowhere.
  socials: [
    { name: "github", label: "GitHub", url: "" },
    { name: "linkedin", label: "LinkedIn", url: "" },
    { name: "mastodon", label: "Mastodon", url: "" },
    { name: "bluesky", label: "Bluesky", url: "" },
    { name: "lemmy", label: "Lemmy", url: "" },
    { name: "x", label: "X", url: "" },
    { name: "reddit", label: "Reddit", url: "" },
    { name: "devto", label: "DEV.to", url: "" },
    { name: "medium", label: "Medium", url: "" },
  ],
  footer: {
    // "powered by starglow" in the footer. Keeping it is appreciated.
    credit: true,
  },
});
