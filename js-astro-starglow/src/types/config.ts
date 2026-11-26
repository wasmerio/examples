import type { Palette } from "@/palettes";

interface SiteConfig {
  /**
   * Not set here. The site origin is resolved from SITE_URL by astro.config.ts
   * and read back through `import.meta.env.SITE` in src/config.ts.
   */
  url?: string;
  /** Blog title shown in header and meta tags */
  title: string;
  /** Short description used in SEO meta and RSS feed */
  description: string;
  /** Default post author name */
  author: string;
  /** Author profile URL (used in structured data) */
  profile?: string;
  /** Source repository of this site, linked from the footer. Empty = no link. */
  sourceUrl?: string;
  /** Header wordmark text (pixel face). Defaults to `title`. */
  wordmark?: string;
  /**
   * HTML comment written right after the doctype of every page, for people
   * who read the source. Empty or missing = no comment. Must not contain `--`.
   */
  sourceBanner?: {
    /** Multi-line ASCII art, e.g. the wordmark in a figlet font. */
    art?: string;
    /** Lines printed under the art. */
    message?: string;
  };
  /** Fallback OG image filename in /public, e.g. "og.jpg" */
  ogImage?: string;
  /** HTML lang attribute, defaults to "en" */
  lang?: string;
  /** IANA timezone for post dates, e.g. "Asia/Bangkok" */
  timezone?: string;
  /** Text direction */
  dir?: "ltr" | "rtl" | "auto";
  /** Google Search Console verification meta tag value */
  googleVerification?: string;
  /**
   * Fediverse handle as `@user@instance`. When set, every page head carries
   * `<meta name="fediverse:creator">`. Empty = no meta.
   */
  fediverseCreator?: string;
}

interface PostsConfig {
  /** Posts per page on paginated listing pages */
  perPage?: number;
  /** Posts shown on the index/home page */
  perIndex?: number;
  /**
   * @deprecated Has no effect: a post is listed from the start of its
   * `pubDatetime` day in the site timezone. Safe to remove.
   */
  scheduledPostMargin?: number;
}

interface FeaturesConfig {
  /** Enable light/dark mode toggle. Defaults to true. */
  lightAndDarkMode?: boolean;
  /**
   * Generate dynamic OG images per post and provide `/og.png` when the static
   * `public/{site.ogImage}` file is absent. When false, that file is required
   * for the default layout OG image (build fails if missing).
   */
  dynamicOgImage?: boolean;
  /** @deprecated Has no effect: there is no archives page. Safe to remove. */
  showArchives?: boolean;
  /** Show back button on post detail pages. Defaults to true. */
  showBackButton?: boolean;
  /** "Edit page" link shown on post detail pages. */
  editPost?:
    | {
        enabled: true;
        /** Base URL for the edit link, e.g. GitHub edit URL */
        url: string;
      }
    | { enabled: false };
  /**
   * Search provider. "pagefind" ships in the base template.
   * Set to false to disable search entirely.
   */
  search?: "pagefind" | false;
  /**
   * Table of contents on posts with 2+ h2/h3 headings: beside the post from
   * 1280px, in the floating button below that. Defaults to true. Turn it off
   * for one post with `hideToc: true` in its frontmatter.
   */
  toc?: boolean;
}

/** Header band glow behind the wordmark and page head. */
export type AmbientMode = "none" | "light" | "breathe" | "dawn";

interface AppearanceConfig {
  /**
   * Inner light of the header band: "light" a soft static glow, "breathe" the
   * same glow on a slow 10s pulse, "dawn" an accent-tinted glow. Defaults to
   * "none". No animation under prefers-reduced-motion.
   */
  ambient?: AmbientMode;
  /** Pulsing accent glow on the wordmark. Defaults to false. */
  wordmarkGlow?: boolean;
  /**
   * Vim-style status bar at the bottom of post and note pages: source path,
   * file type and scroll position. Defaults to false.
   */
  statusline?: boolean;
  /**
   * Colour palettes, chosen separately for dark and light mode. Built in:
   * dark "starglow", "void", "aurora", "ember"; light "starglow", "paper",
   * "petal", "frost", "sand". Defaults to "starglow" for both.
   */
  palette?: { dark?: string; light?: string };
  /**
   * Your own palettes, by name, usable in `palette`. Same shape as the
   * built-in ones in src/palettes.ts; pnpm verify checks their contrast.
   */
  palettes?: {
    dark?: Record<string, Palette>;
    light?: Record<string, Palette>;
  };
  /**
   * Floating "preview" panel to switch palette, mode, ambient light, glow and
   * statusline live. For theme demos; changes last for the browser session
   * only. Defaults to false.
   */
  preview?: boolean;
}

/** Icon and default label of an 88x31 badge. Unknown types get a generic icon. */
export type BadgeType =
  | "github"
  | "gitlab"
  | "codeberg"
  | "srht"
  | "linkedin"
  | "mastodon"
  | "bluesky"
  | "stack"
  | "hackaday"
  | "crates"
  | "email"
  | "rss"
  | "sparkle"
  | (string & {});

export interface BadgeLink {
  type: BadgeType;
  /**
   * http(s) or mailto: URL, or a site path starting with "/". Empty or
   * missing = not configured, renders nowhere.
   */
  url?: string;
  /** One-line badge text. Defaults per type, e.g. "github". */
  label?: string;
  /** Tooltip and accessible name. Defaults per type, e.g. "GitHub". */
  title?: string;
}

/** Supported social profiles. The name selects the icon file. */
export type SocialName =
  | "github"
  | "linkedin"
  | "mastodon"
  | "bluesky"
  | "lemmy"
  | "x"
  | "reddit"
  | "devto"
  | "medium";

export interface SocialLink {
  /** Selects the icon: "github" → src/assets/icons/socials/github.svg */
  name: SocialName;
  /** Visible and accessible service name, e.g. "GitHub", "DEV.to". */
  label: string;
  /** Profile URL (http or https). Empty or missing = not configured, renders nowhere. */
  url?: string;
  /**
   * Accessible name for the icon link (title attribute and screen-reader text).
   * Defaults to "{author} on {label}". Override when that wording doesn't fit.
   */
  linkTitle?: string;
}

/** A social link that passed config resolution: it has a usable http(s) URL. */
export type ResolvedSocialLink = SocialLink & { url: string };

/** Optional homepage Person structured data. Empty fields are left out. */
export interface PersonConfig {
  /** Real job title, or empty to omit it from the Person. */
  jobTitle?: string;
  /** Real one-sentence description of the person, or empty to omit it. */
  description?: string;
}

interface FooterConfig {
  /**
   * "powered by starglow" in the footer, linked to the theme repository.
   * Defaults to true. Keeping it on is the easiest way to support the theme.
   */
  credit?: boolean;
}

/** Theme repository, linked from the footer credit. */
export const STARGLOW_REPO = "https://github.com/glowing-space/starglow";

export interface StarglowConfig {
  site: SiteConfig;
  /** Optional homepage Person structured data (JSON-LD). Real text only. */
  person?: PersonConfig;
  posts?: PostsConfig;
  features?: FeaturesConfig;
  /** Social profile links shown in the homepage intro, the footer and on /contact/. Empty urls render nowhere. */
  socials?: SocialLink[];
  /** Header band glow, wordmark glow and the post statusline. */
  appearance?: AppearanceConfig;
  /**
   * 88x31 badges under the footer. Configured socials without a badge here
   * get one too. Empty urls render nowhere.
   */
  links?: BadgeLink[];
  /** Footer options. */
  footer?: FooterConfig;
}

type ResolvedSiteConfig = Required<
  Pick<
    SiteConfig,
    "title" | "description" | "author" | "lang" | "timezone" | "dir" | "ogImage"
  >
> &
  Pick<
    SiteConfig,
    "profile" | "sourceUrl" | "googleVerification" | "fediverseCreator"
  > & {
    /** Header wordmark text, `title` when not set */
    wordmark: string;
    /** The view-source comment body, or empty for none */
    sourceBanner: string;
    /** Site origin from SITE_URL (via astro.config.ts) */
    url: string;
  };

export interface ResolvedStarglowConfig {
  site: ResolvedSiteConfig;
  person: PersonConfig;
  posts: Required<PostsConfig>;
  features: Required<FeaturesConfig>;
  socials: ResolvedSocialLink[];
  appearance: Required<
    Pick<
      AppearanceConfig,
      "ambient" | "wordmarkGlow" | "statusline" | "preview"
    >
  > & {
    palette: { dark: string; light: string };
    /** Every palette available to this site: built-in plus custom. */
    palettes: { dark: Record<string, Palette>; light: Record<string, Palette> };
  };
  /** Badges with a usable URL: `links` first, then uncovered socials. */
  links: (BadgeLink & { url: string })[];
  footer: Required<FooterConfig>;
}

/** Type helper for starglow.config.ts. */
export function defineStarglowConfig(config: StarglowConfig): StarglowConfig {
  return config;
}
