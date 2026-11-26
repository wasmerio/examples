import { siteConfig, type SiteConfig } from '../config.ts';
import { SITE_NAME } from './seo.ts';
import { creativeWorkNode, graph, serializeJsonLd, websiteNode } from './structured-data.ts';

/** The home page's WebSite, published by the configured author; with no author, it names no publisher. */
export function homeJsonLd(origin: URL, { author }: Pick<SiteConfig, 'author'> = siteConfig): string {
  return serializeJsonLd(graph(websiteNode({
    url: new URL('/', origin).href, name: SITE_NAME, inLanguage: 'en', publisher: author,
  })));
}

/** A piece's page, by its own creator or the configured one, part of the configured book if there is one. */
export function pieceJsonLd(input: { url: string; name: string; description: string; creator?: string | undefined }, { pieces }: { pieces: Pick<SiteConfig['pieces'], 'creator' | 'book'> } = siteConfig): string {
  const { creator, ...work } = input;
  return serializeJsonLd(graph(creativeWorkNode({
    ...work,
    inLanguage: 'en',
    author: { '@type': 'Person', name: creator ?? pieces.creator },
    partOf: pieces.book && { '@type': 'Book', ...pieces.book },
  })));
}
