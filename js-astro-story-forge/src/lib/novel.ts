import type { CollectionEntry } from "astro:content";

export type NovelEntry = CollectionEntry<"novel">;

export const VOLUME_NAMES: Record<number, string> = {
  1: "Volume 1",
};

export function sortChapters(a: NovelEntry, b: NovelEntry): number {
  if (a.data.volume !== b.data.volume) {
    return a.data.volume - b.data.volume;
  }
  return a.data.chapter - b.data.chapter;
}

export function toVolumeParam(volume: number): string {
  return `volume-${volume}`;
}

export function toChapterParam(chapter: number): string {
  return `ch-${String(chapter).padStart(2, "0")}`;
}

export function toChapterUrl(entry: NovelEntry): string {
  return `/novel/${toVolumeParam(entry.data.volume)}/${toChapterParam(entry.data.chapter)}/`;
}
