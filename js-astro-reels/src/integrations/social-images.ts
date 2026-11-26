import type { AstroConfig, AstroIntegration, IntegrationResolvedRoute } from 'astro';
import { lstat, mkdir, readFile, realpath, writeFile } from 'node:fs/promises';
import { sep } from 'node:path';
import { getGeneratedImageUrl, validateSiteOrigin } from '../lib/seo.ts';
import type { SocialRenderInput, SocialRenderer } from '../lib/social-renderer.ts';
import { parseDocument, removeMarkerSpans } from './documents.ts';

export interface SocialJob extends SocialRenderInput { file: URL; imageUrl: string }
export interface SocialRunOptions { dir: URL; site: URL; base: string; jobs: readonly SocialJob[] }
export interface SocialRunResult { rendered: number; rendererLoads: number }

async function stat(file: URL) {
  try { return await lstat(file); } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return undefined;
    throw error;
  }
}
async function pageIO<T>(pageUrl: string, phase: string, action: () => Promise<T>): Promise<T> {
  try { return await action(); } catch (cause) { throw new Error(`${pageUrl}: title card ${phase} failed.`, { cause }); }
}

export async function verifyWrittenPng(file: URL, pageUrl: string): Promise<void> {
  await pageIO(pageUrl, 'saved PNG verification', async () => {
    const bytes = await readFile(file);
    const { default: sharp } = await import('sharp');
    if ((await sharp(bytes).metadata()).format !== 'png') throw new Error('Expected PNG format.');
    const { info } = await sharp(bytes).raw().toBuffer({ resolveWithObject: true });
    if (info.width !== 1200 || info.height !== 630) throw new Error('Expected a decoded 1200x630 PNG.');
  });
}

export async function runSocialJobs(options: SocialRunOptions, loadRenderer: () => Promise<SocialRenderer>): Promise<SocialRunResult> {
  if (options.jobs.length === 0) return { rendered: 0, rendererLoads: 0 };
  const { dir, site, base, jobs } = options;
  const directory = new URL('_social/', dir);
  const existing = await stat(new URL('_social', dir));
  if (existing && (!existing.isDirectory() || existing.isSymbolicLink())) throw new Error('Reserved _social directory is occupied.');
  const realRoot = `${await realpath(dir)}${sep}`;
  const files = new Set<string>(), images = new Set<string>();
  for (const job of jobs) {
    const page = new URL(job.pageUrl);
    const expected = await getGeneratedImageUrl(page.pathname, site, base);
    const actualFile = await realpath(job.file);
    if (page.origin !== site.origin || page.search || page.hash || !job.file.href.startsWith(dir.href)
      || !actualFile.startsWith(realRoot) || !job.file.pathname.endsWith('.html')
      || job.imageUrl !== expected || files.has(job.file.href) || images.has(job.imageUrl)) {
      throw new Error(`${job.pageUrl}: invalid or duplicate title card destination.`);
    }
    files.add(job.file.href); images.add(job.imageUrl);
  }
  const renderer = await pageIO(jobs[0]!.pageUrl, 'font/renderer initialization; use a manual image or image=false', loadRenderer);
  await mkdir(directory, { recursive: true });
  let next = 0, rendered = 0;
  let failed = false, firstError: unknown;
  async function worker() {
    while (!failed && next < jobs.length) {
      const job = jobs[next++]!;
      try {
        const html = await pageIO(job.pageUrl, 'HTML read', () => readFile(job.file, 'utf8'));
        const parsed = parseDocument(html);
        if (!parsed.socialMarkerSpan || parsed.generatedImageUrl !== job.imageUrl
          || parsed.title !== job.title || parsed.description !== job.description) {
          throw new Error(`${job.pageUrl}: title card marker or metadata disagrees with the job.`);
        }
        const bytes = await renderer.render(job);
        const image = new URL(new URL(job.imageUrl).pathname.split('/').at(-1)!, directory);
        await pageIO(job.pageUrl, 'PNG write', () => writeFile(image, bytes, { flag: 'wx' }));
        await verifyWrittenPng(image, job.pageUrl);
        await pageIO(job.pageUrl, 'marker cleanup', () => writeFile(job.file, removeMarkerSpans(html, [parsed.socialMarkerSpan!])));
        rendered++;
      } catch (error) {
        if (!failed) { failed = true; firstError = error; }
      }
    }
  }
  // The bound includes verification and HTML cleanup, not just rasterization.
  await Promise.all(Array.from({ length: Math.min(2, jobs.length) }, () => worker()));
  if (failed) throw firstError;
  return { rendered, rendererLoads: 1 };
}

export function socialImages(): AstroIntegration {
  let config: AstroConfig;
  let routes: IntegrationResolvedRoute[] = [];
  return {
    name: 'starter:social-images',
    hooks: {
      'astro:config:done': ({ config: resolved }) => { config = resolved; },
      'astro:routes:resolved': ({ routes: resolved }) => { routes = resolved; },
      'astro:build:done': async ({ assets, pages, dir }) => {
        const origin = validateSiteOrigin(config.site, true)!;
        const base = config.base.endsWith('/') ? config.base : `${config.base}/`;
        const namespace = `${base}_social/`;
        const conflict = (where: string) => new Error(`Reserved title card namespace ${namespace} is occupied: ${where}. Move consumer assets/routes/manual images or remove the social-images integration.`);
        if (await stat(new URL('_social', config.publicDir)) || await stat(new URL('_social', dir))) throw conflict('_social');
        if (routes.some(route => route.pathname && (`${route.pathname.replace(/\/$/, '')}/`).startsWith('/_social/'))) throw conflict('route');
        const routesByPattern = new Map(routes.map(route => [route.pattern, route]));
        const matches = new Map<string, string[]>();
        for (const page of pages) {
          const path = page.pathname.replace(/^\/|\/$/g, '');
          const candidates = new Set([path ? `${path}/index.html` : 'index.html', path ? `${path}.html` : 'index.html']);
          for (const candidate of candidates) {
            const href = new URL(encodeURI(candidate), dir).href;
            const found = matches.get(href) ?? [];
            found.push(path); matches.set(href, found);
          }
        }
        const { siteConfig } = await import('../config.ts');
        const jobs: SocialJob[] = [];
        const files = new Set<string>(), identities = new Set<string>();
        for (const [pattern, outputs] of assets) {
          if (routesByPattern.get(pattern)?.type !== 'page') continue;
          for (const file of outputs) {
            if (!file.href.startsWith(dir.href) || !file.pathname.endsWith('.html')) continue;
            const relative = file.href.slice(dir.href.length);
            if (await stat(new URL(relative, config.publicDir))) continue;
            if (files.has(file.href)) throw new Error(`Duplicate title card output: ${file.href}.`);
            files.add(file.href);
            const candidates = matches.get(file.href);
            if (candidates?.length !== 1) throw new Error(`Ambiguous emitted title card output: ${file.href}. Use distinct route filenames.`);
            const path = candidates[0]!;
            const directory = config.build.format === 'directory'
              || (config.build.format === 'preserve' && (relative === 'index.html' || relative.endsWith('/index.html')));
            const pathname = directory
              ? path ? `${base}${path}${config.trailingSlash === 'never' ? '' : '/'}`
                : config.trailingSlash === 'never' ? base.replace(/\/$/, '') || '/' : base
              : `${base}${path || 'index'}.html`;
            const page = new URL(origin); page.pathname = pathname;
            if (identities.has(page.href)) throw new Error(`Duplicate title card page: ${page.href}.`);
            identities.add(page.href);
            if (page.pathname.startsWith(namespace) || page.pathname === namespace.slice(0, -1)) throw conflict(page.href);
            const parsed = parseDocument(await readFile(file, 'utf8'));
            if (parsed.imageUrl && !parsed.generatedImageUrl) {
              const manual = new URL(parsed.imageUrl, page);
              if (manual.origin === origin.origin && (manual.pathname.startsWith(namespace) || manual.pathname === namespace.slice(0, -1))) throw conflict(parsed.imageUrl);
            }
            if (!parsed.generatedImageUrl) continue;
            if (!siteConfig.socialImages || pattern === '/404' || pattern === '/500' || parsed.redirect) {
              throw new Error(`${page.href}: unexpected automatic title card marker. Use image=false for excluded pages.`);
            }
            if (!parsed.title?.trim() || !parsed.description?.trim()
              || parsed.generatedImageUrl !== await getGeneratedImageUrl(page.pathname, origin, base)) {
              throw new Error(`${page.href}: invalid automatic title card metadata or request identity.`);
            }
            const job: SocialJob = { file, pageUrl: page.href, title: parsed.title, description: parsed.description, lang: parsed.lang, imageUrl: parsed.generatedImageUrl };
            if (parsed.dir !== undefined) job.dir = parsed.dir;
            jobs.push(job);
          }
        }
        await runSocialJobs({ dir, site: origin, base, jobs }, async () => {
          const [{ createRenderer }, regular, bold, icon] = await Promise.all([
            import('../lib/social-renderer.ts'),
            readFile(new URL('../assets/social-fonts/NotoSans-Regular.ttf', import.meta.url)),
            readFile(new URL('../assets/social-fonts/NotoSans-Bold.ttf', import.meta.url)),
            readFile(new URL('icon.svg', config.publicDir)),
          ]);
          return createRenderer({ regular, bold, icon });
        });
      },
    },
  };
}
