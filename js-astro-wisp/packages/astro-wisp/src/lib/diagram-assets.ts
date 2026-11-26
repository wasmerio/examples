/**
 * 图表源文件下载（diagrams.md §5.3）：
 * - diagramDevMiddleware()：dev 中把 `/diagrams/<post-id>/<file>` 映射到源文件；
 * - copyDiagramSources(outDir)：build 结束时把源文件复制到 `dist/diagrams/<post-id>/`。
 *
 * 复制范围：扫描 src/content/**\/diagrams/*.{excalidraw,drawio} 全部源文件（与 `pnpm diagram check` 同一扫描规则），
 * 跳过 draft 文章目录下的文件。不依赖 remark 运行时收集：Astro 的内容层会缓存渲染结果，
 * 增量构建时 remark 插件可能根本不运行，收集结果不可靠。
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  contentTypeFor,
  downloadKeyFor,
  POSTS_DIR,
  REPO_ROOT,
  scanSources,
  sourceForDownloadKey,
} from './render-diagram';

export interface DiagramAssetOptions {
  /** 仓库根（测试用） */
  root?: string;
  /** Astro base，默认 `/` */
  base?: string;
}

/** RFC 6266：ASCII 回退 + UTF-8 文件名。 */
export function contentDisposition(file: string): string {
  const ascii = file.replace(/[^\x20-\x7e]/g, '_').replace(/["\\]/g, '_');
  return `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(file)}`;
}

/** 从请求路径中取出 `/diagrams/` 之后的 key；不匹配时返回 undefined。 */
export function downloadKeyFromUrl(url: string, base = '/'): string | undefined {
  const pathname = url.split(/[?#]/)[0]!;
  const prefix = `${base.replace(/\/+$/, '')}/diagrams/`;
  if (!pathname.startsWith(prefix)) return undefined;
  try {
    return decodeURIComponent(pathname.slice(prefix.length));
  } catch {
    return undefined;
  }
}

type Next = (err?: unknown) => void;

/** Vite（connect）中间件：在 `astro:server:setup` 中 `server.middlewares.use(diagramDevMiddleware())`。 */
export function diagramDevMiddleware(opts: DiagramAssetOptions = {}) {
  const root = opts.root ?? REPO_ROOT;
  const base = opts.base ?? '/';
  return function wispDiagramSources(req: IncomingMessage, res: ServerResponse, next: Next): void {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();
    const key = downloadKeyFromUrl(req.url ?? '', base);
    if (key === undefined) return next();
    const file = sourceForDownloadKey(key, root);
    if (!file || !existsSync(file) || !statSync(file).isFile()) return next();
    const body = readFileSync(file);
    res.statusCode = 200;
    res.setHeader('Content-Type', contentTypeFor(file));
    res.setHeader('Content-Length', body.length);
    res.setHeader('Content-Disposition', contentDisposition(basename(file)));
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.end(req.method === 'HEAD' ? undefined : body);
  };
}

/** 文章目录 posts/<dir>/ 的 index.{md,mdx} 是否标记了 draft: true。 */
function isDraftDir(root: string, postDir: string): boolean {
  for (const name of ['index.mdx', 'index.md']) {
    const p = join(root, POSTS_DIR, postDir, name);
    if (!existsSync(p)) continue;
    const fm = /^---\r?\n([\s\S]*?)\r?\n---/.exec(readFileSync(p, 'utf8'))?.[1] ?? '';
    return /^draft:\s*true\s*$/m.test(fm);
  }
  return false;
}

export interface CopiedSource {
  from: string;
  to: string;
  key: string;
}

/**
 * 在 `astro:build:done` 中调用：复制源文件到 `<outDir>/diagrams/<key>`。
 * outDir 可以是 URL（钩子参数 `dir`）或路径。返回复制清单。
 */
export function copyDiagramSources(
  outDir: URL | string,
  opts: DiagramAssetOptions = {},
): CopiedSource[] {
  const root = opts.root ?? REPO_ROOT;
  const out = typeof outDir === 'string' ? outDir : fileURLToPath(outDir);
  const copied: CopiedSource[] = [];
  for (const rel of scanSources(root)) {
    const abs = join(root, rel);
    const key = downloadKeyFor(abs, root);
    if (!key) continue;
    const m = new RegExp(`^${POSTS_DIR}/(.+)/diagrams/[^/]+$`).exec(rel);
    if (m && isDraftDir(root, m[1]!)) continue;
    const to = join(out, 'diagrams', ...key.split('/'));
    mkdirSync(dirname(to), { recursive: true });
    copyFileSync(abs, to);
    copied.push({ from: abs, to, key });
  }
  return copied;
}
