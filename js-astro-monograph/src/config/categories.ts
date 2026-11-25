/**
 * The site's categories. Every post belongs to exactly one of these, so keep the
 * list short — six is the practical ceiling before the sidebar stops reading as
 * a menu. Rename or replace entries here, then update the `category` value in
 * each post's frontmatter to match; the build fails on any mismatch.
 *
 * Order matters: it is the order used on the categories index and in the home
 * sidebar.
 */
export const categories = [
  "Engineering",
  "Reliability",
  "Cloud",
  "Security",
  "AI",
  "Design Systems",
] as const;

export type Category = (typeof categories)[number];

export const categorySlug = (category: string) =>
  category
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

/** One line per category, shown on its archive page and in listings. */
export const categoryDescriptions: Record<Category, string> = {
  Engineering: "Contracts, tooling, and the day-to-day craft of shipping software.",
  Reliability: "Incidents, observability, and the habits that keep systems honest.",
  Cloud: "Infrastructure, cost, and deploy pipelines that stay out of the way.",
  Security: "Authentication, privacy, and threat work explained for product teams.",
  AI: "Evaluations, model behavior, and applied automation that holds up in production.",
  "Design Systems": "Tokens, components, and the systems work that keeps interfaces coherent.",
};
