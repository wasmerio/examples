import { siteConfig } from '../config.ts';

export const PAGE_SIZE = 20;

export const pageCount = (total: number): number => Math.ceil(total / PAGE_SIZE);
export const pageOf = (n: number): number => Math.ceil(n / PAGE_SIZE);

/** Feed page p: the feed base for page 1, `<base>page/<p>/` after it. */
export const pageHref = (p: number): string => (p === 1 ? siteConfig.feedBase : `${siteConfig.feedBase}page/${p}/`);

/** Where piece n sits in the feed. */
export const feedHref = (n: number): string => `${pageHref(pageOf(n))}#${n}`;

export function pageRange(p: number, total: number): { first: number; last: number } {
  return { first: (p - 1) * PAGE_SIZE + 1, last: Math.min(p * PAGE_SIZE, total) };
}
