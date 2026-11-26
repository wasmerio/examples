// Build-only artwork for share images: mark and name, rule, eyebrow, title, domain.
import { siteConfig } from '../config.ts';
import { HOME_TITLE, SEPARATOR, SITE_NAME, TAGLINE } from './seo.ts';

export interface CardNode {
  type: 'div' | 'img';
  key: null;
  props: {
    style: Readonly<Record<string, string | number>>;
    children?: string | CardNode | readonly CardNode[];
    src?: string;
  };
}

const GROUND = '#101210';
const TEXT = '#FFFFFF';
const MUTED = 'rgba(255,255,255,0.66)';
const RULE = 'rgba(255,255,255,0.14)';
/** Section folder -> eyebrow label for piece pages, e.g. { poems: 'Poem' }. */
export const SECTIONS: Readonly<Record<string, string>> = { [siteConfig.pieces.name]: siteConfig.pieces.label };

const div = (style: Record<string, string | number>, children: NonNullable<CardNode['props']['children']>): CardNode =>
  ({ type: 'div', key: null, props: { style, children } });

/** The page title without the site name; the home page shows the tagline. */
export function cardText(title: string): string {
  if (title === HOME_TITLE) return TAGLINE;
  if (title.endsWith(`${SEPARATOR}${SITE_NAME}`)) return title.slice(0, -(SITE_NAME.length + SEPARATOR.length));
  return title;
}

/** The section label for a piece page; nothing for the home page and list pages. */
export function eyebrowFor(pageUrl: string): string | undefined {
  const segments = new URL(pageUrl).pathname.split('/').filter(Boolean);
  return segments.length >= 2 ? SECTIONS[segments[0]!] : undefined;
}

export function createCard(input: { title: string; pageUrl: string; icon: string }): CardNode {
  const eyebrow = eyebrowFor(input.pageUrl);
  const title = cardText(input.title) || TAGLINE;
  return div({
    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    width: 1200, height: 630, padding: 80,
    backgroundColor: GROUND, color: TEXT, fontFamily: 'Noto Sans',
  }, [
    div({ display: 'flex', flexDirection: 'column' }, [
      div({ display: 'flex', alignItems: 'center' }, [
        { type: 'img', key: null, props: { src: input.icon, style: { width: 72, height: 72, marginRight: 24 } } },
        div({ display: 'flex', fontSize: 36, fontWeight: 700 }, SITE_NAME),
      ]),
      div({ display: 'flex', height: 2, marginTop: 24, backgroundColor: RULE }, ''),
    ]),
    div({ display: 'flex', flexDirection: 'column' }, [
      ...(eyebrow ? [div({ display: 'flex', marginBottom: 16, fontSize: 28, color: MUTED }, eyebrow)] : []),
      div({ display: 'block', fontSize: 64, fontWeight: 700, lineHeight: 1.12, maxHeight: 216, lineClamp: 3, overflow: 'hidden', textOverflow: 'ellipsis', wordBreak: 'break-word' }, title),
    ]),
    div({ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }, [
      div({ display: 'flex', fontSize: 28, color: MUTED }, new URL(siteConfig.origin).host),
    ]),
  ]);
}
