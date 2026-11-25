import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';
import { createIndex } from 'pagefind';

function checkErrors(result: { errors: string[] }) {
  if (result.errors.length) throw new Error(result.errors.join('\n'));
}

/** Index rendered article HTML in both Astro development and static builds. */
export default function pagefind(): AstroIntegration {
  let origin = '';
  let sourceDirectory = '';
  let files: Promise<Map<string, Uint8Array>> | undefined;

  async function indexDevelopment() {
    const response = await fetch(`${origin}/_pagefind/posts.json`);
    if (!response.ok)
      throw new Error('Cannot load posts for the search index.');
    const paths: string[] = await response.json();
    const result = await createIndex({ rootSelector: '[data-pagefind-body]' });
    checkErrors(result);
    if (!result.index) throw new Error('Cannot create the search index.');
    const index = result.index;
    try {
      for (const path of paths) {
        const page = await fetch(new URL(path, origin));
        if (!page.ok) throw new Error(`Cannot index ${path}: ${page.status}`);
        checkErrors(
          await index.addHTMLFile({ url: path, content: await page.text() }),
        );
      }
      const output = await index.getFiles();
      checkErrors(output);
      return new Map(output.files.map((file) => [file.path, file.content]));
    } finally {
      await index.deleteIndex();
    }
  }

  function getFiles() {
    files ??= indexDevelopment().catch((error) => {
      files = undefined;
      throw error;
    });
    return files;
  }

  return {
    name: 'nayuta-pagefind',
    hooks: {
      'astro:config:setup': ({ command, config, injectRoute }) => {
        sourceDirectory = fileURLToPath(config.srcDir);
        if (command === 'dev') {
          injectRoute({
            pattern: '/_pagefind/posts.json',
            entrypoint: new URL(
              'integrations/pagefind/posts.ts',
              config.srcDir,
            ),
          });
        }
      },
      'astro:server:setup': ({ server, logger }) => {
        const invalidate = (path: string) => {
          if (path.startsWith(sourceDirectory)) files = undefined;
        };
        server.watcher.on('all', (_event, path) => invalidate(path));
        server.middlewares.use(async (request, response, next) => {
          const pathname = new URL(request.url ?? '/', 'http://localhost')
            .pathname;
          if (!pathname.startsWith('/pagefind/')) return next();
          try {
            const content = (await getFiles()).get(
              pathname.slice('/pagefind/'.length),
            );
            response.setHeader('Cache-Control', 'no-store');
            if (!content) {
              response.statusCode = 404;
              response.end('Not found');
              return;
            }
            response.setHeader(
              'Content-Type',
              pathname.endsWith('.js')
                ? 'text/javascript'
                : pathname.endsWith('.json')
                  ? 'application/json'
                  : 'application/octet-stream',
            );
            response.end(content);
          } catch (error) {
            logger.error(String(error));
            response.statusCode = 503;
            response.end('Search index is unavailable.');
          }
        });
      },
      'astro:server:start': ({ address, logger }) => {
        const hostname =
          address.address === '::' || address.address === '0.0.0.0'
            ? 'localhost'
            : address.address;
        origin = `http://${hostname.includes(':') ? `[${hostname}]` : hostname}:${address.port}`;
        void getFiles()
          .then(() => logger.info('Search index ready.'))
          .catch((error) => logger.error(String(error)));
      },
      'astro:build:done': async ({ dir, logger }) => {
        const result = await createIndex({
          rootSelector: '[data-pagefind-body]',
        });
        checkErrors(result);
        if (!result.index) throw new Error('Cannot create the search index.');
        const index = result.index;
        try {
          const indexed = await index.addDirectory({
            path: fileURLToPath(dir),
          });
          checkErrors(indexed);
          checkErrors(
            await index.writeFiles({
              outputPath: fileURLToPath(new URL('pagefind/', dir)),
            }),
          );
          logger.info('Search index generated.');
        } finally {
          await index.deleteIndex();
        }
      },
    },
  };
}
