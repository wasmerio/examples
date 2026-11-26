// Builders for the schema.org nodes the template emits, typed with schema-dts. src/lib/identity.ts
// assembles each page's graph from them.
//
// Each node stands on its own. Google reads one page at a time and does not follow an @id to
// another domain, so a page that credits a person repeats their name and url inline.

import type { CreativeWork, Graph, Person, Thing, WebSite } from 'schema-dts';

type Node<T> = Exclude<T, string>;

/** Who a page credits: a name, the person's own site and, optionally, a fixed @id. */
export interface PersonRef {
  name: string;
  url: string;
  id?: string | undefined;
}

/** `url` with `#fragment`, the form every @id here takes: https://example.com/#website. */
export function nodeId(url: string | URL, fragment: string): string {
  const id = new URL(url);
  id.hash = fragment;
  return id.href;
}

/** A Person by @id, name and url: enough for Google to credit someone without a full node. */
export function personReference(person: PersonRef): Node<Person> {
  return { '@type': 'Person', '@id': person.id ?? nodeId(person.url, 'person'), name: person.name, url: person.url };
}

export interface WebSiteInput {
  /** The home page URL; the node's @id is this URL with #website. */
  url: string;
  name: string;
  alternateName?: string | readonly string[] | undefined;
  description?: string | undefined;
  inLanguage?: string | undefined;
  /** Who publishes the site; leave it out for no publisher. */
  publisher?: PersonRef | undefined;
}

/** The home page's WebSite, which Google reads for the site name. Only on the root of a domain or subdomain. */
export function websiteNode(input: WebSiteInput): Node<WebSite> {
  return {
    '@type': 'WebSite', '@id': nodeId(input.url, 'website'), url: input.url, name: input.name,
    ...(input.alternateName ? { alternateName: input.alternateName } : {}),
    ...(input.description ? { description: input.description } : {}),
    ...(input.inLanguage ? { inLanguage: input.inLanguage } : {}),
    ...(input.publisher ? { publisher: personReference(input.publisher) } : {}),
  };
}

export interface CreativeWorkInput {
  url: string;
  name: string;
  description?: string | undefined;
  datePublished?: string | undefined;
  dateModified?: string | undefined;
  inLanguage?: string | undefined;
  /** A PersonRef for someone with a site of their own, or a Person node for a writer without one. */
  author: PersonRef | Node<Person>;
  /** The site's home page URL, or a node the work belongs to, such as a Book. */
  partOf?: string | Node<CreativeWork> | undefined;
}

/** A poem, a piece of art or any other work that is not an article. */
export function creativeWorkNode(input: CreativeWorkInput): Node<CreativeWork> {
  const author = '@type' in input.author ? input.author : personReference(input.author);
  const partOf = typeof input.partOf === 'string' ? { '@id': nodeId(input.partOf, 'website') } : input.partOf;
  return {
    '@type': 'CreativeWork', '@id': nodeId(input.url, 'work'), url: input.url, name: input.name,
    ...(input.description ? { description: input.description } : {}),
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
    ...(input.inLanguage ? { inLanguage: input.inLanguage } : {}),
    author,
    ...(partOf ? { isPartOf: partOf } : {}),
  };
}

/** One page's nodes in a single script element. */
export function graph(...nodes: readonly Node<Thing>[]): Graph {
  return { '@context': 'https://schema.org', '@graph': nodes };
}

/** JSON for a <script type="application/ld+json">; escaping < keeps the text from closing the element. */
export function serializeJsonLd(value: Graph | Node<Thing>): string {
  return JSON.stringify(value).replaceAll('<', '\\u003c');
}
