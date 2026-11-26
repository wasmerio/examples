// Sätteri hast plugin: add `id` attributes to heading elements (h1-h4) so
// anchor links and the table of contents resolve to real in-page targets.
//
// Why a custom plugin when Sätteri ships a built-in `heading-ids` plugin?
// The built-in plugin populates `render().headings` (the { depth, slug, text }
// array used for the TOC) correctly, but its `ctx.setProperty(node, "id", slug)`
// call does not produce an HTML `id` attribute in the serialized output. This
// plugin sets `node.properties.id` directly, which the serializer does emit.
// The built-in plugin runs AFTER this one and reads `node.properties?.id` as
// the "existing id", so it reuses our slug for the headings array - keeping the
// TOC slugs and the HTML ids in sync.
//
// Uses `github-slugger` (already a Sätteri dependency) so slugs match the
// built-in slugger's output byte-for-byte, including duplicate-heading dedup
// (`foo`, `foo-1`, `foo-2`).
//
// This is a Sätteri hast plugin: a visitor object with `element.filter` (tag
// names) and `element.visit(node, ctx)`, the same shape as Sätteri's built-in
// plugins. Passed via `hastPlugins` in astro.config.mjs.

import Slugger from 'github-slugger';

export function addHeadingIds() {
  const slugger = new Slugger();
  return {
    name: 'content-hub-heading-anchor-ids',
    element: {
      filter: ['h1', 'h2', 'h3', 'h4'],
      visit(node, ctx) {
        // Skip if an id is already set (e.g. an explicit `{#id}` in source).
        if (typeof node.properties?.id === 'string' && node.properties.id) return;
        const text = ctx.textContent(node);
        const slug = slugger.slug(text);
        // Direct mutation - the serializer emits node.properties as attributes.
        node.properties = node.properties ?? {};
        node.properties.id = slug;
      },
    },
  };
}
