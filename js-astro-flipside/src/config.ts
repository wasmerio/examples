import type { UIStrings } from "@/locales/en";
import type { IconName } from "@/components/icons";

/**
 * astro-flipside — site configuration.
 * This file + src/data/* + src/content/blog/ are the only places a user
 * must edit. Keys marked (locale) take a key defined in src/locales/*.
 */
const SITE = {
  /** Deployment origin, no trailing slash — drives canonical/OG/sitemap URLs.
   *  This is the GitHub Pages origin (paired with `base` below); on Vercel it
   *  is overridden automatically with your Vercel URL (see astro.config.mjs). */
  site: "https://nagametw.github.io",
  /** Sub-path when deployed as a GitHub project page, e.g. "/astro-flipside". "" for root. */
  base: "/astro-flipside",
  title: "Flipside",
  description: "能在不同角色之間切換的個人網頁與部落格模板",
  author: "拍岸",
  /** UI language for every built-in string: "en" | "zh-TW". */
  locale: "zh-TW" as "en" | "zh-TW",
  /** Navigation. label is a locale key (see src/locales/). */
  nav: [
    { label: "nav.home", href: "/" },
    { label: "nav.about", href: "/about/" },
    { label: "nav.blog", href: "/blog/" },
    { label: "nav.gallery", href: "/gallery/" },
    { label: "nav.projects", href: "/projects/" },
  ] satisfies { label: keyof UIStrings; href: string }[],
  /** Life-face identity-card social buttons. `url` opens; `copy` copies text
   *  (Discord-style). `icon` is a name from src/components/Icon.astro. */
  socials: [
    {
      name: "Instagram",
      icon: "instagram",
      url: "https://example.com/instagram/your-name",
    },
    {
      name: "Threads",
      icon: "threads",
      url: "https://example.com/threads/your-name",
    },
    { name: "Discord", icon: "discord", copy: "your-discord-handle" },
  ] satisfies { name: string; icon: IconName; url?: string; copy?: string }[],
  /** Work-face identity-card social buttons — same `url`/`copy` shape. */
  socialsWork: [
    {
      name: "Spotify",
      icon: "spotify",
      url: "https://example.com/spotify/your-name",
    },
    {
      name: "YouTube",
      icon: "youtube",
      url: "https://example.com/youtube/your-name",
    },
    {
      name: "SoundCloud",
      icon: "soundcloud",
      url: "https://example.com/soundcloud/your-name",
    },
  ] satisfies { name: string; icon: IconName; url?: string; copy?: string }[],
  /** How many items each list surface shows — bump these to taste. */
  pageSize: {
    /** Blog list + tag pages (vertical rows since 2026-07). */
    blog: 10,
    /** Projects grid — multiples of 3 keep the 3-up rows full. */
    projects: 9,
    /** Recent items each homepage section previews (blog, projects,
     *  gallery) before its "view all" link. The gallery is a 4-up strip,
     *  so a multiple of 4 keeps its edge clean. */
    home: 4,
  },
  features: {
    /** KaTeX math ($…$ / $$…$$) in posts. */
    math: false,
    /** ```mermaid fenced diagrams in posts. */
    mermaid: false,
    /** giscus comments under posts. false, or the data-attributes from giscus.app. */
    giscus: false as
      | false
      | { repo: string; repoId: string; category: string; categoryId: string },
  },
};

export default SITE;
