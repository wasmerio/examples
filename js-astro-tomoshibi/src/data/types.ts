/** A labelled row of items: a tech stack group, or a fact list in About. */
export type TechGroup = {
  label: string
  items: string[]
}

/** A side project. Shown as a card on the home page and at /projects/<slug>/. */
export type Project = {
  /** URL segment, e.g. `frost` → `/projects/frost/`. */
  slug: string
  status: string
  kind: string
  title: string
  summary: string
  /** Card pills — a short subset of the full stack. */
  tech: string[]
  why: string[]
  decisions: string[]
  techGroups: TechGroup[]
  /** 16:9 WebP under public/screenshots (1600×900); card cover and page cover. */
  screenshot: {
    src: string
    alt: string
  }
  link: {
    label: string
    href: string
  }
}

export type Link = {
  label: string
  href: string
}

/** Icon shown for an external nav item on narrow screens, where the text nav is hidden. */
export type NavIcon = 'posts' | 'code' | 'link'

export type NavItem = Link & {
  /** Opens in a new tab and shows an arrow. */
  external: boolean
  /** External items without an icon disappear below 640px. */
  icon?: NavIcon
}

export type SiteConfig = {
  /** Absolute origin, e.g. `https://example.com`. Canonical URLs, sitemap and robots.txt derive from it. */
  url: string
  /** Wordmark, `og:site_name`, and the suffix of every page title. */
  name: string
  /** `<meta name="author">` and the footer copyright. */
  author: string
  /** Home page `<title>`. */
  title: string
  description: string
  email: string
  /** `<html lang>`, e.g. `ja` or `en`. */
  lang: string
  /** `og:locale`, e.g. `ja_JP` or `en_US`. */
  ogLocale: string
  /** `<meta name="theme-color">`. Defaults to `--bg-0`. */
  themeColor?: string
  links: {
    github?: string
    blog?: string
    x?: string
  }
  /** RSS 2.0 feed read at build time for the "latest posts" section. `null` hides the section. */
  feedUrl: string | null
  /** schema.org Person for the home page JSON-LD. `sameAs` is filled from `links`. */
  person: {
    name: string
    alternateName?: string
    jobTitle?: string
  }
  /** RFC 9116 security.txt. Omit to skip the file. `Expires` is the build time plus `expiresInDays` (default 365). */
  security?: {
    contact: string
    preferredLanguages?: string
    expiresInDays?: number
  }
}

export type HeroConfig = {
  eyebrow: string
  name: string
  handle?: string
  lead: string[]
  actions: {
    primary: Link
    secondary?: Link
  }
  facts: { label: string; value: string }[]
}

export type AboutConfig = {
  lead: string[]
  next: string[]
  facts: TechGroup[]
}

export type ContactConfig = {
  heading: string
  note?: string
}

export type FooterConfig = {
  tagline: string
}

/** Every fixed string in the UI. Translate here; the components carry no copy of their own. */
export type UiLabels = {
  skipToContent: string
  header: { homeAria: string; mainNavAria: string; externalNavAria: string }
  footer: { navAria: string; builtWith: string }
  /** `eyebrow` is rendered as `${eyebrow} · ${count}`. */
  projects: { eyebrow: string; heading: string }
  posts: { eyebrow: string; heading: string; viewAll: string }
  about: { eyebrow: string; heading: string; nextHeading: string }
  contact: { eyebrow: string }
  project: {
    breadcrumbAria: string
    home: string
    projects: string
    why: string
    decisions: string
    stack: string
    otherAria: string
    prev: string
    next: string
    backToList: string
    toList: string
    listTitle: string
  }
  notFound: { title: string; description: string; home: string; blog: string }
}
