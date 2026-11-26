// Collection queries the pages share. Drafts are filtered here, once, so no page can forget.
import { getCollection, getEntries, type CollectionEntry } from 'astro:content';
import { site } from '../config';

export type Issue = CollectionEntry<'issues'>;
export type Article = CollectionEntry<'articles'>;

/** Newest first. The first entry is the current issue. */
export const getIssues = async () =>
  (await getCollection('issues', (e) => !e.data.draft)).sort(
    (a, b) => b.data.number - a.data.number,
  );

/** In contents order, which is also the folio order. */
export const getIssueArticles = async (issue: Issue) =>
  (await getCollection('articles', (e) => !e.data.draft && e.data.issue.id === issue.id)).sort(
    (a, b) => a.data.order - b.data.order,
  );

/** Issue numbers print two-up everywhere: "Issue 04", the folio, the contents rows. */
export const pad = (n: number) => String(n).padStart(2, '0');

export const issueHref = (issue: Issue) => `/issues/${issue.data.number}`;
export const articleHref = (issue: Issue, article: Article) =>
  `/issues/${issue.data.number}/${article.id}`;

export const getAuthors = (article: Article) => getEntries(article.data.authors);

const listFormat = new Intl.ListFormat(site.locale, { style: 'long', type: 'conjunction' });

export const byline = async (article: Article) =>
  listFormat.format((await getAuthors(article)).map((a) => a.data.name));

// Computed, never a field. The raw markdown is close enough to the rendered word count.
// Korean, Japanese and Chinese are not spaced into words, so their characters are counted
// instead, at 500 a minute against 200 words. Both rates are editorial guesses worth tuning.
const cjk = /[　-ヿ㐀-鿿가-힯豈-﫿]/g;
export const readingTime = (article: Article) => {
  const body = article.body!.trim();
  const characters = body.match(cjk)?.length ?? 0;
  const words = body.replace(cjk, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200 + characters / 500));
};

// Dates are parsed as UTC midnight; formatting in the local zone would shift a day westward.
const dateFormat = new Intl.DateTimeFormat(site.locale, {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});
export const formatDate = (date: Date) => dateFormat.format(date);

export type Author = CollectionEntry<'authors'>;
