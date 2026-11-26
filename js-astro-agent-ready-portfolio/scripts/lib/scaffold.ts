import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { parseList } from "./frontmatter.ts";

export class UsageError extends Error {}

const DATE = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2})?$/;

export const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const today = () => {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

const oneLine = (value: string) => value.replace(/\s+/g, " ").trim();

function write(root: string, relative: string, text: string) {
  const path = join(root, relative);
  if (existsSync(path)) {
    throw new UsageError(`${relative} already exists. Pick another title or edit that file.`);
  }
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text);
  return relative;
}

function requireTitle(title: string | undefined) {
  const slug = slugify(title ?? "");
  if (!title || !slug) throw new UsageError('a title is required, for example: "My post title".');
  return { title: oneLine(title), slug };
}

export type PostOptions = {
  title?: string;
  description?: string;
  tags?: string;
  projects?: string;
  cover?: string;
  published?: string;
  publish?: boolean;
};

/** Creates content/posts/<slug>.md. Without publish it is a draft, hidden everywhere. */
export function createPost(root: string, options: PostOptions) {
  const { title, slug } = requireTitle(options.title);
  const published = options.published ?? today();
  if (!DATE.test(published)) {
    throw new UsageError(`--published "${published}" is not a date. Use 2026-01-31 or 2026-01-31T14:30.`);
  }
  if (options.publish && !options.description) {
    throw new UsageError("--publish needs --description, a one-sentence summary used for cards, SEO and RSS.");
  }

  const lines = [
    `title: ${title}`,
    `description: ${oneLine(options.description ?? "TODO: one-sentence summary.")}`,
    `published: ${published}`,
    `tags: [${parseList(options.tags).join(", ")}]`,
  ];
  if (options.projects) lines.push(`projects: [${parseList(options.projects).join(", ")}]`);
  if (options.cover) lines.push(`cover: ${options.cover}`);
  if (!options.publish) lines.push("draft: true");

  return write(root, `content/posts/${slug}.md`, `---\n${lines.join("\n")}\n---\n\nWrite the post here.\n`);
}

export type ProjectOptions = {
  title?: string;
  repo?: string;
  description?: string;
  updated?: string;
};

/** Creates content/projects/<slug>.md, the page a project card can link to. */
export function createProject(root: string, options: ProjectOptions) {
  const { title, slug } = requireTitle(options.title);
  if (!options.repo) throw new UsageError("--repo is required, the project's repository URL.");
  if (!options.description) throw new UsageError("--description is required, one sentence about the project.");

  const lines = [
    `title: ${title}`,
    `description: ${oneLine(options.description)}`,
    `repo: ${options.repo}`,
    `updated: ${options.updated ?? today()}`,
  ];
  return write(root, `content/projects/${slug}.md`, `---\n${lines.join("\n")}\n---\n\nDescribe the project here.\n`);
}
