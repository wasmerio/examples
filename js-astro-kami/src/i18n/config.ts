export const locales = ["en", "zh"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeMeta: Record<
  Locale,
  { dateLocale: string; htmlLang: string; ogLocale: string }
> = {
  en: { dateLocale: "en-US", htmlLang: "en", ogLocale: "en_US" },
  zh: { dateLocale: "zh-CN", htmlLang: "zh-CN", ogLocale: "zh_CN" },
};

export const messages = {
  en: {
    backToTop: "Back to Top",
    by: "By",
    copied: "Copied",
    copyLink: "Copy link",
    draft: "Draft",
    homeDescription:
      "A minimal personal blog & writing space, built with Astro. Notes on whatever I happen to be thinking about — usually some mix of code, design, and the occasional half-formed idea.",
    latest: "Latest",
    link: "Link",
    morePosts: "More posts",
    newer: "Newer",
    older: "Older",
    posts: "Posts",
    postsDescription: "Read my collection of posts and the things that interest me",
    poweredBy: "Powered by",
    share: "Share",
    showcase: "Showcase",
    showcaseDescription: "A handful of projects I've built.",
    tags: "Tags",
    updated: "Updated",
    viewAllPosts: (count: number) => `View all ${count} posts →`,
    viewAllProjects: (count: number) => `View all ${count} projects →`,
    webmentions: "Webmentions for this post",
    webmentionsCredit: "Responses powered by",
    writing: "Writing",
    nav: {
      "/": "Home",
      "/about/": "About",
      "/posts/": "Posts",
      "/showcase/": "Showcase",
    } as Record<string, string>,
    theme: { dark: "Dark", light: "Light", toggle: "Toggle theme" },
  },
  zh: {
    backToTop: "Back to Top",
    by: "By",
    copied: "Copied",
    copyLink: "Copy link",
    draft: "Draft",
    homeDescription:
      "一个使用 Astro 构建的个人博客与写作空间，记录关于代码、设计和日常思考的文字。",
    latest: "Latest",
    link: "Link",
    morePosts: "More posts",
    newer: "Newer",
    older: "Older",
    posts: "Posts",
    postsDescription: "阅读本站发布的文章与思考。",
    poweredBy: "Powered by",
    share: "Share",
    showcase: "Showcase",
    showcaseDescription: "我开发的一些项目。",
    tags: "Tags",
    updated: "Updated",
    viewAllPosts: (count: number) => `查看全部 ${count} 篇文章 →`,
    viewAllProjects: (count: number) => `查看全部 ${count} 个项目 →`,
    webmentions: "这篇文章的站外回应",
    webmentionsCredit: "回应数据由以下服务提供：",
    writing: "Writing",
    nav: {
      "/": "Home",
      "/about/": "About",
      "/posts/": "Posts",
      "/showcase/": "Showcase",
    } as Record<string, string>,
    theme: { dark: "Dark", light: "Light", toggle: "Toggle theme" },
  },
} as const;

export function normalizeLocale(value?: string): Locale {
  return value?.toLowerCase() === "zh" ? "zh" : defaultLocale;
}

/** Adds the locale URL prefix. The default locale deliberately remains unprefixed. */
export function localizedPath(locale: Locale, path = "/"): string {
  const absolutePath = path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) return absolutePath;
  return absolutePath === "/" ? `/${locale}/` : `/${locale}${absolutePath}`;
}

export function postLocaleFromId(id: string): Locale {
  const prefix = id.split("/", 1)[0];
  return locales.includes(prefix as Locale) && prefix !== defaultLocale
    ? (prefix as Locale)
    : defaultLocale;
}

export function postSlugFromId(id: string): string {
  const prefix = id.split("/", 1)[0];
  return locales.includes(prefix as Locale) ? id.slice(prefix.length + 1) : id;
}
