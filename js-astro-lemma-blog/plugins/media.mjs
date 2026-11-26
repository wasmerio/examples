// Videos next to a post: `![caption](./clip.mp4)` becomes a <video>.
//
// Astro only processes images, so video files are served from their post
// folder at /media/posts/<post>/<file>: by middleware in dev, and copied into
// the build output after a build.
//
// Cloudflare takes files up to 25 MiB (options.maxBytes). Larger videos go to
// R2 (options.r2) with `bun run media:push`, which uploads them, lists them in
// src/media-r2.json and keeps them out of git; posts still write
// `![caption](./clip.mp4)`. Settings come from lemma.config.mjs (media).
//
// Each <video> gets width and height (read by ffprobe), so the page does not
// shift when the video loads. They are cached in options.dimensions, which is
// committed, so a build without ffprobe (CI) still has them.
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseFrontmatter } from '@astrojs/markdown-remark';
import sirv from 'sirv';

export const VIDEO = { '.mp4': 'video/mp4', '.webm': 'video/webm', '.m4v': 'video/x-m4v', '.mov': 'video/quicktime', '.ogv': 'video/ogg' };
const BASE = '/media/posts';

export const isVideo = (path) => Object.hasOwn(VIDEO, extname(path).toLowerCase());

/** Videos on R2: { "<post>/<file>": { key, size, sha256 } }. */
export const readManifest = (url) => (existsSync(url) ? JSON.parse(readFileSync(url, 'utf8')) : {});

const mib = (bytes) => `${Math.round(bytes / 2 ** 20)} MiB`;

// File names may hold #, ? or %, which mean something else in a URL. Other
// characters that are valid in a path (& + $ ...) stay as they are, because
// sirv (dev) decodes paths with decodeURI, which leaves their escapes encoded.
const encode = (key) => encodeURI(key).replace(/[#?]/g, encodeURIComponent);

// Width and height of a video as shown (rotation applied), or undefined if
// ffprobe is missing or cannot read the file.
let noFfprobe = false;
function probe(path) {
  if (noFfprobe) return;
  try {
    const args = ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height:stream_side_data=rotation:stream_tags=rotate', '-of', 'json', path];
    const [stream] = JSON.parse(execFileSync('ffprobe', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })).streams ?? [];
    if (!stream?.width || !stream?.height) return;
    const rotation = Number(stream.side_data_list?.find((d) => d.rotation !== undefined)?.rotation ?? stream.tags?.rotate ?? 0);
    return Math.abs(rotation) % 180 === 90 ? { width: stream.height, height: stream.width } : { width: stream.width, height: stream.height };
  } catch (e) {
    if (e.code === 'ENOENT') noFfprobe = true;
  }
}

/** Remark plugin. @param {{ posts: URL, manifest: URL, dimensions?: URL, maxBytes: number, r2: { origin: string } }} options */
export default function remarkMedia({ posts, manifest, dimensions, maxBytes, r2 }) {
  const root = fileURLToPath(posts);
  const remote = readManifest(manifest);
  // { "<post>/<file>": { width, height, size } }; probed again when the size changes.
  const cache = dimensions && existsSync(dimensions) ? JSON.parse(readFileSync(dimensions, 'utf8')) : {};
  const measure = (key, path, bytes) => {
    const known = cache[key];
    // Without the file (an R2 video in CI) the cached value is all there is.
    if (bytes === undefined || known?.size === bytes) return known;
    const found = probe(path);
    if (!found || !dimensions) return found ?? known;
    cache[key] = { ...found, size: bytes };
    const sorted = Object.fromEntries(Object.entries(cache).sort(([a], [b]) => a.localeCompare(b)));
    writeFileSync(dimensions, JSON.stringify(sorted, null, 2) + '\n');
    return cache[key];
  };
  return (tree, file) => {
    const visit = (node) => {
      for (const [i, child] of (node.children ?? []).entries()) {
        if (child.type === 'image' && isVideo(child.url) && !/^[a-z]+:/i.test(child.url)) {
          let src = child.url;
          let dims;
          // Root-absolute URLs point into public/ and are served as they are.
          if (!src.startsWith('/')) {
            const path = join(dirname(file.path), decodeURIComponent(child.url));
            const rel = relative(root, path);
            if (rel.startsWith('..')) {
              console.warn(`[media] ${file.path}: ${child.url} is outside the posts folder`);
              continue;
            }
            const key = rel.split('\\').join('/');
            const size = existsSync(path) ? statSync(path).size : undefined;
            if (remote[key]) {
              // The local copy is absent in CI (not in git); that is fine.
              if (size !== undefined && size !== remote[key].size) console.warn(`[media] ${file.path}: ${child.url} changed since upload; run bun run media:push`);
              src = `${r2.origin}/${encode(remote[key].key)}`;
            } else {
              if (size === undefined) console.warn(`[media] ${file.path}: missing ${child.url}`);
              else if (size > maxBytes) console.warn(`[media] ${file.path}: ${child.url} is over ${mib(maxBytes)}; run bun run media:push`);
              src = `${BASE}/${encode(key)}`;
            }
            dims = measure(key, path, size);
          }
          node.children[i] = {
            type: 'video',
            data: {
              hName: 'video',
              // "#t=0.001" makes browsers show the first frame instead of a blank box.
              hProperties: {
                src: `${src}#t=0.001`,
                width: dims?.width,
                height: dims?.height,
                controls: true,
                preload: 'metadata',
                playsInline: true,
                title: child.alt || undefined,
              },
              hChildren: [{ type: 'element', tagName: 'a', properties: { href: src }, children: [{ type: 'text', value: child.alt || src }] }],
            },
          };
        } else {
          visit(child);
        }
      }
    };
    visit(tree);
  };
}

/** Integration that serves (dev) and copies (build) the video files that are not on R2. @param {{ posts: URL, manifest: URL }} options */
export function mediaIntegration({ posts, manifest }) {
  const root = fileURLToPath(posts);
  const serve = sirv(root, { dev: true });
  return {
    name: 'post-media',
    hooks: {
      'astro:server:setup': ({ server }) => {
        server.middlewares.use(BASE, (req, res, next) => (isVideo(req.url.split('?')[0]) ? serve(req, res, next) : next()));
      },
      'astro:build:done': ({ dir }) => {
        const out = join(fileURLToPath(dir), BASE);
        // A folder whose posts are all drafts is not published, nor are its videos.
        // The frontmatter is parsed as Astro does, so `draft: true # wip` counts.
        const draftOnly = (folder) => {
          const posts = readdirSync(folder).filter((f) => /^(zh|en)\.md$/.test(f));
          return posts.length > 0 && posts.every((f) => parseFrontmatter(readFileSync(join(folder, f), 'utf8')).frontmatter.draft === true);
        };
        const remote = readManifest(manifest);
        const copy = (from) => {
          if (draftOnly(from)) return;
          for (const entry of readdirSync(from, { withFileTypes: true })) {
            const path = join(from, entry.name);
            if (entry.isDirectory()) copy(path);
            else if (isVideo(entry.name) && !remote[relative(root, path).split('\\').join('/')]) cpSync(path, join(out, relative(root, path)), { recursive: true });
          }
        };
        copy(root);
      },
    },
  };
}
