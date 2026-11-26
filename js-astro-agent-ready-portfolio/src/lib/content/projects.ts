import { parseFrontmatter } from "$lib/content/frontmatter";

// Project pages live in content/projects/<slug>.md with simple frontmatter:
//
//   ---
//   title: Page title
//   description: One-sentence summary used for the page header and SEO.
//   repo: https://github.com/owner/name
//   updated: 2026-11-09   (optional)
//   ---
const files = import.meta.glob("/content/projects/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export type ProjectPage = {
  slug: string;
  title: string;
  description: string;
  repo: string;
  updated?: string;
  body: string;
};

export const projectPages: ProjectPage[] = Object.entries(files).map(
  ([path, raw]) => {
    const { data, body } = parseFrontmatter(raw);
    const slug = path.split("/").pop()!.replace(/\.md$/, "");

    if (!data.title || !data.description || !data.repo) {
      throw new Error(
        `Project page "${slug}" needs title, description, and repo in its frontmatter.`,
      );
    }

    return {
      slug,
      title: data.title,
      description: data.description,
      repo: data.repo,
      updated: data.updated,
      body,
    };
  },
);
