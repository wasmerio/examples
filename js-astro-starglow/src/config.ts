/** Resolved config with defaults applied. Edit `starglow.config.ts`, not this file. */
import userConfig from "@/starglow.config";
import type {
  BadgeLink,
  ResolvedStarglowConfig,
  ResolvedSocialLink,
  SocialLink,
  StarglowConfig,
} from "./types/config";
import { darkPalettes, lightPalettes } from "./palettes";
import { PUBLIC_GOOGLE_SITE_VERIFICATION } from "astro:env/client";

// public/default-og.jpg is intentionally absent. It is only used when
// `dynamicOgImage` is false; add a real image here before turning that off.
const DEFAULT_OG_IMAGE = "default-og.jpg";

/**
 * Keeps only configured profiles (non-empty url) and rejects anything that is
 * not an http(s) URL, so no consumer has to filter or sanitise again.
 */
function resolveSocials(list: SocialLink[]): ResolvedSocialLink[] {
  const resolved: ResolvedSocialLink[] = [];
  for (const entry of list) {
    const url = entry.url?.trim();
    if (!url) continue;
    let protocol = "";
    try {
      protocol = new URL(url).protocol;
    } catch {
      // falls through to the error below
    }
    if (protocol !== "http:" && protocol !== "https:") {
      throw new Error(
        `[config] socials "${entry.name}": url must be an http(s) URL, got "${url}"`
      );
    }
    resolved.push({ ...entry, url });
  }
  return resolved;
}

function resolveFediverseCreator(
  value: string | undefined
): string | undefined {
  const handle = value?.trim();
  if (!handle) return undefined;
  if (!/^@[^@\s]+@[^@\s]+$/.test(handle)) {
    throw new Error(
      `[config] site.fediverseCreator must look like @user@instance, got "${handle}"`
    );
  }
  return handle;
}

/**
 * The view-source comment body: art, then message, each line indented. An
 * HTML comment cannot contain `--`, so such text fails the build.
 */
function resolveSourceBanner(
  banner: { art?: string; message?: string } | undefined
): string {
  const parts = [banner?.art, banner?.message]
    .map(part => (part ?? "").replace(/^\n+|\s+$/g, ""))
    .filter(Boolean);
  if (parts.length === 0) return "";
  const body = parts.join("\n");
  if (body.includes("--") || body.startsWith(">") || body.endsWith("-")) {
    throw new Error(
      "[config] site.sourceBanner must not contain `--`, start with `>` or end with `-` (it is an HTML comment)"
    );
  }
  return body;
}

/**
 * Badges with a usable URL (http(s), mailto: or a site path), then one badge
 * per configured social profile whose URL no badge already uses.
 */
function resolveLinks(
  list: BadgeLink[],
  socials: ResolvedSocialLink[]
): (BadgeLink & { url: string })[] {
  const resolved: (BadgeLink & { url: string })[] = [];
  for (const entry of list) {
    const url = entry.url?.trim();
    if (!url) continue;
    let ok = url.startsWith("/") && !url.startsWith("//");
    try {
      ok ||= ["http:", "https:", "mailto:"].includes(new URL(url).protocol);
    } catch {
      // not absolute: only a site path is accepted
    }
    if (!ok) {
      throw new Error(
        `[config] links "${entry.type}": url must be http(s), mailto: or a path starting with "/", got "${url}"`
      );
    }
    resolved.push({ ...entry, url });
  }
  for (const social of socials) {
    if (resolved.some(link => link.url === social.url)) continue;
    resolved.push({ type: social.name, url: social.url, title: social.label });
  }
  return resolved;
}

function resolvePalettes(appearance: StarglowConfig["appearance"]) {
  const palettes = {
    dark: { ...darkPalettes, ...appearance?.palettes?.dark },
    light: { ...lightPalettes, ...appearance?.palettes?.light },
  };
  const palette = {
    dark: appearance?.palette?.dark ?? "starglow",
    light: appearance?.palette?.light ?? "starglow",
  };
  for (const mode of ["dark", "light"] as const) {
    if (!(palette[mode] in palettes[mode])) {
      throw new Error(
        `[config] appearance.palette.${mode}: unknown palette "${palette[mode]}". Available: ${Object.keys(palettes[mode]).join(", ")}`
      );
    }
  }
  return { palette, palettes };
}

const PLACEHOLDER_MARKERS = ["[PLACEHOLDER]", "[[TODO", "[DEMO]"];

/** Structured data must never carry placeholder text: empty means omitted. */
function resolvePersonField(
  name: string,
  value: string | undefined
): string | undefined {
  const text = value?.trim();
  if (!text) return undefined;
  if (PLACEHOLDER_MARKERS.some(marker => text.includes(marker))) {
    throw new Error(
      `[config] person.${name} must be real text or empty, got "${text}"`
    );
  }
  return text;
}

const config: ResolvedStarglowConfig = {
  site: {
    ...userConfig.site,
    url: import.meta.env.SITE,
    ogImage: userConfig.site.ogImage ?? DEFAULT_OG_IMAGE,
    lang: userConfig.site.lang ?? "en",
    timezone: userConfig.site.timezone ?? "UTC",
    dir: userConfig.site.dir ?? "ltr",
    googleVerification:
      userConfig.site.googleVerification || PUBLIC_GOOGLE_SITE_VERIFICATION,
    fediverseCreator: resolveFediverseCreator(userConfig.site.fediverseCreator),
    wordmark: userConfig.site.wordmark?.trim() || userConfig.site.title,
    sourceBanner: resolveSourceBanner(userConfig.site.sourceBanner),
  },
  person: {
    jobTitle: resolvePersonField("jobTitle", userConfig.person?.jobTitle),
    description: resolvePersonField(
      "description",
      userConfig.person?.description
    ),
  },
  posts: {
    perPage: userConfig.posts?.perPage ?? 4,
    perIndex: userConfig.posts?.perIndex ?? 4,
    // Deprecated. Not read from userConfig, so builds don't warn about it.
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: userConfig.features?.lightAndDarkMode ?? true,
    dynamicOgImage: userConfig.features?.dynamicOgImage ?? true,
    // Deprecated and unused.
    showArchives: false,
    showBackButton: userConfig.features?.showBackButton ?? true,
    editPost: userConfig.features?.editPost ?? { enabled: false },
    search: userConfig.features?.search ?? "pagefind",
    toc: userConfig.features?.toc ?? true,
  },
  socials: resolveSocials(userConfig.socials ?? []),
  appearance: {
    ambient: userConfig.appearance?.ambient ?? "none",
    wordmarkGlow: userConfig.appearance?.wordmarkGlow ?? false,
    statusline: userConfig.appearance?.statusline ?? false,
    preview: userConfig.appearance?.preview ?? false,
    ...resolvePalettes(userConfig.appearance),
  },
  links: [],
  footer: {
    credit: userConfig.footer?.credit ?? true,
  },
};
config.links = resolveLinks(userConfig.links ?? [], config.socials);

export default config;
