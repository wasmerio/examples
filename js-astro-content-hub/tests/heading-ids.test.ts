// Unit tests for the Sätteri heading-id plugin (src/lib/heading-ids.mjs).
//
// github-slugger dedups duplicate headings across the whole plugin instance
// (foo, foo-1, ...), so the factory must return a fresh slugger per page. We
// assert both behaviors by simulating the visitor over a sequence of nodes.

import { describe, it, expect } from 'vitest';
import { addHeadingIds } from '../src/lib/heading-ids.mjs';

/** Run the plugin's element visitor over headings, returning the id assigned
 *  to each (or undefined when skipped because an id was already present). */
function visit(headings) {
  const plugin = addHeadingIds();
  const out = [];
  for (const h of headings) {
    plugin.element.visit(h, {
      textContent: () => h._text ?? '',
    });
    out.push(h.properties?.id);
  }
  return out;
}

const heading = (text, id) => {
  const node = { type: 'element', tagName: 'h2', properties: { id } };
  node._text = text;
  return node;
};

describe('addHeadingIds', () => {
  it('assigns slugs from heading text', () => {
    const ids = visit([heading('Getting Started'), heading('API')]);
    expect(ids).toEqual(['getting-started', 'api']);
  });

  it('dedups repeated headings across the page (foo, foo-1, foo-2)', () => {
    const ids = visit([heading('Install'), heading('Install'), heading('Install')]);
    expect(ids).toEqual(['install', 'install-1', 'install-2']);
  });

  it('skips headings that already carry an id', () => {
    const ids = visit([heading('Manual', 'custom-id'), heading('Auto')]);
    // First node already has an id (set manually in source) -> untouched.
    expect(ids).toEqual(['custom-id', 'auto']);
  });

  it('only visits filtered heading tags (element.filter is the gate)', () => {
    const plugin = addHeadingIds();
    // The plugin's element.filter routes only h1-h4 to visit; other tags never
    // reach visit, so calling visit directly on a <p> is not how Sätteri works.
    expect(plugin.element.filter).toEqual(['h1', 'h2', 'h3', 'h4']);
  });
});
