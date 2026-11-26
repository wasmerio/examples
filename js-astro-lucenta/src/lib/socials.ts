const byLabel: Record<string, string> = {
  Behance: "social-behance",
  Dribbble: "social-dribbble",
  Instagram: "social-instagram",
  LinkedIn: "social-linkedin",
  RSS: "social-rss",
  X: "social-twitter-x",
};

export const socialIcon = (label: string) => byLabel[label] ?? "link";
