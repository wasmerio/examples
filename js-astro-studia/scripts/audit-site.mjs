/*
 * Structural and accessibility audit of dist/, run offline against the built
 * bytes before anything is published (`npm run audit` — the one gate, which the
 * deploy workflow runs before it publishes). Each block is one independent
 * check; what each one asserts and why is in docs/Verification.md.
 *
 * A note on the shape of these checks: several work by regex over built
 * output, which is a technique with one characteristic failure — change the
 * thing being matched and the regex silently matches nothing and reports
 * success. Every check of that kind here therefore asserts a floor on how much
 * it found. A check that has stopped checking must fail, not pass.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const DIST = join(ROOT, 'dist');
const SRC = join(ROOT, 'src');

let failed = 0;
const fail = (msg) => {
  console.error(`✗ ${msg}`);
  failed += 1;
};
const ok = (msg) => console.log(`✓ ${msg}`);

if (!existsSync(DIST)) {
  console.error('✗ dist/ not found — run `npm run build` first.');
  process.exit(1);
}

// ---- configuration, read by regex: a plain node script has no TS loader ----
const consts = readFileSync(join(SRC, 'consts.ts'), 'utf8');

/* SITE_URL first, for the same reason astro.config.ts reads it: a build made for
   another origin has to be audited against that origin, or check 4 fails every
   internal URL for carrying the wrong base. */
const siteUrl = (process.env.SITE_URL ?? consts.match(/url:\s*'([^']+)'/)?.[1] ?? '').replace(
  /\/$/,
  '',
);
if (!siteUrl) {
  console.error('✗ could not read SITE.url from src/consts.ts, and SITE_URL is unset');
  process.exit(1);
}
const OWN_HOST = new URL(siteUrl).host;

/**
 * The base path, when the site is deployed into a subdirectory. Check 4 asserts
 * every internal URL carries it.
 *
 * Taken from SITE.url's own path, which is where astro.config.ts gets `base`
 * from too. It used to grep astro.config.ts for a `base: '…'` string literal —
 * which stops matching the moment that value is computed rather than written
 * out, and then this reads '' and check 4 quietly stops checking while still
 * printing green. Read the same single source the build reads.
 */
const BASE = new URL(siteUrl).pathname.replace(/\/$/, '');

const ALLOWED = new Set(
  [
    ...(consts.match(/ALLOWED_THIRD_PARTY:\s*string\[\]\s*=\s*\[([^\]]*)\]/s)?.[1] ?? '').matchAll(
      /'([^']+)'/g,
    ),
  ].map((m) => m[1]),
);

/**
 * The feature flags, read the same way, for the one question `dist/` cannot
 * answer on its own: whether something absent was supposed to be there.
 */
const flags = readFileSync(join(SRC, 'features.ts'), 'utf8');
if (!/^\s*feed: (true|false),$/m.test(flags)) {
  console.error('✗ could not read the flags from src/features.ts — run `npm run docs`');
  process.exit(1);
}
const featureOn = (id) => new RegExp(`^\\s*${id}: true,$`, 'm').test(flags);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const files = walk(DIST);
const htmlFiles = files.filter((f) => f.endsWith('.html'));
const cssFiles = files.filter((f) => f.endsWith('.css'));
const jsFiles = files.filter((f) => f.endsWith('.js'));
const pages = htmlFiles.map((f) => ({
  file: f,
  url: '/' + relative(DIST, f).split('\\').join('/'),
  html: readFileSync(f, 'utf8'),
}));

// A redirect stub is intentionally minimal: no nav, no canonical, no h1.
const isStub = (p) => /<meta http-equiv="refresh"/i.test(p.html);
const real = pages.filter((p) => !isStub(p));

/** The prefix every absolute self-URL must start with; SITE.url already
    carries the base. */
const SITE_ROOT = siteUrl.replace(/\/$/, '');

/* ---- resolving a published URL to the file that serves it ------------------
 *
 * STRICT, BY SHAPE: /a/b/ is a/b/index.html and nothing else, /a/b is a/b.html
 * and nothing else. Accepting either spelling is how a build under the wrong
 * URL policy once passed every check while every deployed link 404ed — a
 * static host does not try the other spelling. The base is stripped first:
 * dist/ is still the root of what gets deployed.
 */
const isFile = (p) => existsSync(p) && statSync(p).isFile();
const resolvePath = (path) => {
  const rel = path.replace(/^\//, '');
  const leaf = path.split('/').pop();
  const expected = path.endsWith('/')
    ? join(rel, 'index.html')
    : /\.[a-z0-9]+$/i.test(leaf)
      ? rel
      : `${rel}.html`;
  const file = join(DIST, expected);
  if (isFile(file)) return { file, expected, other: '' };
  // The other spelling, named when it exists: that is the link/file mismatch
  // this check exists to catch, as opposed to a plain dangling link.
  const alt = path.endsWith('/') ? `${rel.replace(/\/$/, '')}.html` : join(rel, 'index.html');
  const other = isFile(join(DIST, alt))
    ? ` (${alt} exists — the link's shape does not match the file the URL policy emitted)`
    : '';
  return { file: undefined, expected, other };
};
const resolve = (raw) =>
  resolvePath(BASE && raw.startsWith(`${BASE}/`) ? raw.slice(BASE.length) : raw);
/** An absolute URL of this site to its site-relative path, or undefined if it is not one. */
const ownPath = (url) => {
  if (url === SITE_ROOT) return '/';
  return url.startsWith(`${SITE_ROOT}/`) ? url.slice(SITE_ROOT.length) : undefined;
};

// ---- 1. every CSS custom property is defined --------------------------------
/*
 * Only a var() used WITHOUT a fallback has to resolve: the fallback is the
 * definition (Prose.astro's `--ti` is never defined in CSS on purpose).
 * Flagging every use once passed only because one demo page set `--ti`
 * inline and the loop pools inline definitions globally — a check that
 * passes for an accidental reason is worse than no check.
 */
{
  const defined = new Set();
  /** Every var() read, for the count. */
  const used = new Map();
  /** Only the reads with no fallback — these are the ones that must resolve. */
  const required = new Map();
  const collect = (text, where) => {
    for (const m of text.matchAll(/(--[a-z0-9-]+)\s*:/gi)) defined.add(m[1]);
    for (const m of text.matchAll(/var\(\s*(--[a-z0-9-]+)\s*(,?)/gi)) {
      const [, name, comma] = m;
      if (!used.has(name)) used.set(name, where);
      if (!comma && !required.has(name)) required.set(name, where);
    }
  };
  for (const f of cssFiles) collect(readFileSync(f, 'utf8'), relative(DIST, f));
  // Inline styles count too: the venue badges pass their brand colour that way.
  for (const p of pages) {
    for (const m of p.html.matchAll(/style="([^"]*)"/g)) collect(m[1], p.url);
    for (const m of p.html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) collect(m[1], p.url);
  }
  // A floor, because this check is regex-based: if it ever stops finding
  // properties at all it has stopped checking, and that must fail rather than
  // report a cheerful "0 custom properties, all defined".
  if (used.size < 20) fail(`css: only ${used.size} custom properties found — the scan is broken`);
  const undef = [...required].filter(([name]) => !defined.has(name));
  if (undef.length) for (const [n, w] of undef) fail(`undefined custom property ${n} (${w})`);
  else ok(`css: ${used.size} custom properties, all defined or defaulted`);
}

// ---- 2. dark-only: no theme switching crept back in -------------------------
{
  const offenders = [
    ...cssFiles.filter((f) => /\[data-theme/.test(readFileSync(f, 'utf8'))),
    ...pages.filter((p) => /data-theme|light-toggle/.test(p.html)).map((p) => p.file),
  ];
  if (offenders.length) fail(`dark-only violated in ${offenders.length} file(s)`);
  else ok('css: dark-only, no theme toggle');
}

// ---- 2b. every section has an accent block ----------------------------------
{
  // The `Section` union and tokens.css have to agree, or a page renders with
  // the default accent, which looks deliberate. Compared from the outside, in
  // the built HTML and CSS, so nothing here parses TypeScript.
  const inHtml = new Set();
  for (const p of pages) {
    for (const m of p.html.matchAll(/\bdata-section="([a-z0-9-]+)"/gi)) inHtml.add(m[1]);
  }
  const inCss = new Set();
  for (const f of cssFiles) {
    for (const m of readFileSync(f, 'utf8').matchAll(/\[data-section=['"]?([a-z0-9-]+)/gi)) {
      inCss.add(m[1]);
    }
  }

  if (inHtml.size < 2) {
    fail(`section contract: only ${inHtml.size} data-section values found — is this check stale?`);
  } else {
    const missing = [...inHtml].filter((s) => !inCss.has(s));
    if (missing.length) {
      for (const s of missing) {
        fail(
          `section '${s}' is used in the HTML but has no [data-section='${s}'] block in the CSS`,
        );
      }
    } else {
      ok(`css: all ${inHtml.size} sections have an accent block`);
    }
  }
}

// ---- 3. contrast ------------------------------------------------------------
{
  // Derived, not listed: every bare 6-digit hex token is checked, and the
  // color-mix() role tokens drop out on their own. A sixth family is covered
  // without anyone adding it here.
  const tokens = {};
  for (const f of cssFiles) {
    for (const m of readFileSync(f, 'utf8').matchAll(
      /(--[a-z0-9-]+)\s*:\s*(#[0-9a-f]{6})\s*[;}]/gi,
    )) {
      tokens[m[1].toLowerCase()] = m[2];
    }
  }

  const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const lum = (hex) => {
    const [r, g, b] = rgb(hex).map((c) =>
      c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
    );
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const ratio = (a, b) => {
    const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
    return (l1 + 0.05) / (l2 + 0.05);
  };

  const bg = tokens['--bg'];
  if (!bg) {
    fail('contrast: --bg is not defined');
  } else {
    // Surfaces are what things sit ON, and borders are not text.
    const skip = /^--(bg|border|sec)/;
    const checks = Object.keys(tokens)
      .filter((t) => t !== '--bg' && !skip.test(t))
      // 4.5:1 is the WCAG AA threshold for body text; 3:1 for large text and
      // for non-text elements such as an icon or a rule that carries meaning.
      .map((t) => [t, t.startsWith('--text') ? 4.5 : 3]);

    if (checks.length < 3) {
      fail(`contrast: only ${checks.length} colour tokens parsed — is this check stale?`);
    } else {
      let bad = 0;
      for (const [token, min] of checks) {
        const r = ratio(tokens[token], bg);
        if (r < min) {
          fail(`contrast: ${token} is ${r.toFixed(2)}:1 on --bg, needs ${min}:1`);
          bad += 1;
        }
      }
      if (!bad) ok(`a11y: ${checks.length} colour tokens all clear WCAG on --bg`);
    }
  }
}

// ---- 4. internal links and fragments resolve --------------------------------
{
  const idsOf = new Map();
  for (const p of pages) {
    const ids = new Set();
    for (const m of p.html.matchAll(/\sid="([^"]+)"/g)) ids.add(m[1]);
    for (const m of p.html.matchAll(/\sname="([^"]+)"/g)) ids.add(m[1]);
    idsOf.set(p.url, ids);
  }

  let links = 0;
  let frags = 0;
  let broken = 0;
  const bad = (msg) => {
    fail(msg);
    broken += 1;
  };
  for (const p of pages) {
    for (const m of p.html.matchAll(/\bhref="([^"]+)"/g)) {
      const raw = m[1];
      if (/^(https?:|mailto:|#|data:)/.test(raw)) {
        if (raw.startsWith('#')) {
          frags += 1;
          const id = decodeURIComponent(raw.slice(1));
          if (id && !idsOf.get(p.url)?.has(id)) bad(`${p.url}: fragment ${raw} has no target`);
        }
        continue;
      }
      if (!raw.startsWith('/')) continue;
      links += 1;

      // The base check. src/integrations/base-paths.ts should have prefixed
      // every internal URL during the build; one that slipped through points
      // at the domain root and 404s wherever the site actually lives.
      if (BASE && raw !== BASE && !raw.startsWith(`${BASE}/`)) {
        bad(
          `${p.url}: link ${raw} is missing the base ${BASE} — ` +
            'the base-paths integration did not reach it',
        );
        continue;
      }

      const [path, hash] = raw.split('#');
      const { file: target, expected, other } = resolve(decodeURIComponent(path));
      if (!target) {
        bad(`${p.url}: link ${raw} does not resolve — expected ${expected}${other}`);
        continue;
      }
      if (hash && target.endsWith('.html')) {
        frags += 1;
        const url = '/' + relative(DIST, target).split('\\').join('/');
        const ids = idsOf.get(url);
        if (ids && !ids.has(decodeURIComponent(hash))) {
          bad(`${p.url}: link ${raw} — #${hash} not found on ${url}`);
        }
      }
    }
  }
  // Subresources are not links, but they carry the same base problem, and an
  // <img> pointing at the domain root is a broken image rather than a broken
  // link -- quieter, and so easier to ship.
  let assets = 0;
  if (BASE) {
    for (const p of pages) {
      for (const m of p.html.matchAll(/\ssrc="(\/[^"]*)"/g)) {
        assets += 1;
        if (!m[1].startsWith(`${BASE}/`)) {
          bad(
            `${p.url}: src ${m[1]} is missing the base ${BASE} — ` +
              'the base-paths integration did not reach it',
          );
        }
      }
    }
  }

  // The summary only when nothing above failed: a ✓ under a column of ✗ is
  // what this line used to print, and a reader skimming for ticks saw it.
  if (links < 1) fail('links: no internal links found at all — is this check stale?');
  else if (broken === 0) {
    ok(
      `links: ${links} internal links and ${frags} fragments resolve` +
        (BASE ? `, ${assets} subresources carry the base ${BASE}/` : ''),
    );
  }
}

// ---- 4b. every URL a page publishes about itself names that page's file ----
{
  // Each must land on the very file it was read from, not merely on some
  // file: that catches a canonical built from Astro.url.pathname under a
  // policy where that is the file path ("…/cv.html" resolves to nothing).
  const SELF_URLS = [
    ['canonical', /<link rel="canonical" href="([^"]+)"/g],
    ['og:url', /<meta property="og:url" content="([^"]+)"/g],
    ['citation_abstract_html_url', /<meta name="citation_abstract_html_url" content="([^"]+)"/g],
  ];
  let checked = 0;
  let bad = 0;
  const claim = (p, what, url) => {
    checked += 1;
    const path = ownPath(url);
    if (path === undefined) {
      fail(`${p.url}: ${what} ${url} is not on ${SITE_ROOT}`);
      bad += 1;
      return;
    }
    const { file, expected } = resolvePath(path);
    if (file !== p.file) {
      fail(`${p.url}: ${what} ${url} names ${expected}, not this page's file`);
      bad += 1;
    }
  };
  for (const p of real) {
    for (const [what, re] of SELF_URLS) for (const m of p.html.matchAll(re)) claim(p, what, m[1]);
    for (const m of p.html.matchAll(
      /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
    )) {
      let data;
      try {
        data = JSON.parse(m[1]);
      } catch {
        fail(`${p.url}: JSON-LD block is not valid JSON`);
        bad += 1;
        continue;
      }
      // Only the article's own url; sourceOrganization.url is the site root.
      if (typeof data.url === 'string') claim(p, 'JSON-LD url', data.url);
    }
  }
  if (checked < real.length) {
    fail(`self-urls: only ${checked} found on ${real.length} pages — is this check stale?`);
  } else if (!bad) {
    ok(`urls: ${checked} canonical, og:url, Scholar and JSON-LD URLs each name their own file`);
  }
}

// ---- 4c. the web app manifest's URLs carry the base and name real files ----
{
  /*
   * `htmlFiles` never handed this file over and check 4 reads attributes, so
   * dist/site.webmanifest shipped "src": "/favicon-32.png" and all three of
   * its icons 404ed. Every root-absolute string in the parsed JSON counts as a
   * URL, not just the keys base-paths.ts knows, so a key it has not been
   * taught fails here rather than shipping.
   */
  const manifests = files.filter((f) => f.endsWith('.webmanifest'));
  const linked = new Set();
  for (const p of pages) {
    for (const m of p.html.matchAll(/<link\b[^>]*\brel="manifest"[^>]*\bhref="([^"]+)"/g)) {
      if (!/^https?:/.test(m[1])) linked.add(m[1]);
    }
  }

  // Only expected when you still have one: removing the manifest and its
  // <link> is a supported subtraction.
  if (manifests.length || linked.size) {
    let urls = 0;
    let bad = 0;

    // The manifest is whichever file the pages name, as with robots.txt and
    // the sitemap.
    for (const raw of linked) {
      const { file, expected, other } = resolve(decodeURIComponent(raw));
      if (!file) {
        fail(
          `manifest: <link rel="manifest"> ${raw} does not resolve — expected ${expected}${other}`,
        );
        bad += 1;
      }
    }

    for (const f of manifests) {
      const where = relative(DIST, f);
      let data;
      try {
        data = JSON.parse(readFileSync(f, 'utf8'));
      } catch {
        fail(`${where} is not valid JSON`);
        bad += 1;
        continue;
      }
      /** Every root-absolute string value, with the key path that holds it. */
      const found = [];
      const collect = (node, at) => {
        if (typeof node === 'string') {
          if (node.startsWith('/') && !node.startsWith('//')) found.push([at, node]);
        } else if (Array.isArray(node)) {
          node.forEach((item, i) => collect(item, `${at}[${i}]`));
        } else if (node && typeof node === 'object') {
          for (const [k, v] of Object.entries(node)) collect(v, at ? `${at}.${k}` : k);
        }
      };
      collect(data, '');

      for (const [at, url] of found) {
        urls += 1;
        if (BASE && url !== BASE && !url.startsWith(`${BASE}/`)) {
          fail(
            `${where}: ${at} ${url} is missing the base ${BASE} — ` +
              'the base-paths integration did not reach it',
          );
          bad += 1;
          continue;
        }
        const { file: target, expected, other } = resolve(decodeURIComponent(url));
        if (!target) {
          fail(`${where}: ${at} ${url} does not resolve — expected ${expected}${other}`);
          bad += 1;
        }
      }
    }

    // The floor: a manifest has icons, so no URLs at all means the JSON walk
    // has stopped walking.
    if (urls < 1)
      fail(
        `manifest: ${manifests.length} .webmanifest, no URLs in any of them — is this check stale?`,
      );
    else if (!bad) {
      ok(
        `manifest: ${urls} URLs across ${manifests.length} .webmanifest name a file on disk` +
          (BASE ? `, all carrying the base ${BASE}/` : ''),
      );
    }
  }
}

// ---- 5. per-page document basics -------------------------------------------
{
  let bad = 0;
  for (const p of real) {
    const h1 = (p.html.match(/<h1[\s>]/g) ?? []).length;
    if (h1 !== 1) {
      fail(`${p.url}: ${h1} <h1> elements, expected exactly 1`);
      bad += 1;
    }
    if (!/<title>[^<]+<\/title>/.test(p.html)) {
      fail(`${p.url}: no <title>`);
      bad += 1;
    }
    if (!/<meta name="description" content="[^"]+"/.test(p.html)) {
      fail(`${p.url}: no meta description`);
      bad += 1;
    }
    // Exactly one of a canonical and noindex. The 404 page is the noindex
    // case: served for every URL that does not exist, it has no address a
    // canonical could truthfully name.
    const canonical = /<link rel="canonical"/.test(p.html);
    const noindex = /<meta name="robots" content="noindex"/.test(p.html);
    if (canonical === noindex) {
      fail(
        `${p.url}: ${canonical ? 'both a canonical link and noindex' : 'neither a canonical link nor noindex'}`,
      );
      bad += 1;
    }
  }
  if (!bad) {
    ok(
      `html: ${real.length} pages each have one h1, a title, a description and a canonical (or noindex)`,
    );
  }
}

// ---- 6. images carry intrinsic dimensions -----------------------------------
{
  // Images from src/assets/ get them from Astro, the configured brand mark from
  // intrinsic() in src/lib/images.ts, an <img> written by hand in markdown from
  // you.
  let imgs = 0;
  let bad = 0;
  for (const p of pages) {
    for (const m of p.html.matchAll(/<img\b[^>]*>/g)) {
      imgs += 1;
      if (!/\bwidth=/.test(m[0]) || !/\bheight=/.test(m[0])) {
        fail(`${p.url}: <img> without width/height — ${m[0].slice(0, 90).replace(/\s+/g, ' ')}`);
        bad += 1;
      }
    }
  }
  if (!bad) ok(`html: all ${imgs} images have intrinsic dimensions`);
}

// ---- 6b. text does not run into a link ---------------------------------------
{
  /*
   * Astro strips the newline between a trailing word and a following <a>, so
   *
   *     written at the
   *     <a href="...">institute</a>, <a href="...">somewhere</a>
   *
   * renders as "written at theinstitute, somewhere". It reads fine in the
   * source, so check the rendered bytes: a word character or punctuation
   * immediately against a link boundary, with no space.
   *
   * Chips, badges and icon links are spaced by CSS rather than a text node
   * and are exempt by class; `orcid` because an ORCID icon flush after an
   * author's name is the standard pattern.
   */
  const STYLED = /class="[^"]*\b(?:chip|venue|who|title-link|brand|orcid|icon)\b/;
  const OPEN = /([A-Za-z0-9,.;:])(<a\s[^>]*>)/g;
  const CLOSE = /<\/a>([A-Za-z0-9])/g;

  let joins = 0;
  for (const p of real) {
    const body = p.html.replace(/<(pre|code|script|style)[\s\S]*?<\/\1>/g, '');

    OPEN.lastIndex = 0;
    let m;
    while ((m = OPEN.exec(body)) !== null) {
      if (STYLED.test(m[2])) continue;
      const near = body.slice(Math.max(0, m.index - 45), m.index + 45).replace(/\s+/g, ' ');
      fail(`${p.url}: text runs into the start of a link — …${near}…`);
      joins += 1;
    }

    CLOSE.lastIndex = 0;
    while ((m = CLOSE.exec(body)) !== null) {
      // Find the opening tag of the link that just closed.
      const open = body.lastIndexOf('<a ', m.index);
      if (open !== -1 && STYLED.test(body.slice(open, body.indexOf('>', open) + 1))) continue;
      const near = body.slice(Math.max(0, m.index - 45), m.index + 45).replace(/\s+/g, ' ');
      fail(`${p.url}: text runs on from the end of a link — …${near}…`);
      joins += 1;
    }
  }
  if (!joins) ok(`html: no text runs into a link on ${real.length} pages`);
}

// ---- 7. third-party subresources are only the ones you chose ----------------
{
  // Only *subresources* count — what a browser fetches without being asked,
  // which is also what sees your readers' IP addresses. Links never do.
  const SUBRESOURCE = /<(?:img|script|iframe|source|video|audio)\b[^>]*\bsrc="https?:\/\/([^"/]+)/g;
  /*
   * <link> is separate, because most of them fetch nothing. rel="canonical"
   * and rel="alternate" are metadata and routinely point at another origin on
   * purpose; only these rel values cause a request.
   */
  const FETCHING_LINK =
    /<link\b[^>]*\brel="(?:stylesheet|preload|prefetch|preconnect|icon|apple-touch-icon|manifest|modulepreload)"[^>]*\bhref="https?:\/\/([^"/]+)/g;

  const found = new Map();
  for (const p of pages) {
    /*
     * Blank the BODY of an inline script, but keep its opening tag. Stripping
     * whole <script> elements — the obvious way to write this — also removes
     * every <script src="https://…">, which is the single highest-risk
     * subresource there is. The bodies still have to go, because a URL in a
     * string literal is not a subresource.
     */
    const stripped = p.html.replace(/(<script\b[^>]*>)[\s\S]*?<\/script>/g, '$1</script>');
    for (const re of [SUBRESOURCE, FETCHING_LINK]) {
      for (const m of stripped.matchAll(re)) {
        const host = m[1];
        if (host === OWN_HOST || ALLOWED.has(host)) continue;
        if (!found.has(host)) found.set(host, p.url);
      }
    }
  }
  if (found.size) for (const [h, u] of found) fail(`third-party subresource origin ${h} on ${u}`);
  else
    ok(
      `privacy: no third-party subresources${ALLOWED.size ? ` beyond ${[...ALLOWED].join(', ')}` : ''}`,
    );
}

// ---- 8. no email address is in the served bytes -----------------------------
{
  // Email.astro never lets an address into the bytes; this catches the plain
  // mailto: somebody writes into a page, which looks normal in review.
  const ADDRESS = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.[A-Za-z]{2,}\b/g;

  // Scanned twice, raw and with entities decoded: `&#64;` is an @ to a
  // scraper, and a raw-bytes check alone would declare it safe.
  const decode = (text) =>
    text
      .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
      .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
      .replace(/&(?:commat|at);/gi, '@')
      .replace(/&period;/gi, '.')
      .replace(/&amp;/gi, '&');

  const found = new Map();
  for (const f of [...htmlFiles, ...files.filter((x) => x.endsWith('.xml'))]) {
    const raw = readFileSync(f, 'utf8');
    for (const text of [raw, decode(raw)]) {
      for (const m of text.matchAll(ADDRESS)) {
        if (!found.has(m[0])) found.set(m[0], relative(DIST, f));
      }
    }
  }
  if (found.size) for (const [a, w] of found) fail(`email address ${a} in the served bytes (${w})`);
  else ok('privacy: no email address appears in the built output');
}

// ---- 9. robots.txt names a sitemap that exists; it and the feed are sound --
{
  // All three are generated and consumed by machines that will not tell you
  // they stopped working; a feed reader's click is never checked by a human.
  const readXml = (name) => {
    const f = join(DIST, name);
    if (!existsSync(f)) {
      fail(`${name} was not generated`);
      return undefined;
    }
    const xml = readFileSync(f, 'utf8');
    if (!xml.trimStart().startsWith('<?xml')) {
      fail(`${name} does not start with an XML declaration`);
      return undefined;
    }
    return xml;
  };
  const count = (xml, tag) => (xml.match(new RegExp(`<${tag}[\\s>]`, 'g')) ?? []).length;
  /** Every URL in the given element, resolved; returns how many were wrong. */
  const resolveAll = (name, xml, re) => {
    let bad = 0;
    let n = 0;
    for (const m of xml.matchAll(re)) {
      n += 1;
      const path = ownPath(m[1]);
      if (path === undefined) {
        fail(`${name}: ${m[1]} is not on ${SITE_ROOT}`);
        bad += 1;
        continue;
      }
      const { file, expected, other } = resolvePath(decodeURIComponent(path));
      if (!file) {
        fail(`${name}: ${m[1]} does not resolve — expected ${expected}${other}`);
        bad += 1;
      }
    }
    return { bad, n };
  };

  // THE SITEMAP IS WHICHEVER FILE robots.txt NAMES, not a probe for the
  // integration's filename: a crawler learns the address from robots.txt and
  // nowhere else, so that link is the thing to assert.
  const robotsFile = join(DIST, 'robots.txt');
  if (!existsSync(robotsFile)) {
    fail('robots.txt was not generated');
  } else {
    const named = [...readFileSync(robotsFile, 'utf8').matchAll(/^\s*Sitemap:\s*(\S+)/gim)].map(
      (m) => m[1],
    );
    if (named.length === 0) fail('robots.txt names no sitemap');
    for (const url of named) {
      const path = ownPath(url);
      const rel = path?.replace(/^\//, '');
      if (rel === undefined || !isFile(join(DIST, rel))) {
        fail(`robots.txt points at ${url}, which is not a file in dist/`);
        continue;
      }
      const xml = readXml(rel);
      if (!xml) continue;
      // An index lists other sitemaps, each of which must exist and list
      // pages; a plain sitemap lists pages itself.
      const children = /<sitemapindex[\s>]/.test(xml)
        ? [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
        : [];
      if (children.length === 0 && /<sitemapindex[\s>]/.test(xml)) {
        fail(`${rel} is a sitemap index with no <sitemap> entries`);
        continue;
      }
      const leaves = children.length ? children : [url];
      let urls = 0;
      let bad = 0;
      for (const leaf of leaves) {
        const leafRel = ownPath(leaf)?.replace(/^\//, '');
        if (leafRel === undefined || !isFile(join(DIST, leafRel))) {
          fail(`${rel} points at ${leaf}, which is not a file in dist/`);
          bad += 1;
          continue;
        }
        const leafXml = leafRel === rel ? xml : readXml(leafRel);
        if (!leafXml) continue;
        const r = resolveAll(leafRel, leafXml, /<loc>([^<]+)<\/loc>/g);
        urls += r.n;
        bad += r.bad;
      }
      // The floor: at least one entry per page that carries a canonical (the
      // 404 page has none and is rightly absent). Fewer means a route the
      // integration did not see, or a filter that ate one.
      const indexable = real.filter((p) => /<link rel="canonical"/.test(p.html)).length;
      if (urls === 0) fail(`${rel} lists no pages`);
      else if (urls < indexable) {
        fail(`${rel} lists ${urls} URLs for ${indexable} indexable pages — is a route missing?`);
      } else if (!bad) {
        ok(
          `sitemap: robots.txt → ${rel}` +
            (children.length ? ` → ${leaves.length} file(s)` : '') +
            `, ${urls} URLs, every one names a file on disk`,
        );
      }
    }
  }

  /* Only expected when the feed is ON: the endpoint is on disk either way, so
     its presence says nothing. A feed that should exist and does not still
     fails. */
  if (featureOn('feed')) {
    const xml = readXml('feed.xml');
    if (xml) {
      const items = count(xml, 'item');
      if (items === 0) fail('feed.xml contains no <item> entries');
      else {
        const r = resolveAll('feed.xml', xml, /<link>([^<]+)<\/link>/g);
        if (!r.bad) ok(`feed.xml: ${items} <item> entries, ${r.n} links each name a file on disk`);
      }
    }
  }
}

// ---- 10. the files that make the host serve the site correctly --------------
{
  // GitHub Pages runs Jekyll over the output unless this exists, and Jekyll
  // ignores directories beginning with an underscore — which is where Astro
  // puts every hashed asset. The failure is a live site with no CSS.
  if (existsSync(join(DIST, '.nojekyll'))) ok('dist/.nojekyll present');
  else fail('dist/.nojekyll is missing — GitHub Pages would skip /_astro/');

  // Only checked when you have one. The deploy replaces the gh-pages branch
  // wholesale, so a CNAME that stops being emitted is a domain that stops
  // resolving, and nothing in the build would otherwise notice.
  if (existsSync(join(ROOT, 'public/CNAME'))) {
    if (existsSync(join(DIST, 'CNAME'))) ok('dist/CNAME present');
    else fail('public/CNAME exists but dist/CNAME does not');
  }
}

// ---- 11. weight --------------------------------------------------------------
{
  const sum = (list) => list.reduce((n, f) => n + statSync(f).size, 0);
  const kb = (n) => `${(n / 1024).toFixed(1)} KB`;

  // Astro inlines scripts this small, so counting .js files alone reports zero
  // while the pages do ship behaviour. Measure the inline bytes instead, and
  // report the heaviest page rather than a total nobody downloads.
  let heaviest = { url: '-', bytes: 0 };
  for (const p of pages) {
    let bytes = 0;
    for (const m of p.html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)) {
      if (/application\/ld\+json/.test(m[0])) continue;
      bytes += Buffer.byteLength(m[1]);
    }
    if (bytes > heaviest.bytes) heaviest = { url: p.url, bytes };
  }

  console.log(
    `  bundle: ${kb(sum(cssFiles))} CSS across ${cssFiles.length} file(s), ` +
      `${kb(sum(jsFiles))} external JS; most inline JS on one page: ` +
      `${kb(heaviest.bytes)} (${heaviest.url})`,
  );
}

process.exit(failed > 0 ? 1 : 0);
