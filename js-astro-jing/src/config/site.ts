/**
 * Basic site configuration.
 */

export const SITE = {
  // Basic information
  url: "https://astro-jing-theme.ziteh.dev", // Your site's URL, e.g. https://username.github.io
  title: "Astro Jing", // Your blog title
  description: "A calm Astro theme for blogging.", // Your blog description
  author: "ZiTe", // 君の名は ~

  // Pagination
  postsPerHomepage: 3,
  postsPerArchives: 3,
  postsPerAllPosts: 5,

  // Description generation
  getDescriptionCount: 150, // If 'more' tag is not found, use this count of characters
  getDescriptionMaxLines: 10, // Max number of lines to process

  // Default values for frontmatter fields
  defaultFmTag: "Others",
  defaultFmCategory: "",
  defaultFmToc: false,
  defaultFmComments: false,
  defaultFmMath: false,

  // Config
  transitions: true, // View transitions (https://docs.astro.build/en/guides/view-transitions/)

  // OG image font
  // Empty: load via the Astro Fonts API font, may not cover non-Latin scripts (e.g. CJK)
  // Non-empty: path (relative to project root) to a font file to read directly
  ogFontPath: "fonts/NotoSansTC-Regular.ttf",

  // LLM / AI
  postMdUrl: true, // Generate a Markdown version of your blog posts for LLMs to crawl
  llmsTxt: false, // Generate llms.txt for LLMs to crawl your blog posts (need postMdUrl to be true)
  viewAsMD: true, // Add a "View as Markdown" button to post (need postMdUrl to be true)

  // Disqus comments
  disqusShortname: "", // Your Disqus shortname (without https:// and .disqus.com)

  // Giscus comments
  giscusRepo: "", // e.g. "user/repo"
  giscusRepoId: "",
  giscusCategory: "",
  giscusCategoryId: "",
  giscusMapping: "title",
  giscusStrict: "0",
  giscusReactionsEnabled: "1",
  giscusEmitMetadata: "0",
  giscusInputPosition: "bottom",
  giscusTheme: "preferred_color_scheme",
} as const;

if (SITE.llmsTxt && !SITE.postMdUrl) {
  throw new Error("SITE.postMdUrl must be enabled when SITE.llmsTxt is enabled.");
}
if (SITE.viewAsMD && !SITE.postMdUrl) {
  throw new Error("SITE.postMdUrl must be enabled when SITE.viewAsMD is enabled.");
}
