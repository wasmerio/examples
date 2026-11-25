import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse, type DefaultTreeAdapterMap } from 'parse5';
import type { AstroIntegration } from 'astro';
import { siteAddress } from '../lib/site-url.ts';
import { srcsetCandidates } from '../lib/url-values.ts';

type Node = DefaultTreeAdapterMap['node'];
type LinkWarning = { page: string; reference: string; reason: string };
const attributes = new Set(['href', 'src', 'poster', 'data', 'action', 'cite']);

function inspect(html: string) {
  const references = new Set<string>();
  const anchors = new Set<string>();
  let redirect = false;
  function visit(node: Node, inContent = false) {
    if ('tagName' in node) {
      if (node.tagName === 'template') return;
      if (
        node.tagName === 'meta' &&
        node.attrs.some(
          (attr) =>
            attr.name === 'http-equiv' &&
            attr.value.toLowerCase() === 'refresh',
        )
      )
        redirect = true;
      for (const attr of node.attrs)
        if (
          attr.name === 'id' ||
          (node.tagName === 'a' && attr.name === 'name')
        )
          anchors.add(attr.value);
      inContent ||= node.attrs.some(
        (attr) =>
          attr.name === 'class' &&
          attr.value.split(/\s+/).includes('article-content'),
      );
      if (inContent)
        for (const attr of node.attrs) {
          if (attributes.has(attr.name)) references.add(attr.value);
          if (attr.name === 'srcset')
            for (const candidate of srcsetCandidates(attr.value))
              references.add(candidate.url);
        }
      // Script/style attributes are URLs too, but their bodies are not markup.
      if (['script', 'style'].includes(node.tagName)) return;
    }
    if ('childNodes' in node)
      for (const child of node.childNodes) visit(child, inContent);
  }
  visit(parse(html));
  return { references, anchors, redirect };
}

/** Check local author URLs against finished output; never request external sites. */
export async function checkRelativeLinks(output: string, baseUrl: string) {
  const site = siteAddress(baseUrl);
  const files = new Set<string>();
  async function walk(directory: string, prefix = '') {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const relative = `${prefix}${entry.name}`;
      if (entry.isDirectory())
        await walk(path.join(directory, entry.name), `${relative}/`);
      else if (entry.isFile()) files.add(relative);
    }
  }
  await walk(output);
  const documents = new Map<string, ReturnType<typeof inspect>>();
  for (const file of [...files].filter((file) => file.endsWith('.html')).sort())
    documents.set(
      file,
      inspect(await readFile(path.join(output, file), 'utf8')),
    );

  const warnings: LinkWarning[] = [];
  for (const [file, document] of documents) {
    const page = `${site.base}${file
      .split('/')
      .map(encodeURIComponent)
      .join('/')
      .replace(/index\.html$/, '')}`;
    for (const reference of document.references) {
      const value = reference.trim();
      if (!value || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(value)) continue;
      const warn = (reason: string) =>
        warnings.push({ page, reference, reason });
      try {
        const url = new URL(value, new URL(page, site.url));
        if (!url.pathname.startsWith(site.base)) {
          warn('Target is outside the deployment base.');
          continue;
        }
        const relative = decodeURIComponent(
          url.pathname.slice(site.base.length),
        );
        const target = [
          relative,
          path.posix.join(relative, 'index.html'),
          `${relative}.html`,
        ].find((candidate) => files.has(candidate));
        if (!target) {
          warn(`Target does not exist: ${url.pathname}`);
          continue;
        }
        // Text fragments and the browser's special #top destination need no ID.
        const fragment = decodeURIComponent(url.hash.slice(1)).split(':~:')[0];
        const destination = documents.get(target);
        if (
          fragment &&
          fragment.toLowerCase() !== 'top' &&
          destination &&
          !destination.redirect &&
          !destination.anchors.has(fragment)
        )
          warn(`Anchor does not exist: ${url.pathname}#${fragment}`);
      } catch {
        warn('Invalid relative URL or percent encoding.');
      }
    }
  }
  return warnings;
}

export default function relativeLinks(baseUrl: string): AstroIntegration {
  return {
    name: 'bloggpt-relative-links',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        for (const warning of await checkRelativeLinks(
          fileURLToPath(dir),
          baseUrl,
        ))
          logger.warn(
            `Invalid relative URL in ${warning.page}: ${JSON.stringify(warning.reference)}. ${warning.reason}`,
          );
      },
    },
  };
}
