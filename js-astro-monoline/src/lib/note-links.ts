// Links between notes, written the way an editor writes them, resolved to /notes/<id> at build
// time. All three point at src/content/notes/design-review-rules.md:
//
//   [the rules](/notes/design-review-rules)   the site path
//   [the rules](./design-review-rules.md)     a relative file link (VS Code, GitHub)
//   [[design-review-rules]]                   a wikilink (Obsidian), printed as the note's title;
//                                             [[Design review rules]],
//                                             [[design-review-rules|the rules]] and
//                                             [[design-review-rules#Who to invite]] work too
//
// Pure, no astro: imports: astro.config.mjs, the backlink count and the check script share it.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { MdastPluginDefinition } from 'satteri';

/** A file name as Astro's glob loader turns it into an id: "Design review.md" -> "design-review". */
export const slugify = (s: string): string =>
  s
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}\p{Pc}\- ]/gu, '')
    .replace(/ /g, '-');

const idOf = (path: string): string => path.split('/').map(slugify).join('/');

/**
 * The note a relative `.md`/`.mdx` link points at, as `/notes/<id>#fragment`, or null for
 * anything else (a site path, a full URL, an image).
 * ponytail: `../` and `./` are dropped, not resolved against the linking file, so a link from
 * a note in a subfolder to a note in another subfolder needs the folder in its path.
 */
export const resolveFileLink = (href: string): string | null => {
  if (/^([a-z][a-z\d+.-]*:|\/|#)/i.test(href)) return null;
  const m = /^(?:\.{1,2}\/)*(?:notes\/)?([^#?]+?)\.mdx?(#[^?]*)?$/.exec(href);
  if (!m) return null;
  return `/notes/${idOf(decodeURI(m[1]!))}${m[2] ?? ''}`;
};

/** `[[target]]`, `[[target|label]]`, `[[target#Heading]]`, `[[target#Heading|label]]`. */
export const WIKILINK = /\[\[([^\]|#]+)(?:#([^\]|]*))?(?:\|([^\]]+))?\]\]/g;

export const wikiHref = (target: string, heading?: string): string =>
  `/notes/${idOf(target.trim())}${heading ? `#${slugify(heading)}` : ''}`;

/** The note ids a Markdown body links to, in any of the three forms, once each, in order. */
export const linkedIds = (body: string): string[] => {
  const ids: string[] = [];
  const sitePath = /^\/notes\/([^/#?]+)/;
  for (const m of body.matchAll(/(?:\]\(|href=["'])([^)"'\s]+)/g)) {
    const href = m[1]!;
    const path = sitePath.test(href) ? href : resolveFileLink(href);
    const id = path && sitePath.exec(path)?.[1];
    if (id) ids.push(decodeURIComponent(id));
  }
  for (const m of body.matchAll(WIKILINK)) ids.push(idOf(m[1]!.trim()));
  return [...new Set(ids)];
};

/** Every note under a content folder, drafts included: id -> title (from the front matter). */
export const noteIds = (dir: string): Map<string, string | undefined> =>
  new Map(
    readdirSync(dir, { recursive: true, encoding: 'utf8' })
      .filter((f) => /\.mdx?$/.test(f))
      .map((f) => [
        idOf(f.replace(/\.mdx?$/, '').replaceAll('\\', '/')),
        /^title:\s*['"]?(.+?)['"]?\s*$/m.exec(readFileSync(join(dir, f), 'utf8'))?.[1],
      ]),
  );

/**
 * The Markdown side: file links and wikilinks become /notes/<id> links. A link to a note that
 * does not exist (a wikilink to a note you have not written yet) prints as its text, no link.
 */
export const noteLinks = (
  ids: Map<string, string | undefined> | Set<string>,
): MdastPluginDefinition => {
  const id = (path: string) => path.slice('/notes/'.length).replace(/#.*$/, '');
  const known = (path: string) => ids.has(id(path));
  const title = (path: string) => (ids instanceof Map ? ids.get(id(path)) : undefined);
  return {
    name: 'monoline-note-links',
    link(node, ctx) {
      const to = resolveFileLink(node.url);
      if (to === null) return;
      if (known(to)) ctx.setProperty(node, 'url', to);
      else ctx.replaceNode(node, { type: 'text', value: ctx.textContent(node) });
    },
    text(node, ctx) {
      if (!node.value.includes('[[')) return;
      const parts: ({ type: 'text'; value: string } | object)[] = [];
      let at = 0;
      for (const m of node.value.matchAll(WIKILINK)) {
        const [whole, target, heading, label] = m;
        if (m.index > at) parts.push({ type: 'text', value: node.value.slice(at, m.index) });
        const url = wikiHref(target!, heading);
        // No label: the note's title, as the tables print it; else the name as written.
        const value = label?.trim() || title(url) || target!.trim();
        parts.push(
          known(url)
            ? { type: 'link', url, children: [{ type: 'text', value }] }
            : { type: 'text', value },
        );
        at = m.index + whole.length;
      }
      if (at === 0) return;
      if (at < node.value.length) parts.push({ type: 'text', value: node.value.slice(at) });
      ctx.replaceNode(node, parts as never);
    },
  };
};
