const byLabel: Record<string, string> = {
  Bluesky: "social-bluesky",
  Facebook: "social-facebook",
  GitHub: "social-github",
  Instagram: "social-instagram",
  LinkedIn: "social-linkedin",
  Mastodon: "social-mastodon",
  RSS: "social-rss",
  Threads: "social-threads",
  X: "social-twitter-x",
  YouTube: "social-youtube",
};

export const socialIcon = (label: string) => byLabel[label] ?? "link";
