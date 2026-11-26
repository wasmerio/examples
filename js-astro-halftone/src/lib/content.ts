// Collection queries the pages share. Drafts are filtered here, once, so no page and no feed
// can forget to. Everything that turns an entry into something printable lives here too, so a
// card, a cover line and the feed all agree on what a byline or a date looks like.
import { getImage } from 'astro:assets';
import { getCollection, getEntries, getEntry, type CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';
import { blog, site } from '../config';
import { t } from '../i18n';

export type Article = CollectionEntry<'articles'>;
export type Desk = CollectionEntry<'desks'>;
export type Author = CollectionEntry<'authors'>;

/** Newest first. The only door to the articles collection; `draft` is dropped behind it. */
export const getArticles = async (filter?: (article: Article) => boolean) =>
  (await getCollection('articles', (e) => !e.data.draft && (filter ? filter(e) : true))).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );

/** Navigation order, which is also the order desks print in down the home page. */
export const getDesks = async () =>
  (await getCollection('desks')).sort((a, b) => a.data.order - b.data.order);

export const deskHref = (desk: string) => `/${desk}`;
/** A desk id is the route segment and a filename is the slug, so the path needs no third field. */
export const articleHref = (article: Article) => `/${article.data.desk.id}/${article.id}`;

export const getAuthors = (article: Article) => getEntries(article.data.byline);

const listFormats = new Map<string, Intl.ListFormat>();
const names = (locale: string) =>
  listFormats.get(locale) ??
  listFormats
    .set(locale, new Intl.ListFormat(locale, { style: 'long', type: 'conjunction' }))
    .get(locale)!;

// Dates are parsed as UTC midnight; formatting in the local zone would shift a day westward.
const dateFormats = new Map<string, Intl.DateTimeFormat>();
const dates = (locale: string, options: Intl.DateTimeFormatOptions) => {
  const key = locale + JSON.stringify(options);
  return (
    dateFormats.get(key) ??
    dateFormats.set(key, new Intl.DateTimeFormat(locale, { ...options, timeZone: 'UTC' })).get(key)!
  );
};
export const formatDate = (date: Date, locale: string = site.locale) =>
  dates(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
/** The month alone, for a list already grouped under the year it belongs to. */
export const formatMonth = (date: Date, locale: string = site.locale) =>
  dates(locale, { month: 'long' }).format(date);

// Computed, never a field. The raw markdown is close enough to the rendered word count.
// Korean, Japanese and Chinese are not spaced into words, so their characters are counted
// instead, at 500 a minute against 200 words. Both rates are editorial guesses worth tuning.
const cjk = /[\u3000-\u30ff\u3400-\u9fff\uac00-\ud7af\uf900-\ufaff]/g;
export const readingTime = (article: Article) => {
  const body = article.body!.trim();
  const characters = body.match(cjk)?.length ?? 0;
  const words = body.replace(cjk, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200 + characters / 500));
};

/**
 * An article with everything a card, a cover line or a plate prints already resolved: the desk
 * it belongs to, the label box text, the byline as prose, the date and the reading time. Pages
 * compose from these rather than awaiting references component by component.
 */
export const present = async (article: Article, locale: string = site.locale) => {
  const desk = (await getEntry(article.data.desk))!;
  return {
    id: article.id,
    data: article.data,
    desk,
    href: articleHref(article),
    // An article without its own kicker is labelled by the desk that filed it.
    kicker: article.data.kicker ?? desk.data.name,
    byline: names(locale).format((await getAuthors(article)).map((a) => a.data.name)),
    date: formatDate(article.data.date, locale),
    minutes: readingTime(article),
  };
};
export type Item = Awaited<ReturnType<typeof present>>;
export const presentAll = (articles: Article[], locale: string = site.locale) =>
  Promise.all(articles.map((article) => present(article, locale)));

/**
 * A folio: how much is filed here, over what stretch. Articles arrive newest first, so the
 * span runs from the last entry to the first. One piece prints one month. The counting itself
 * is left to the language, which is the only place that knows its own plural rule.
 */
export const deskSpan = (articles: { data: { date: Date } }[], locale: string = site.locale) => {
  if (articles.length === 0) return '';
  const month = dates(locale, { month: 'long' });
  const first = month.format(articles[articles.length - 1].data.date);
  const last = month.format(articles[0].data.date);
  return `${t(locale).stories(articles.length)} · ${first === last ? last : `${first} – ${last}`}`;
};

/**
 * What to read next. Shared tags weigh double a shared desk, and the pool arrives newest
 * first, so pieces that tie on score stay in date order. Pass a pool with the current
 * article -- and anything already printed on the page -- taken out of it.
 */
export const related = (item: Item, pool: Item[], limit: number = blog.relatedPosts) => {
  const tags = new Set(item.data.tags ?? []);
  return pool
    .map((other) => ({
      other,
      score:
        (other.data.tags ?? []).filter((tag) => tags.has(tag)).length * 2 +
        (other.desk.id === item.desk.id ? 1 : 0),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ other }) => other);
};

/** The dimensions every scraper expects of a share card. */
export const cardSize = { width: 1200, height: 630 };

/**
 * The share card. AVIF is what the photographs ship as and what the pages serve, but the
 * scrapers that read og:image still want a JPEG at the standard size, so it is baked here --
 * once, for the meta tags and the structured data both.
 */
export const shareCard = async (image: ImageMetadata) =>
  (await getImage({ src: image, format: 'jpeg', ...cardSize, fit: 'cover' })).src;
