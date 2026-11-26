import { z } from "astro/zod"

const socialSchema = z.object({
  name: z.string(),
  url: z.string(),
  icon: z.string(),
})

const navItemSchema: z.ZodType<NavItem> = z.lazy(() =>
  z.object({
    label: z.string(),
    href: z.string().optional(),
    icon: z.string().optional(),
    children: z.array(navItemSchema).optional(),
  }),
)

export type NavItem = {
  label: string
  href?: string
  icon?: string
  children?: NavItem[]
}

const providerConfig = z.record(z.string(), z.string()).prefault({})

const siteSchema = z.object({
  title: z.string(),
  description: z.string(),
  lang: z.enum([
    "zh-hans",
    "zh-hant",
    "en",
    "ar",
    "bn",
    "de",
    "es",
    "fr",
    "it",
    "ja",
    "ko",
    "pt",
    "ru",
    "vi",
  ]),
  keywords: z.array(z.string()).default([]),
  shortName: z.string().optional(),
  images: z.array(z.string()).default([]),
  favicon: z
    .object({
      svg: z.string().optional(),
      png: z.string().optional(),
    })
    .prefault({}),
  pwa: z
    .object({
      backgroundColor: z.string().default("#ffffff"),
      themeColor: z.string().default("#09090b"),
      darkThemeColor: z.string().default("#09090b"),
      orientation: z.string().default("portrait-primary"),
      appleTouchIcon: z.string().default(""),
    })
    .prefault({}),
  announcement: z
    .object({
      enabled: z.boolean().default(false),
      message: z.string().default(""),
      type: z.enum(["info", "warning", "destructive"]).default("info"),
      dismissible: z.boolean().default(true),
      autoClose: z.number().int().min(0).default(0),
    })
    .prefault({}),
  author: z.object({
    name: z.string(),
    title: z.string().default(""),
    description: z.string().default(""),
    avatar: z.string().default(""),
    social: z.array(socialSchema).default([]),
  }),
  search: z
    .object({
      enabled: z.boolean().default(true),
      indexContentLength: z.number().int().positive().default(2000),
    })
    .prefault({}),
  base: z.string().default("/"),
  contentWidth: z.string().default("56rem"),
  backdropBlur: z.number().min(0).max(24).default(12),
  grainSize: z.number().min(0).max(100).default(25),
  toc: z.object({ enabled: z.boolean().default(true) }).prefault({}),
  colorScheme: z.string().default("default"),
  home: z
    .object({
      recentPostsCount: z.number().int().default(3),
      contentOrder: z
        .array(z.string())
        .default(["author-section", "recent-posts", "featured-projects"]),
    })
    .prefault({}),
  post: z
    .object({
      showRelated: z.boolean().default(true),
      relatedPostsCount: z.number().int().default(3),
      license: z.string().default(""),
    })
    .prefault({}),
  comments: z
    .object({
      enabled: z.boolean().default(false),
      /** Provider name; must match a block below (upstream allows custom partials). */
      provider: z.string().default(""),
      giscus: z
        .object({
          repo: z.string().default(""),
          repoId: z.string().default(""),
          category: z.string().default(""),
          categoryId: z.string().default(""),
          mapping: z.string().default("pathname"),
          strict: z.string().default("0"),
          reactionsEnabled: z.string().default("1"),
          emitMetadata: z.string().default("0"),
          inputPosition: z.string().default("bottom"),
          theme: z.string().default("preferred_color_scheme"),
          lang: z.string().default("zh-CN"),
        })
        .prefault({}),
      disqus: providerConfig,
      utterances: providerConfig,
      waline: providerConfig,
      artalk: providerConfig,
      twikoo: providerConfig,
      comentario: providerConfig,
    })
    .prefault({}),
  analytics: z
    .object({
      provider: z.enum(["", "google", "baidu", "clarity", "umami"]).default(""),
      google: z.object({ id: z.string().default("") }).prefault({}),
      baidu: z.object({ id: z.string().default("") }).prefault({}),
      clarity: z.object({ id: z.string().default("") }).prefault({}),
      umami: z
        .object({
          id: z.string().default(""),
          src: z.string().default(""),
          domains: z.string().default(""),
        })
        .prefault({}),
    })
    .prefault({}),
  katex: z.object({ enabled: z.boolean().default(true) }).prefault({}),
  mermaid: z.object({ enabled: z.boolean().default(true) }).prefault({}),
  gallery: z
    .object({
      enabled: z.boolean().default(true),
      defaultLayout: z
        .enum(["justified", "masonry", "grid"])
        .default("justified"),
      gap: z.number().default(10),
      targetRowHeight: z.number().default(200),
      lastRowBehavior: z.enum(["center", "start", "justify"]).default("center"),
      columnWidth: z.number().default(200),
      columns: z.number().int().min(1).default(4),
    })
    .prefault({}),
  lightbox: z.object({ enabled: z.boolean().default(true) }).prefault({}),
  codeblock: z
    .object({
      collapse: z
        .object({
          enabled: z.boolean().default(true),
          defaultState: z.enum(["expanded", "collapsed"]).default("expanded"),
          maxLines: z.number().int().default(30),
          collapsedHeight: z.number().int().default(120),
        })
        .prefault({}),
    })
    .prefault({}),
  readingProgress: z
    .object({
      enabled: z.boolean().default(true),
      showOnHomepage: z.boolean().default(false),
    })
    .prefault({}),
  pagination: z
    .object({
      pageSize: z.number().int().positive().default(10),
    })
    .prefault({}),
  nav: z.array(navItemSchema),
})

export const siteConfig = siteSchema.parse({
  title: "Hugo Narrow",
  description:
    "A modern, clean, and minimal theme ported from hugo-narrow to Astro.",
  lang: "zh-hans",
  keywords: ["Astro", "Blog", "Theme", "Hugo Narrow"],
  shortName: "Narrow",
  images: ["/images/og-default.avif"],
  favicon: { svg: "/favicon.svg" },
  pwa: {
    backgroundColor: "#ffffff",
    themeColor: "#09090b",
    darkThemeColor: "#09090b",
    orientation: "portrait-primary",
    appleTouchIcon: "",
  },
  announcement: {
    enabled: false,
    message: "",
    type: "info",
    dismissible: true,
    autoClose: 0,
  },
  author: {
    name: "Your Name",
    title: "A Clean and Minimal Blog Theme",
    description: "Focused on content and user experience.",
    avatar: "",
    social: [],
  },
  search: { enabled: true, indexContentLength: 2000 },
  base: "/",
  contentWidth: "56rem",
  backdropBlur: 12,
  grainSize: 25,
  toc: { enabled: true },
  colorScheme: "default",
  home: {
    recentPostsCount: 4,
    contentOrder: ["author-section", "recent-posts", "featured-projects"],
  },
  post: {
    showRelated: true,
    relatedPostsCount: 3,
    license: "",
  },
  comments: {
    enabled: false,
    provider: "",
    giscus: {
      repo: "",
      repoId: "",
      category: "",
      categoryId: "",
      mapping: "pathname",
      strict: "0",
      reactionsEnabled: "1",
      emitMetadata: "0",
      inputPosition: "bottom",
      theme: "preferred_color_scheme",
      lang: "zh-CN",
    },
    disqus: {},
    utterances: {
      issueTerm: "pathname",
      label: "comment",
      theme: "preferred-color-scheme",
    },
    waline: {},
    artalk: {},
    twikoo: {},
    comentario: {},
  },
  analytics: {
    provider: "",
    google: { id: "" },
    baidu: { id: "" },
    clarity: { id: "" },
    umami: { id: "", src: "", domains: "" },
  },
  katex: { enabled: true },
  mermaid: { enabled: true },
  gallery: {
    enabled: true,
    defaultLayout: "justified",
    gap: 10,
    targetRowHeight: 200,
    lastRowBehavior: "center",
    columnWidth: 200,
    columns: 4,
  },
  lightbox: { enabled: true },
  codeblock: {
    collapse: {
      enabled: true,
      defaultState: "expanded",
      maxLines: 30,
      collapsedHeight: 120,
    },
  },
  readingProgress: { enabled: true, showOnHomepage: false },
  pagination: { pageSize: 10 },
  nav: [
    { label: "文章", href: "/posts", icon: "posts" },
    { label: "归档", href: "/archives", icon: "archive" },
    {
      label: "更多",
      icon: "layers",
      children: [
        { label: "分类", href: "/categories", icon: "categories" },
        { label: "标签", href: "/tags", icon: "tags" },
        { label: "系列", href: "/series", icon: "bookmark" },
        { label: "项目", href: "/projects", icon: "projects" },
        { label: "时间线", href: "/timeline", icon: "chart" },
        { label: "关于", href: "/about", icon: "about" },
        { label: "简历", href: "/resume", icon: "file-text" },
        { label: "RSS", href: "/rss.xml", icon: "rss" },
      ],
    },
  ],
})

export const POST_BASE = "/posts"
