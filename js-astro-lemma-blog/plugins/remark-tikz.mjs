// TikZ diagrams, compiled by LaTeX at build time into inline SVG:
//
//   ```tikzcd                                ```tikz
//   A \arrow[r, "f"] \arrow[d] & B \\        \draw (0,0) -- (1,1);
//   C \arrow[r] & D                          ```
//   ```
//
// `tikzcd` is the body of a tikz-cd diagram, `tikz` the body of a tikzpicture.
// The site and post macros (same format as for MathJax) are defined too.
//
// Needs latex and dvisvgm (TeX Live). Each SVG is cached in tikz-cache/ under
// a hash of its LaTeX source, and the cache is committed, so a build without
// TeX (CI) still has every diagram that was compiled once locally. Glyphs
// become paths and black becomes currentColor, so a diagram follows the text
// color (dark mode) and needs no fonts.
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { fromHtml } from 'hast-util-from-html';
import { visit } from 'unist-util-visit';

const run = promisify(execFile);
const ENV = { tikzcd: 'tikzcd', tikz: 'tikzpicture' };
const DVISVGM = ['--no-fonts', '--exact-bbox', '--precision=3'];
// LaTeX sizes are in pt and its text is 10pt: 10pt in the SVG is 1em on the page.
const PT_PER_EM = 10;

// \DeclareRobustCommand also replaces a command LaTeX already has.
function definitions(macros = {}) {
  return Object.entries(macros)
    .map(([name, def]) => {
      const [body, n, opt] = Array.isArray(def) ? def : [def];
      const args = n ? `[${n}]` + (opt !== undefined ? `[${opt}]` : '') : '';
      return `\\DeclareRobustCommand{\\${name}}${args}{${body}}`;
    })
    .join('\n');
}

// The dvisvgm option makes pgf write SVG specials; the default (dvips) driver
// gives an empty page for shadings.
function document(kind, body, macros) {
  return [
    '\\documentclass[dvisvgm]{standalone}',
    '\\usepackage{amsmath,amssymb,mathtools,tikz,tikz-cd}',
    '\\usetikzlibrary{arrows.meta,calc,positioning}',
    definitions(macros),
    '\\begin{document}',
    `\\begin{${ENV[kind]}}`,
    body,
    `\\end{${ENV[kind]}}`,
    '\\end{document}',
    '',
  ].join('\n');
}

// LaTeX source -> SVG text, or { error } with the first lines of LaTeX's complaint.
async function compile(source) {
  const dir = mkdtempSync(join(tmpdir(), 'tikz-'));
  try {
    writeFileSync(join(dir, 'd.tex'), source);
    try {
      await run('latex', ['-interaction=nonstopmode', '-halt-on-error', 'd.tex'], { cwd: dir });
    } catch (e) {
      if (e.code === 'ENOENT') return { error: 'latex not found (install TeX Live, or compile once on a machine that has it)' };
      const log = readFileSync(join(dir, 'd.log'), 'utf8');
      const at = log.search(/^! /m);
      return { error: at < 0 ? e.message : log.slice(at).split('\n').slice(0, 4).join('\n  ') };
    }
    const { stdout, stderr } = await run('dvisvgm', [...DVISVGM, '-o', 'd.svg', 'd.dvi'], { cwd: dir });
    const svg = readFileSync(join(dir, 'd.svg'), 'utf8');
    // Not an error to dvisvgm, but nothing to show; not cached, so it is tried again.
    if (/page is empty/.test(stdout + stderr) || /<svg[^>]*\b(?:width|height)=(['"])0(?:\.0*)?pt\1/.test(svg)) {
      return { error: 'empty diagram (dvisvgm produced no graphics)' };
    }
    return { svg };
  } catch (e) {
    return { error: e.code === 'ENOENT' ? 'dvisvgm not found' : e.message };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

// dvisvgm's SVG made fit to inline: ids unique to the diagram, black drawn in
// currentColor, white (label backgrounds) in the page background, size in em.
function inline(svg, hash, label) {
  const prefix = `tikz-${hash.slice(0, 8)}-`;
  const html = svg
    .replace(/<\?xml[^>]*>|<!--[\s\S]*?-->/g, '')
    .replace(/\bid=(['"])/g, `id=$1${prefix}`)
    .replace(/href=(['"])#/g, `href=$1#${prefix}`)
    .replace(/url\((['"]?)#/g, `url($1#${prefix}`)
    .replace(/(fill|stroke)=(['"])(?:#000(?:000)?|black)\2/g, '$1=$2currentColor$2')
    .replace(/(fill|stroke)=(['"])(?:#fff(?:fff)?|white)\2/g, 'style=$2$1:var(--bg)$2');
  const [root] = fromHtml(html, { fragment: true }).children.filter((n) => n.type === 'element');
  const size = (pt) => `${(parseFloat(pt) / PT_PER_EM).toFixed(3)}em`;
  Object.assign(root.properties, {
    width: size(root.properties.width),
    height: size(root.properties.height),
    fill: 'currentColor',
    role: 'img',
    ariaLabel: label,
  });
  return root;
}

/** @param {{ cache: URL, macros?: object }} options */
export default function remarkTikz({ cache, macros: siteMacros = {} }) {
  const dir = fileURLToPath(cache);
  return async (tree, file) => {
    const blocks = [];
    visit(tree, 'code', (node, index, parent) => {
      if (Object.hasOwn(ENV, node.lang ?? '')) blocks.push({ node, index, parent });
    });
    if (!blocks.length) return;
    const macros = { ...siteMacros, ...(file.data.astro?.frontmatter?.macros ?? {}) };
    await Promise.all(
      blocks.map(async ({ node, parent }) => {
        const source = document(node.lang, node.value, macros);
        const hash = createHash('sha1').update(DVISVGM.join(' ')).update(source).digest('hex');
        const path = join(dir, `${hash}.svg`);
        let svg = existsSync(path) ? readFileSync(path, 'utf8') : undefined;
        if (!svg) {
          const out = await compile(source);
          if (out.error) {
            // Left as a code block, so the diagram's source is still shown.
            console.warn(`[tikz] ${file.path}: ${out.error}\n  in: ${node.value.split('\n')[0]}`);
            return;
          }
          mkdirSync(dir, { recursive: true });
          writeFileSync(path, out.svg);
          svg = out.svg;
        }
        parent.children[parent.children.indexOf(node)] = {
          type: 'tikz',
          data: { hName: 'div', hProperties: { className: ['tikz'] }, hChildren: [inline(svg, hash, node.value)] },
        };
      }),
    );
  };
}
