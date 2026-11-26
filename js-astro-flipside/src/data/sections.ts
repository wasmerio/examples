// Generic content blocks for the about faces. Each face's identity card
// (avatar, toggle, socials) stays bespoke in its own component; everything
// below the fold is one of these, so both faces render as
// `SECTIONS.map((s) => <Section section={s} />)` (see Section.astro).
import type { ImageMetadata } from "astro";
import type { IconName } from "@/components/icons";
export type TimelineEntry = {
  title: string;
  subtitle?: string;
  start: string;
  end?: string; // "YYYY.MM"
  duties?: { name: string; text: string }[];
};
export type HighlightEntry = { title: string; subtitle?: string; date: string };
export type CardEntry = {
  title: string;
  subtitle?: string;
  /** Imported asset (astro:assets pipeline) or a full https:// URL;
   *  omit for a placeholder card. */
  img?: ImageMetadata | string;
  url?: string;
};

export type Section =
  | { type: "text"; title?: string; paragraphs: string[] }
  | { type: "chips"; title?: string; items: string[] }
  | {
      type: "kv";
      title?: string;
      // href makes the whole row card a link (e.g. to a store or product
      // page); external http(s) links open in a new tab. icon is a name
      // from src/components/Icon.astro.
      rows: { label: string; value: string; icon?: IconName; href?: string }[];
    }
  | { type: "timeline"; title?: string; entries: TimelineEntry[] }
  | { type: "highlights"; title?: string; entries: HighlightEntry[] }
  | { type: "cards"; title?: string; cards: CardEntry[] }
  | { type: "stats"; title?: string; tiles: { value: string; label: string }[] }
  | {
      type: "links";
      title?: string;
      links: { label: string; url: string; note?: string }[];
    }
  | { type: "markdown"; title?: string; body: string };
