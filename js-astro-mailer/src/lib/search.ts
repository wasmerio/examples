import {
  formatDate,
  issueHref,
  issueNumber,
  readMinutes,
  publishedIssues,
  type Issue,
} from "@/lib/issues";

/**
 * One issue as the client-side search sees it. Both entry points — the header
 * dialog and the results page — read this shape from `/search-index.json`.
 */
export interface SearchItem {
  number: string;
  title: string;
  excerpt: string;
  href: string;
  topic: string;
  author: string;
  date: string;
  readTime: string;
}

export const searchItem = (issue: Issue): SearchItem => ({
  number: issueNumber(issue),
  title: issue.data.title,
  excerpt: issue.data.excerpt,
  href: issueHref(issue),
  topic: issue.data.topic,
  author: issue.data.author.name,
  date: formatDate(issue.data.date),
  readTime: `${readMinutes(issue)} min read`,
});

export const searchItems = (issues: Issue[]): SearchItem[] =>
  publishedIssues(issues).map(searchItem);
