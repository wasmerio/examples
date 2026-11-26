import type { AstroIntegration } from 'astro';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Prefix every site-absolute URL in the served output with the configured
 * base. Astro's `base` does not touch a `/cv/` you wrote by hand, and a
 * withBase() helper cannot reach a path in YAML, front matter or markdown, so
 * this rewrites the bytes: href, src, srcset and URL `content` attributes,
 * with <script>/<style> bodies masked, plus the URL values of a web app
 * manifest, which has no attributes to offer. Once after the build, and again
 * on the way out of the dev server. A client-side script that builds a path at
 * runtime (src/pages/blog/index.astro) must read import.meta.env.BASE_URL
 * itself. docs/Architecture.md.
 */
export default function basePaths(): AstroIntegration {
  // Captured from the resolved config rather than read from
  // import.meta.env.BASE_URL: an integration runs in the config context, where
  // that is not populated, and reading it there silently yields '/' — which
  // looks exactly like "no base set" and turns this whole file into a no-op.
  let base = '';

  return {
    name: 'astro-studia:base-paths',
    hooks: {
      'astro:config:done': ({ config }) => {
        base = config.base.replace(/\/$/, '');
      },

      'astro:build:done': async ({ dir, logger }) => {
        if (!base) {
          logger.info('no base configured; nothing to rewrite');
          return;
        }

        const root = fileURLToPath(dir);
        let files = 0;
        let urls = 0;

        for (const file of walk(root)) {
          if (!/\.(html|xml|webmanifest)$/.test(file)) continue;
          const source = readFileSync(file, 'utf8');
          const { text, count } = file.endsWith('.webmanifest')
            ? rewriteManifest(source, base)
            : rewrite(source, base);
          if (count === 0) continue;
          writeFileSync(file, text);
          files += 1;
          urls += count;
        }

        logger.info(`prefixed ${urls} URL(s) with ${base} across ${files} file(s)`);
      },

      // `astro dev` never reaches the build hook, so nothing prefixed a
      // hand-written URL: the landing URL 404ed, and so did everything in public/.
      'astro:server:setup': ({ server, logger }) => {
        if (!base) return;

        // At the FRONT of the stack, not server.middlewares.use(): appended,
        // it runs after Astro has already finished the response.
        const install = () => {
          server.middlewares.stack.unshift({ route: '', handle: devRewrite(base) });
        };
        // Deferred, because Astro unshifts its own base middleware from a
        // later hook — unshifting now would still land behind it.
        if (server.httpServer) server.httpServer.once('listening', install);
        else install();

        logger.info(`dev: serving under ${base}/, rewriting URLs in HTML and the manifest`);
      },
    },
  };
}

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

/** Attributes whose value is always a single URL wherever they appear. */
const URL_ATTR = /\s(href|src)="(\/[^"]*)"/g;
/** srcset is a comma-separated list of "url descriptor" pairs. */
const SRCSET_ATTR = /\ssrcset="([^"]*)"/g;
/** Regions whose contents are not markup and must not be touched. */
const MASKED = /<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi;
/**
 * `content` is a URL on a couple of meta tags and prose on every other, so it
 * is matched against the WHOLE tag: an attribute match never contains the
 * sibling `property=`, and testing that silently skipped og:image.
 */
const URL_META = /<meta\b[^>]*\bcontent="(\/[^"]*)"[^>]*>/g;
const IS_URL_META = /property="og:(url|image)"|name="twitter:image"/;

const MASK_OPEN = '\u{1F512}MASK';
const MASK_CLOSE = 'MASK\u{1F512}';

const needsBase = (url: string, base: string) =>
  url.startsWith('/') && !url.startsWith('//') && url !== base && !url.startsWith(`${base}/`);

/**
 * Exported so the rewrite can be exercised on its own, without a build.
 * `skip` exempts URLs that are not the site's to prefix; only dev passes one.
 */
export function rewrite(
  text: string,
  base: string,
  skip?: RegExp,
): { text: string; count: number } {
  let count = 0;
  const needs = (url: string) => needsBase(url, base) && !skip?.test(url);

  const masked: string[] = [];
  const body = text.replace(MASKED, (m) => {
    masked.push(m);
    return `${MASK_OPEN}${masked.length - 1}${MASK_CLOSE}`;
  });

  let out = body.replace(URL_ATTR, (whole, attr: string, url: string) => {
    if (!needs(url)) return whole;
    count += 1;
    return ` ${attr}="${base}${url}"`;
  });

  out = out.replace(URL_META, (tag: string, url: string) => {
    if (!IS_URL_META.test(tag) || !needs(url)) return tag;
    count += 1;
    return tag.replace(`content="${url}"`, `content="${base}${url}"`);
  });

  out = out.replace(SRCSET_ATTR, (_whole, value: string) => {
    const parts = value.split(',').map((part) => {
      const trimmed = part.trim();
      const [url, ...rest] = trimmed.split(/\s+/);
      if (!needs(url)) return trimmed;
      count += 1;
      return [`${base}${url}`, ...rest].join(' ');
    });
    return ` srcset="${parts.join(', ')}"`;
  });

  out = out.replace(
    new RegExp(`${MASK_OPEN}(\\d+)${MASK_CLOSE}`, 'gu'),
    (_, i: string) => masked[Number(i)],
  );

  return { text: out, count };
}

/** The manifest keys whose value is a URL, at whatever depth they occur. */
const MANIFEST_URL_KEYS = new Set(['src', 'url', 'start_url', 'scope']);

/**
 * The manifest's URLs are JSON values, which the attribute rewrite above
 * cannot see: dist/site.webmanifest shipped "src": "/favicon-32.png" and all
 * three of its icons 404ed.
 */
export function rewriteManifest(text: string, base: string): { text: string; count: number } {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    // Left alone; the audit reports it as invalid JSON.
    return { text, count: 0 };
  }

  let count = 0;
  const visit = (node: unknown, key: string): unknown => {
    if (typeof node === 'string') {
      if (!MANIFEST_URL_KEYS.has(key) || !needsBase(node, base)) return node;
      count += 1;
      return `${base}${node}`;
    }
    // An array inherits its key: icons[] holds no `src`, its objects do.
    if (Array.isArray(node)) return node.map((item) => visit(item, key));
    if (node && typeof node === 'object') {
      return Object.fromEntries(Object.entries(node).map(([k, v]) => [k, visit(v, k)]));
    }
    return node;
  };

  const out = visit(data, '');
  return { text: count ? `${JSON.stringify(out, null, 2)}\n` : text, count };
}

/**
 * Vite's dev URLs live at the server root, not under the base:
 * /astro-studia/@vite/client is a 404, and prefixing it kills HMR.
 */
const DEV_OWNED = /^\/(?:@|node_modules\/|src\/|\.astro\/)/;

const HTML_TYPE = /^text\/html\b/i;
const MANIFEST_TYPE = /^application\/manifest\+json\b/i;

type Middleware = (
  req: IncomingMessage,
  res: ServerResponse,
  next: (err?: unknown) => void,
) => void;

/**
 * The build rewrite, applied to a dev response by buffering it and rewriting
 * on end. Anything that is not markup goes out byte for byte.
 */
function devRewrite(base: string): Middleware {
  return (req, res, next) => {
    // An HMR websocket has no body to buffer.
    if (req.headers.upgrade) return next();

    const [path = '/', query] = (req.url ?? '/').split('?');

    // The root: what a forwarded port opens (Codespaces, any tunnel), and
    // what Astro's dev router answers with a 404.
    if (path === '/') {
      res.writeHead(302, { Location: `${base}/${query ? `?${query}` : ''}` });
      res.end();
      return;
    }

    const { writeHead, write, end } = res;
    const chunks: Buffer[] = [];
    let kind: 'html' | 'manifest' | 'pass' | undefined;

    const restore = () => {
      res.writeHead = writeHead;
      res.write = write;
      res.end = end;
    };

    const collect = (chunk: unknown, encoding?: unknown) => {
      if (chunk === null || chunk === undefined) return;
      if (chunk instanceof Uint8Array) chunks.push(Buffer.from(chunk));
      else if (typeof chunk === 'string') {
        const enc = typeof encoding === 'string' ? (encoding as BufferEncoding) : 'utf8';
        chunks.push(Buffer.from(chunk, enc));
      }
    };

    // From the content-type, not the URL: a page route emits HTML from a path
    // with no extension and /_image returns an image from one.
    const classify = (headers?: unknown): 'html' | 'manifest' | 'pass' => {
      if (kind) return kind;
      const type = String(
        headerValue(headers, 'content-type') ?? res.getHeader('content-type') ?? '',
      );
      kind = HTML_TYPE.test(type)
        ? 'html'
        : MANIFEST_TYPE.test(type) || path.endsWith('.webmanifest')
          ? 'manifest'
          : 'pass';
      if (kind === 'pass') restore();
      return kind;
    };

    res.writeHead = function (statusCode: number, ...rest: unknown[]) {
      const headers = rest.find((arg) => arg !== null && typeof arg === 'object');
      if (classify(headers) === 'pass') return res.writeHead(statusCode, ...(rest as []));
      // Replayed through setHeader, minus Content-Length: the length Vite set
      // is short of the rewritten body, which then arrives truncated mid-tag.
      res.statusCode = statusCode;
      if (typeof rest[0] === 'string') res.statusMessage = rest[0];
      for (const [name, value] of headerPairs(headers)) {
        if (name.toLowerCase() === 'content-length' || value === undefined) continue;
        res.setHeader(name, value as string);
      }
      return res;
    } as typeof res.writeHead;

    res.write = function (chunk: unknown, ...rest: unknown[]) {
      if (classify() === 'pass') return res.write(chunk as never, ...(rest as []));
      collect(chunk, rest[0]);
      const done = rest.find((arg) => typeof arg === 'function') as (() => void) | undefined;
      done?.();
      return true;
    } as typeof res.write;

    res.end = function (chunk?: unknown, ...rest: unknown[]) {
      if (classify() === 'pass') return res.end(chunk as never, ...(rest as []));
      if (typeof chunk !== 'function') collect(chunk, rest[0]);
      const done = [chunk, ...rest].find((arg) => typeof arg === 'function') as
        (() => void) | undefined;

      const body = Buffer.concat(chunks).toString('utf8');
      const { text } =
        kind === 'manifest' ? rewriteManifest(body, base) : rewrite(body, base, DEV_OWNED);
      const out = Buffer.from(text, 'utf8');
      // Restored first: Node writes the status line through res.writeHead(),
      // so leaving the patch in place sends a bare HTTP/0.9 body.
      restore();
      if (out.length && !res.headersSent) res.setHeader('Content-Length', String(out.length));
      return res.end(out, done as never);
    } as typeof res.end;

    next();
  };
}

/** writeHead takes its headers as an object, as [k, v] pairs, or flat. */
function headerPairs(headers: unknown): [string, unknown][] {
  if (!headers || typeof headers !== 'object') return [];
  if (!Array.isArray(headers)) return Object.entries(headers);
  if (Array.isArray(headers[0])) return headers as [string, unknown][];
  const pairs: [string, unknown][] = [];
  for (let i = 0; i < headers.length; i += 2) pairs.push([String(headers[i]), headers[i + 1]]);
  return pairs;
}

const headerValue = (headers: unknown, name: string): unknown =>
  headerPairs(headers).find(([key]) => key.toLowerCase() === name)?.[1];
