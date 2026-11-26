#!/usr/bin/env node
// One-off codemod: rewrite Hexo/Butterfly tag plugins ({% ... %}) into
// standard Markdown + GitHub alerts + remark-directive syntax.
//
// Usage: node scripts/migrate-tags.mjs [--check] [files or dirs...]
//   default target: src/content/ (pass source/_posts to convert a Hexo checkout in place)
//   --check  only report files that still contain tag plugins (exit 1 if any)

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const BLOCK_TAGS = ['note', 'tip', 'folding', 'tabs'];
const FENCE_RE = /^(\s*)(`{3,}|~{3,})/;

// Butterfly note types in stylesheet order: when several are given ({% note info success %})
// the later rule wins, so `success` is what readers saw.
const NOTE_TYPES = ['default', 'primary', 'info', 'success', 'warning', 'danger'];
// Types a GitHub alert can express 1:1 (same colour + icon in styles/tag-plugins.css).
const NOTE_ALERT = { info: 'NOTE', success: 'TIP', primary: 'IMPORTANT', warning: 'WARNING', danger: 'CAUTION' };
const NOTE_STYLES = new Set(['flat', 'modern', 'simple', 'disabled']);

// ---------- helpers ----------

const escLabel = (s) => s.replace(/\\/g, '\\\\').replace(/\[/g, '\\[').replace(/\]/g, '\\]');
const attr = (v) => `"${String(v).replace(/"/g, '&quot;')}"`;
const indentOf = (line) => line.match(/^\s*/)[0];

/** Split "opts, text" at the first comma. Returns [opts[], text]. */
function splitArgs(raw) {
  const i = raw.indexOf(',');
  if (i === -1) return [[], raw.trim()];
  const opts = raw.slice(0, i).trim().split(/\s+/).filter(Boolean);
  return [opts, raw.slice(i + 1).trim()];
}

/** Iterate over the lines of `src`, calling fn(line, inFence) and collecting results. */
function mapOutsideFences(lines, fn) {
  let fence = null;
  return lines.map((line) => {
    const m = line.match(FENCE_RE);
    if (m) {
      const marker = m[2];
      if (!fence) { fence = marker; return line; }
      if (marker[0] === fence[0] && marker.length >= fence.length && line.trim() === marker) {
        fence = null; return line;
      }
    }
    return fence ? line : fn(line);
  });
}

// ---------- inline tags ----------

function convertInline(line) {
  const ind = indentOf(line);
  return line.replace(/\{%\s*(\w+)\s*([^%]*?)\s*%\}/g, (whole, name, raw, offset) => {
    switch (name) {
      case 'span': {
        const [opts, text] = splitArgs(raw);
        const cls = opts.map((c) => `.${c}`).join(' ');
        return `:span[${escLabel(text)}]${cls ? `{${cls}}` : ''}`;
      }
      case 'radio':
      case 'checkbox': {
        const [opts, text] = splitArgs(raw);
        const checked = opts.includes('checked');
        const colors = opts.filter((o) => o !== 'checked');
        const parts = colors.map((c) => `.${c}`);
        if (checked) parts.push('checked');
        return `:${name}[${escLabel(text)}]${parts.length ? `{${parts.join(' ')}}` : ''}`;
      }
      case 'del':
        return `~~${raw.trim()}~~`;
      case 'psw':
        return `:spoiler[${escLabel(raw.trim())}]`;
      case 'bubble': {
        // {% bubble word, "tip text", color %}
        const m = raw.match(/^([^,]+),\s*"([^"]*)"\s*(?:,\s*(\S+))?$/) || raw.match(/^([^,]+),\s*([^,]*)\s*(?:,\s*(\S+))?$/);
        if (!m) return whole;
        const color = m[3]?.replace(/^["']|["']$/g, '');
        return `:tooltip[${escLabel(m[1].trim())}]{tip=${attr(m[2].trim())}${color ? ` color=${attr(color)}` : ''}}`;
      }
      case 'image': {
        const [src, ...rest] = raw.split(',').map((s) => s.trim());
        const o = Object.fromEntries(rest.map((p) => p.split('=').map((s) => s.trim())));
        const alt = o.alt || o.title || '';
        const img = o.width
          ? `<img src=${attr(src)} alt=${attr(alt)} width=${attr(o.width.replace(/px$/, ''))} />`
          : `![${escLabel(alt)}](${src}${o.title ? ` ${attr(o.title)}` : ''})`;
        // {% image %} was a block-level figure: give it its own paragraph.
        const before = line.slice(0, offset);
        if (before.trim() !== '') return `\n${ind}\n${ind}${img}`;
        return img;
      }
      default:
        return whole;
    }
  });
}

// Leaf (whole-line) tags that become leaf directives.
function convertLeaf(line) {
  const ind = indentOf(line);
  const t = line.trim();
  let m = t.match(/^\{%\s*meting\s+(.*?)\s*%\}$/);
  if (m) {
    const args = [...m[1].matchAll(/"([^"]*)"/g)].map((x) => x[1]);
    const [id, server = 'netease', type = 'playlist'] = args;
    return `${ind}::music{id=${attr(id)} server=${attr(server)} type=${attr(type)}}`;
  }
  m = t.match(/^\{%\s*site\s+(.*?)\s*%\}$/);
  if (m) {
    const [name, ...rest] = m[1].split(',').map((s) => s.trim());
    const o = Object.fromEntries(rest.map((p) => {
      const i = p.indexOf('=');
      return [p.slice(0, i).trim(), p.slice(i + 1).trim()];
    }));
    const attrs = [`name=${attr(name)}`, ...Object.entries(o).map(([k, v]) => `${k}=${attr(v)}`)];
    return `${ind}::site{${attrs.join(' ')}}`;
  }
  return null;
}

// ---------- block tags -> tree ----------

/** Put every block open/close tag (and tab markers) on its own line, keeping indentation. */
function isolateBlockTags(lines) {
  const re = new RegExp(`(\\{%\\s*(?:end)?(?:${BLOCK_TAGS.join('|')})\\b[^%]*%\\})`, 'g');
  const out = [];
  let fence = null;
  for (const line of lines) {
    const fm = line.match(FENCE_RE);
    if (fm) {
      if (!fence) fence = fm[2];
      else if (line.trim() === fm[2] && fm[2][0] === fence[0] && fm[2].length >= fence.length) fence = null;
      out.push(line);
      continue;
    }
    if (fence || !re.test(line)) { out.push(line); re.lastIndex = 0; continue; }
    re.lastIndex = 0;
    const ind = indentOf(line);
    for (const piece of line.trim().split(re)) {
      if (piece.trim() === '') continue;
      out.push(ind + piece.trim());
    }
  }
  return out;
}

function parseBlocks(lines) {
  const root = { kind: 'root', children: [] };
  const stack = [root];
  let fence = null;
  lines.forEach((line, idx) => {
    const top = stack[stack.length - 1];
    const fm = line.match(FENCE_RE);
    if (fm) {
      if (!fence) fence = fm[2];
      else if (line.trim() === fm[2] && fm[2][0] === fence[0] && fm[2].length >= fence.length) fence = null;
      top.children.push(line);
      return;
    }
    if (fence) { top.children.push(line); return; }

    const t = line.trim();
    let m = t.match(/^\{%\s*(note|tip|folding|tabs)\b\s*(.*?)\s*%\}$/);
    if (m) {
      const node = { kind: m[1], args: m[2], indent: indentOf(line), children: [], line: idx + 1 };
      top.children.push(node);
      stack.push(node);
      return;
    }
    m = t.match(/^\{%\s*end(note|tip|folding|tabs)\s*%\}$/);
    if (m) {
      // close a pending tab first
      if (top.kind === 'tab') stack.pop();
      const cur = stack[stack.length - 1];
      if (cur.kind !== m[1]) throw new Error(`line ${idx + 1}: {% end${m[1]} %} closes ${cur.kind}`);
      stack.pop();
      return;
    }
    m = t.match(/^<!--\s*tab\s+(.*?)\s*-->$/);
    if (m && (top.kind === 'tabs' || top.kind === 'tab')) {
      if (top.kind === 'tab') stack.pop();
      const node = { kind: 'tab', args: m[1], indent: indentOf(line), children: [] };
      stack[stack.length - 1].children.push(node);
      stack.push(node);
      return;
    }
    if (/^<!--\s*endtab\s*-->$/.test(t) && top.kind === 'tab') { stack.pop(); return; }
    top.children.push(line);
  });
  if (stack.length !== 1) throw new Error(`unclosed {% ${stack[stack.length - 1].kind} %} (line ${stack[stack.length - 1].line})`);
  return root;
}

/** Parse `{% note … %}` args: Butterfly classes, optional quoted icon, and the alert it maps to (if any). */
function noteInfo(args) {
  const toks = [...args.matchAll(/'[^']*'|"[^"]*"|\S+/g)].map((x) => x[0]);
  const icon = toks.find((t) => /^['"]/.test(t))?.slice(1, -1);
  const words = toks.filter((t) => !/^['"]/.test(t));
  const effective = NOTE_TYPES.filter((t) => words.includes(t)).at(-1);
  const extras = words.filter((w) => !NOTE_TYPES.includes(w) && w !== 'flat');
  const alert = !icon && !extras.length ? NOTE_ALERT[effective] : undefined;
  return { icon, words: [...new Set(words)], alert };
}

/** Height of directive-container nesting below a node (alert notes don't count: they use `>`). */
function height(node) {
  let h = 0;
  for (const c of node.children) if (typeof c !== 'string') h = Math.max(h, height(c));
  if (node.kind === 'root' || (node.kind === 'note' && noteInfo(node.args).alert)) return h;
  return h + 1;
}

function stripIndent(line, ind) {
  return line.startsWith(ind) ? line.slice(ind.length) : line.replace(/^\s+/, '');
}

function trimBlank(arr) {
  let s = 0, e = arr.length;
  while (s < e && arr[s].trim() === '') s++;
  while (e > s && arr[e - 1].trim() === '') e--;
  return arr.slice(s, e);
}

/** Serialize children; every converted block is surrounded by blank lines so it can't be
 *  swallowed by a preceding paragraph / blockquote (lazy continuation). */
function serialize(node) {
  const out = [];
  let pad = false;
  for (const c of node.children) {
    if (typeof c === 'string') {
      if (pad && c.trim() !== '') out.push('');
      pad = false;
      out.push(c);
      continue;
    }
    if (out.length && out[out.length - 1].trim() !== '') out.push('');
    out.push(...serializeBlock(c));
    pad = true;
  }
  return out;
}

/** Collapse runs of blank lines outside code fences. */
function collapseBlank(lines) {
  const out = [];
  let fence = null;
  for (const line of lines) {
    const fm = line.match(FENCE_RE);
    if (fm) {
      if (!fence) fence = fm[2];
      else if (line.trim() === fm[2] && fm[2][0] === fence[0] && fm[2].length >= fence.length) fence = null;
    }
    if (!fence && line.trim() === '' && out.length && out[out.length - 1].trim() === '') continue;
    out.push(line);
  }
  return out;
}

function serializeBlock(node) {
  const ind = node.indent;
  const inner = node.kind === 'tabs' ? [] : trimBlank(serialize(node)).map((l) => stripIndent(l, ind));
  const colons = ':'.repeat(3 + height(node) - 1);

  switch (node.kind) {
    case 'note': {
      const { icon, words, alert } = noteInfo(node.args);
      // plain {% note <type> [flat] %} with a type GitHub alerts cover → standard alert
      if (alert) {
        return [`${ind}> [!${alert}]`, ...inner.map((l) => (l.trim() === '' ? `${ind}>` : `${ind}> ${l}`))];
      }
      // anything else keeps Butterfly's exact classes (default, colours, icons, modern…)
      const attrs = [...words.map((w) => `.${w}`), icon && `icon=${attr(icon)}`].filter(Boolean).join(' ');
      return [`${ind}${colons}note{${attrs}}`, ...inner.map((l) => (l ? ind + l : l)), `${ind}${colons}`];
    }
    case 'tip': {
      // {% tip warning faa-horizontal animated %}: keep the font-awesome-animation classes
      const [type = 'info', ...more] = node.args.split(/\s+/).filter(Boolean);
      const attrs = [`type=${type}`, ...more.map((c) => `.${c}`)].join(' ');
      return [`${ind}${colons}tip{${attrs}}`, ...inner.map((l) => (l ? ind + l : l)), `${ind}${colons}`];
    }
    case 'folding': {
      const [opts, title] = splitArgs(node.args);
      const color = opts.find((o) => o !== 'open');
      const attrs = [color && `.${color}`, opts.includes('open') && 'open'].filter(Boolean);
      const t = node.args.includes(',') ? title : node.args.trim();
      return [
        `${ind}${colons}details[${escLabel(t)}]${attrs.length ? `{${attrs.join(' ')}}` : ''}`,
        ...inner.map((l) => (l ? ind + l : l)),
        `${ind}${colons}`,
      ];
    }
    case 'tabs': {
      const tabs = node.children.filter((c) => typeof c !== 'string');
      const out = [`${ind}${colons}tabs`];
      tabs.forEach((tab, i) => {
        const body = trimBlank(serialize(tab)).map((l) => stripIndent(l, ind));
        const tc = ':'.repeat(colons.length - 1);
        if (i > 0) out.push('');
        out.push(`${ind}${tc}tab[${escLabel(tab.args)}]`, '', ...body.map((l) => (l ? ind + l : l)), '', `${ind}${tc}`);
      });
      out.push(`${ind}${colons}`);
      return out;
    }
    default:
      throw new Error(`unknown block ${node.kind}`);
  }
}

// ---------- driver ----------

export function migrate(src) {
  const eol = src.includes('\r\n') ? '\r\n' : '\n';
  const fmEnd = src.startsWith('---') ? src.indexOf(`${eol}---`, 3) : -1;
  if (remainingTags(src).length === 0) return src;
  const head = fmEnd === -1 ? '' : src.slice(0, fmEnd + eol.length * 2 + 3);
  const body = fmEnd === -1 ? src : src.slice(head.length);

  let lines = body.split(eol);
  lines = mapOutsideFences(lines, (l) => convertLeaf(l) ?? l);
  lines = isolateBlockTags(lines);
  lines = mapOutsideFences(lines, convertInline).flatMap((l) => l.split('\n'));
  const tree = parseBlocks(lines);
  return head + collapseBlank(serialize(tree)).join(eol);
}

export function remainingTags(src) {
  const lines = src.split(/\r?\n/);
  const hits = [];
  let fence = null;
  lines.forEach((line, i) => {
    const fm = line.match(FENCE_RE);
    if (fm) {
      if (!fence) fence = fm[2];
      else if (line.trim() === fm[2] && fm[2][0] === fence[0]) fence = null;
      return;
    }
    if (fence) return;
    const code = line.replace(/`[^`]*`/g, '');
    if (/\{%[^%]*%\}/.test(code)) hits.push(i + 1);
  });
  return hits;
}

function collect(p) {
  const st = statSync(p);
  if (st.isFile()) return p.endsWith('.md') ? [p] : [];
  return readdirSync(p).flatMap((f) => collect(join(p, f)));
}

const isMain = import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}` || process.argv[1]?.endsWith('migrate-tags.mjs');
if (isMain) {
  const args = process.argv.slice(2);
  const check = args.includes('--check');
  const targets = args.filter((a) => !a.startsWith('--'));
  const files = (targets.length ? targets : ['src/content']).flatMap(collect);
  let changed = 0, failed = 0, leftover = 0;
  for (const f of files) {
    const src = readFileSync(f, 'utf8');
    if (check) {
      const hits = remainingTags(src);
      if (hits.length) { leftover++; console.log(`${relative('.', f)}: tag plugins at lines ${hits.join(', ')}`); }
      continue;
    }
    try {
      const out = migrate(src);
      if (out !== src) { writeFileSync(f, out); changed++; console.log(`migrated ${relative('.', f)}`); }
      const hits = remainingTags(out);
      if (hits.length) { leftover++; console.warn(`  ! still has tags at lines ${hits.join(', ')}`); }
    } catch (e) {
      failed++;
      console.error(`FAILED ${relative('.', f)}: ${e.message}`);
    }
  }
  console.log(check ? `${leftover} file(s) with tag plugins` : `${changed} migrated, ${failed} failed, ${leftover} with leftovers`);
  process.exit(failed || leftover ? 1 : 0);
}
