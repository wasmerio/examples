import { getCollection, type CollectionEntry } from 'astro:content';
import { siteConfig } from '../config.ts';
import { orderPieces } from './pieces.ts';

const { name } = siteConfig.pieces;

export type Piece = CollectionEntry<typeof name>;

/** Published pieces in number order; fails when there are none, or on duplicates, gaps and empty bodies. */
export async function getPieces(): Promise<Piece[]> {
  return orderPieces(await getCollection(name, (entry) => !entry.data.draft));
}
