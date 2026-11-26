import { siteConfig, type SiteConfig } from '../config.ts';

type Words = Pick<SiteConfig['pieces'], 'label' | 'plural' | 'creator'>;

/** Every word the feed and the piece pages use for the pieces, built from `pieces` in the config. */
export function pieceWords({ label, plural, creator }: Words = siteConfig.pieces) {
  const Plural = plural.charAt(0).toUpperCase() + plural.slice(1);
  return {
    /** The label and number, e.g. "Poem 18". */
    piece: (n: number) => `${label} ${n}`,
    /** e.g. "poems 21–40" */
    range: (first: number, last: number) => `${plural} ${first}–${last}`,
    more: `More ${plural}`,
    previousGroup: `Previous ${plural}`,
    nextGroup: `Next ${plural}`,
    pageDescription: (first: number, last: number, total: number) =>
      `${Plural} ${first} to ${last} of ${creator}'s ${total}, one per screen.`,
    /** e.g. "All poems" */
    all: `All ${plural}`,
    contentsHeading: Plural,
    /** The closing card's line, e.g. "All 40 poems, by A. Poet.", without "by" when the pieces have no one creator. */
    closing: (total: number, by: string | undefined) => (by ? `All ${total} ${plural}, by ${by}.` : `All ${total} ${plural}.`),
    contentsDescription: (total: number) => `All ${total} ${plural} by ${creator}, each with its first line or title.`,
  };
}

/** A piece's own title, or nothing when it only repeats "<label> <n>", as the demo's do. */
export function ownTitle(title: string, n: number, { label }: Pick<SiteConfig['pieces'], 'label'> = siteConfig.pieces): string | undefined {
  return title === `${label} ${n}` ? undefined : title;
}

/** Who made a piece: its own `creator`, or the one in the config. */
export function creatorOf(data: { creator?: string | undefined }, { creator }: Pick<SiteConfig['pieces'], 'creator'> = siteConfig.pieces): string {
  return data.creator ?? creator;
}

/** The creator every piece shares, or nothing when some piece names someone else. */
export function sharedCreator(pieces: readonly { creator?: string | undefined }[], config: Pick<SiteConfig['pieces'], 'creator'> = siteConfig.pieces): string | undefined {
  const creators = new Set(pieces.map((data) => creatorOf(data, config)));
  return creators.size === 1 ? [...creators][0] : undefined;
}

/** A piece's own page: /<name>/<n>/. */
export const piecePath = (n: number, { name }: Pick<SiteConfig['pieces'], 'name'> = siteConfig.pieces): string => `/${name}/${n}/`;

/** Why `pieces.name` cannot name a content folder and URL segment, or nothing when it can. */
export function pieceNameProblem(name: string, feedBase: string = siteConfig.feedBase): string | undefined {
  if (!/^[a-z][a-z0-9-]*$/.test(name)) {
    return `pieces.name in src/config.ts names the content folder and the URL segment, so it takes lowercase letters, digits and hyphens, starting with a letter (got "${name}")`;
  }
  if (name === 'page') return 'pieces.name in src/config.ts cannot be "page": /page/2/ is the second feed page';
  if (feedBase.split('/')[1] === name) return `pieces.name in src/config.ts cannot be "${name}": feedBase puts the feed at ${feedBase}`;
  return undefined;
}

export interface PieceLike { data: { number: number }; body?: string | undefined }

/** Pieces in number order. Fails on an empty collection, a duplicate number, a gap in the numbers or an empty body. */
export function orderPieces<T extends PieceLike>(entries: T[], { name, label }: Pick<SiteConfig['pieces'], 'name' | 'label'> = siteConfig.pieces): T[] {
  if (entries.length === 0) {
    throw new Error(`No published pieces in src/content/${name}/. Set pieces.name in src/config.ts to the name of your content folder, and check that not every piece is a draft.`);
  }
  const sorted = [...entries].sort((a, b) => a.data.number - b.data.number);
  sorted.forEach((piece, i) => {
    const n = piece.data.number;
    if (!piece.body?.trim()) throw new Error(`${label} ${n} has an empty body.`);
    if (i > 0 && sorted[i - 1]!.data.number === n) throw new Error(`${label} ${n} appears twice.`);
  });
  const gap = sorted.findIndex((piece, i) => piece.data.number !== i + 1);
  if (gap !== -1) {
    throw new Error(`${label} ${gap + 1} is missing. The feed and the piece pages link pieces 1 to ${sorted.at(-1)!.data.number} by number, so number them with no gaps, and keep drafts at the end.`);
  }
  return sorted;
}
