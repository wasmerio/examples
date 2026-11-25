import type { CollectionEntry } from "astro:content";
import { topics, topicSlug, type Topic } from "@/config/topics";
import { siteConfig } from "@/config/site";

export type Issue = CollectionEntry<"issues">;
export { topics, topicSlug, type Topic };

export const writerSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

/** Monogram fallback for writers with no portrait in `src/config/writers.ts`. */
export const writerInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

export const issueSlug = (issue: Issue) => issue.id.replace(/\/index$/, "");

export const issueHref = (issue: Issue) => `/issues/${issueSlug(issue)}/`;

/** "No. 07" — zero-padded so a two-digit archive keeps one column width. */
export const issueNumber = (issue: Issue) => String(issue.data.issue).padStart(2, "0");

const byNewest = (a: Issue, b: Issue) => b.data.date.getTime() - a.data.date.getTime();

export const publishedIssues = (issues: Issue[]) =>
  issues.filter((issue) => !issue.data.draft).sort(byNewest);

export const byTopic = (issues: Issue[], topic: Topic) =>
  publishedIssues(issues).filter((issue) => issue.data.topic === topic);

/** The issue the front page leads with: the flagged one, else the newest. */
export const leadIssue = (issues: Issue[]) => {
  const published = publishedIssues(issues);
  return published.find((issue) => issue.data.featured) ?? published[0];
};

/**
 * The issues either side of this one in reading order, for the footer of an
 * article. Older is "previous" — the archive counts up, so this matches the
 * numbering rather than the sort.
 */
export const adjacentIssues = (issues: Issue[], current: Issue) => {
  const published = publishedIssues(issues);
  const index = published.findIndex((issue) => issue.id === current.id);
  return {
    newer: index > 0 ? published[index - 1] : undefined,
    older: index >= 0 ? published[index + 1] : undefined,
  };
};

export const relatedIssues = (issues: Issue[], current: Issue, limit = 3) =>
  publishedIssues(issues)
    .filter((issue) => issue.id !== current.id)
    .sort((a, b) => {
      const sameTopic =
        Number(b.data.topic === current.data.topic) - Number(a.data.topic === current.data.topic);
      return sameTopic || byNewest(a, b);
    })
    .slice(0, limit);

export interface WriterSummary {
  slug: string;
  name: string;
  role: string;
  issues: Issue[];
}

export const allWriters = (issues: Issue[]): WriterSummary[] =>
  Array.from(
    publishedIssues(issues)
      .reduce((writers, issue) => {
        const { name, role } = issue.data.author;
        const slug = writerSlug(name);
        const current = writers.get(slug);
        writers.set(slug, {
          name,
          /* The first role a name appears under wins, so a guest byline keeps
             the title from their own issues. */
          role: current?.role ?? role,
          issues: [...(current?.issues ?? []), issue],
        });
        return writers;
      }, new Map<string, Omit<WriterSummary, "slug">>())
      .entries(),
  )
    .map(([slug, writer]) => ({ slug, ...writer }))
    .sort((a, b) => b.issues.length - a.issues.length || a.name.localeCompare(b.name));

/** Words of real prose: code, markup, URLs and Markdown punctuation dropped first. */
const wordPattern = /[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu;

export const wordCount = (issue: Issue) => {
  const prose = (issue.body ?? "")
    .replace(/^---\n[\s\S]*?\n---/, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1");
  return prose.match(wordPattern)?.length ?? 0;
};

export const readMinutes = (issue: Issue) =>
  Math.max(1, Math.round(wordCount(issue) / siteConfig.wordsPerMinute));

export const formatDate = (date: Date, style: "short" | "long" = "short") =>
  new Intl.DateTimeFormat(siteConfig.dateLocale, {
    month: style === "short" ? "short" : "long",
    day: "numeric",
    year: "numeric",
  }).format(date);

export const formatYear = (date: Date) =>
  new Intl.DateTimeFormat(siteConfig.dateLocale, { year: "numeric" }).format(date);

/** Adds the trailing slash Astro's paginator leaves off, so canonicals agree. */
export const withTrailingSlash = (url: string | undefined) =>
  url && !url.endsWith("/") ? `${url}/` : url;
