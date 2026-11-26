import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { parseFrontmatter, parseList } from "./frontmatter.ts";
import type { Problem } from "./problems.ts";
import { checkStarter } from "./starter.ts";

const DATE = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2})?$/;
const isAbsoluteUrl = (value: unknown) =>
  typeof value === "string" && /^https?:\/\/[^\s/]+/.test(value);

type Card = { name: string; href: string; page?: string; image?: { src: string } };

async function load(root: string, name: string, problems: Problem[]) {
  const file = `content/${name}.ts`;
  const path = join(root, file);
  if (!existsSync(path)) {
    problems.push({ file, message: "is missing. The site needs it." });
    return undefined;
  }
  try {
    return await import(pathToFileURL(path).href);
  } catch (error) {
    problems.push({ file, message: `could not be loaded: ${(error as Error).message}` });
    return undefined;
  }
}

function checkImage(root: string, file: string, field: string, path: unknown, problems: Problem[]) {
  if (typeof path !== "string" || !path.startsWith("/")) {
    problems.push({ file, field, message: "must be a path starting with /, such as /images/me.jpg." });
  } else if (!existsSync(join(root, "content/public", path))) {
    problems.push({
      file,
      field,
      message: `${path} does not exist. Add the file at content/public${path} or fix the path.`,
    });
  }
}

const markdownFiles = (root: string, dir: string) => {
  const path = join(root, dir);
  return existsSync(path) ? readdirSync(path).filter((name) => name.endsWith(".md")) : [];
};

function checkSite(root: string, site: Record<string, any>, problems: Problem[]) {
  const file = "content/site.ts";
  if (!isAbsoluteUrl(site.url) || site.url.endsWith("/")) {
    problems.push({ file, field: "url", message: "must be the full site address without a trailing slash, such as https://example.com." });
  }
  for (const key of ["name", "title", "description"]) {
    if (!site[key]) problems.push({ file, field: key, message: "is empty. Fill it in." });
  }
  if (site.accent !== undefined && !/^#[0-9a-fA-F]{6}$/.test(site.accent)) {
    problems.push({ file, field: "accent", message: `"${site.accent}" is not a colour. Use a 6-digit hex such as #7dd3fc.` });
  }
  checkImage(root, file, "image.path", site.image?.path, problems);
  checkImage(root, file, "profileImage.path", site.profileImage?.path, problems);
}

function checkProfile(profile: Record<string, any>, problems: Problem[]) {
  const file = "content/profile.ts";
  for (const key of ["name", "role"]) {
    if (!profile[key]) problems.push({ file, field: key, message: "is empty. Fill it in." });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email ?? "")) {
    problems.push({ file, field: "email", message: "must be an email address." });
  }
  (profile.links ?? []).forEach((link: { href: string }, index: number) => {
    if (!isAbsoluteUrl(link.href) && !String(link.href).startsWith("mailto:")) {
      problems.push({ file, field: `links[${index}].href`, message: "must be a full URL starting with https:// (or mailto:)." });
    }
  });
}

function checkCards(root: string, cards: Card[], problems: Problem[]) {
  const file = "content/github-projects.ts";
  const pages = markdownFiles(root, "content/projects").map((name) => name.replace(/\.md$/, ""));
  for (const card of cards) {
    if (card.page && !pages.includes(card.page)) {
      problems.push({ file, field: card.name, message: `links to the page "${card.page}", but content/projects/${card.page}.md does not exist. Create it with pnpm new:project or remove the page field.` });
    }
    if (!card.page && !isAbsoluteUrl(card.href)) {
      problems.push({ file, field: card.name, message: "needs a full href (https://...) or a page." });
    }
    if (card.image) checkImage(root, file, `${card.name}.image.src`, card.image.src, problems);
  }
}

function checkPosts(root: string, cards: Card[], problems: Problem[]) {
  for (const name of markdownFiles(root, "content/posts")) {
    const file = `content/posts/${name}`;
    const { data } = parseFrontmatter(readFileSync(join(root, file), "utf8"));
    if (data.draft === "true") continue;
    for (const key of ["title", "description", "published"]) {
      if (!data[key]) problems.push({ file, field: key, message: "is missing. Add it to the frontmatter, or set draft: true to hide the post." });
    }
    if (data.published && !DATE.test(data.published)) {
      problems.push({ file, field: "published", message: `"${data.published}" is not a date. Use 2026-01-31 or 2026-01-31T14:30.` });
    }
    if (data.cover) checkImage(root, file, "cover", data.cover, problems);
    for (const project of parseList(data.projects)) {
      if (!cards.some((card) => card.name === project)) {
        problems.push({ file, field: "projects", message: `project "${project}" is not in content/github-projects.ts. Fix the name or add the card.` });
      }
    }
  }
}

function checkProjectPages(root: string, problems: Problem[]) {
  for (const name of markdownFiles(root, "content/projects")) {
    const file = `content/projects/${name}`;
    const { data } = parseFrontmatter(readFileSync(join(root, file), "utf8"));
    for (const key of ["title", "description", "repo"]) {
      if (!data[key]) problems.push({ file, field: key, message: "is missing. Add it to the frontmatter." });
    }
  }
}

export async function checkContent(root: string, { ignoreStarter = false, allowPlaceholders = false } = {}): Promise<Problem[]> {
  const problems: Problem[] = [];
  const site = await load(root, "site", problems);
  const profile = await load(root, "profile", problems);
  const projects = await load(root, "github-projects", problems);
  const cards: Card[] = projects?.githubProjects ?? [];

  if (site) checkSite(root, site.site, problems);
  if (profile) checkProfile(profile.profile, problems);
  if (!existsSync(join(root, "content/public/resume.pdf"))) {
    problems.push({ file: "content/public/resume.pdf", message: "is missing. The hero links to it; add your resume there." });
  }
  checkCards(root, cards, problems);
  checkPosts(root, cards, problems);
  checkProjectPages(root, problems);

  return ignoreStarter ? problems : [...problems, ...(await checkStarter(root, { allowPlaceholders }))];
}
