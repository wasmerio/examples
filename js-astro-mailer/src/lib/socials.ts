const iconByLabel = {
  Bluesky: "bluesky",
  Email: "envelope",
  LinkedIn: "linkedin",
  Mastodon: "mastodon",
  RSS: "rss",
  X: "twitter-x",
} as const;

export type SocialIconName = (typeof iconByLabel)[keyof typeof iconByLabel] | "link-45deg";

/** Falls back to a generic link glyph for labels the theme has no mark for. */
export const socialIconFor = (label: string): SocialIconName =>
  iconByLabel[label as keyof typeof iconByLabel] ?? "link-45deg";
