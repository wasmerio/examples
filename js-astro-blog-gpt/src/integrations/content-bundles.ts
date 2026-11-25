import { createReadStream } from 'node:fs';
import { access, copyFile, mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';
import type { BlogConfig } from '../types/config';
import { contentLocales } from '../lib/translations.ts';
import { postPath } from '../lib/post-path.ts';
import { siteAddress } from '../lib/site-url.ts';
import { contentKinds, readContentFiles } from '../lib/content-files.ts';
import {
  assertUniqueSlugs,
  assertMatchingSlugs,
  chooseVariants,
  fileIdentity,
} from '../lib/content-variants.ts';
import { safeSlug } from '../lib/policy.ts';
import {
  parseContentDate,
  validateContentDates,
} from '../lib/content-dates.ts';
import { introPageSlug, introRoutes } from '../lib/intro-config.ts';
import { localeRoot } from '../lib/locale-routing.ts';

async function attachments(directory: string): Promise<string[]> {
  return (
    await Promise.all(
      (await readdir(directory, { withFileTypes: true })).map(async (entry) => {
        const file = path.join(directory, entry.name);
        if (entry.isSymbolicLink())
          throw new Error(
            `Bundle attachments cannot be symbolic links: ${file}`,
          );
        return entry.isDirectory() ? attachments(file) : [file];
      }),
    )
  ).flat();
}

/** Map each selected bundle's attachments to the URL of its rendered content. */
export async function bundleAssets(
  root: string,
  config: BlogConfig,
  dev = false,
) {
  const supportedLocales = contentLocales(config.site.locales);
  const records = await readContentFiles(root, supportedLocales);
  const result = new Map<string, string>();
  for (const kind of contentKinds) {
    const entries = records
      .filter((record) => record.kind === kind)
      .map((record) => {
        const id = `content/${kind}/${record.file}`;
        validateContentDates(record.data, id, (message) =>
          console.warn(message),
        );
        const date =
          record.data.date ?? record.data.published ?? record.data.pubDatetime;
        return {
          ...record,
          id,
          publicationDate:
            date === undefined ? undefined : parseContentDate(date),
          data: {
            ...record.data,
            draft: record.data.draft,
            date: record.data.date,
            published: record.data.published,
            pubDatetime: record.data.pubDatetime,
            _key: record.identity.key,
            _locale: record.identity.locale,
            slug: safeSlug(
              String(
                record.data.slug ??
                  (record.identity.bundle
                    ? path.posix.basename(
                        path.posix.dirname(record.identity.key),
                      )
                    : path.posix.basename(record.identity.key)),
              ),
            ),
          },
        };
      });
    assertMatchingSlugs(entries);
    const visible = entries.filter((entry) => {
      if (dev && config.posts.showDraftsInDev) return true;
      return (
        !entry.data.draft &&
        (kind !== 'posts' ||
          (entry.publicationDate?.getTime() ?? NaN) <= Date.now())
      );
    });
    for (const locale of config.site.locales) {
      const prefix = localeRoot({ ...config.site, base: '/' }, locale).slice(1);
      const chosen = assertUniqueSlugs(
        chooseVariants(
          visible,
          locale,
          config.site.defaultLocale,
          config.site.locales,
        ),
        `${locale}/${kind}`,
      );
      for (const record of chosen) {
        if (!record.identity.bundle) continue;
        const directory = path.dirname(record.absolute);
        const routes =
          kind === 'pages' &&
          introRoutes.some((route) => route === record.data.slug)
            ? []
            : [
                kind === 'pages'
                  ? `${prefix}${record.data.slug}`
                  : `${prefix}${kind}/${kind === 'posts' ? postPath({ slug: record.data.slug, date: record.publicationDate! }, config.posts.pathPrefix, config.site.timezone) : record.data.slug}`,
              ];
        if (kind === 'pages')
          for (const route of introRoutes) {
            const page = introPageSlug(config, route);
            if (
              page &&
              (page === record.data.slug ||
                entries.some(
                  (entry) =>
                    entry.data.slug === page &&
                    entry.identity.key === record.identity.key,
                ))
            )
              routes.push(`${prefix}${route}`);
          }
        for (const file of await attachments(directory)) {
          const relative = path
            .relative(directory, file)
            .split(path.sep)
            .join('/');
          if (
            !relative.includes('/') &&
            /\.(md|mdx)$/i.test(relative) &&
            fileIdentity(relative, supportedLocales).bundle
          )
            continue;
          for (const route of routes) {
            const destination = `${route}/${relative}`;
            if (destination === `${route}/index.html`)
              throw new Error(
                `Bundle attachment would overwrite the rendered page: ${file}. Rename this attachment.`,
              );
            const previous = result.get(destination);
            if (previous && previous !== file)
              throw new Error(`Bundle asset collision: ${destination}`);
            result.set(destination, file);
          }
        }
      }
    }
  }
  return result;
}

const mime: Record<string, string> = {
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.avif': 'image/avif',
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/plain; charset=utf-8',
  '.mdx': 'text/plain; charset=utf-8',
  '.pdf': 'application/pdf',
  '.zip': 'application/zip',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
};
export default function contentBundles(config: BlogConfig): AstroIntegration {
  let root = '';
  return {
    name: 'bloggpt-content-bundles',
    hooks: {
      'astro:config:done': ({ config: astro }) => {
        root = fileURLToPath(astro.root);
      },
      'astro:server:setup': ({ server }) => {
        let cached: ReturnType<typeof bundleAssets> | undefined;
        const changed = (file: string) => {
          if (!path.relative(path.join(root, 'content'), file).startsWith('..'))
            cached = undefined;
        };
        server.watcher
          .on('change', changed)
          .on('add', changed)
          .on('unlink', changed);
        server.httpServer?.once('close', () => {
          server.watcher
            .off('change', changed)
            .off('add', changed)
            .off('unlink', changed);
        });
        server.middlewares.use(async (req, res, next) => {
          try {
            const base = siteAddress(config.site.baseUrl).base.replace(
              /\/$/,
              '',
            );
            const url = new URL(req.url ?? '/', 'http://localhost');
            if (!url.pathname.startsWith(`${base}/`)) return next();
            const relative = decodeURIComponent(
              url.pathname.slice(base.length + 1),
            );
            cached ??= bundleAssets(root, config, true);
            const file = (await cached).get(relative);
            if (!file) return next();
            res.setHeader(
              'Content-Type',
              mime[path.extname(file).toLowerCase()] ??
                'application/octet-stream',
            );
            if (req.method === 'HEAD') {
              res.end();
              return;
            }
            createReadStream(file).on('error', next).pipe(res);
          } catch (error) {
            next(error);
          }
        });
      },
      'astro:build:done': async ({ dir, logger }) => {
        const output = fileURLToPath(dir);
        const assets = await bundleAssets(root, config);
        for (const destination of assets.keys()) {
          const target = path.resolve(output, destination);
          if (!target.startsWith(`${path.resolve(output)}${path.sep}`))
            throw new Error(`Invalid bundle destination: ${destination}`);
          if (
            await access(target).then(
              () => true,
              () => false,
            )
          )
            throw new Error(
              `Bundle asset conflicts with an existing build output: ${destination}`,
            );
        }
        for (const [destination, source] of assets) {
          const target = path.join(output, destination);
          await mkdir(path.dirname(target), { recursive: true });
          await copyFile(source, target);
        }
        await mkdir(path.join(root, '.astro'), { recursive: true });
        await writeFile(
          path.join(root, '.astro/bloggpt-bundle-assets.json'),
          JSON.stringify([...assets.keys()]),
        );
        logger.info(`Copied ${assets.size} content bundle attachments.`);
      },
    },
  };
}
