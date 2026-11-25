import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import path from 'node:path';
import type { ReactNode } from 'react';
import { resolveLocalized } from './localized';
import type { BlogConfig, Locale } from '../types/config';

const require = createRequire(import.meta.url);
const buffers = new Map<string, Promise<Buffer>>();
const readFont = (file: string) => {
  let value = buffers.get(file);
  if (!value) {
    value = readFile(file);
    buffers.set(file, value);
  }
  return value;
};
let faces: Promise<{ file: string; ranges: [number, number][] }[]> | undefined;
async function coverFonts(text: string, customPath?: string) {
  if (customPath)
    return [
      {
        name: 'BlogGPT',
        data: await readFont(path.resolve(customPath)),
        weight: 400 as const,
        style: 'normal' as const,
      },
    ];
  faces ??= (async () => {
    const cssPath = require.resolve('@fontsource/noto-sans-sc/400.css');
    const css = await readFile(cssPath, 'utf8');
    return [...css.matchAll(/@font-face\s*\{([^}]+)\}/g)].map(([, block]) => ({
      file: path.resolve(
        path.dirname(cssPath),
        block.match(/url\(([^)]+\.woff)\)/)![1],
      ),
      ranges: [...block.matchAll(/U\+([\da-f]+)(?:-([\da-f]+))?/gi)].map(
        ([, start, end]) =>
          [parseInt(start, 16), parseInt(end ?? start, 16)] as [number, number],
      ),
    }));
  })();
  const points = [...new Set([...text].map((char) => char.codePointAt(0)!))];
  const selected = (await faces).filter((face) =>
    face.ranges.some(([start, end]) =>
      points.some((point) => point >= start && point <= end),
    ),
  );
  selected.sort(
    (a, b) =>
      Number(b.file.includes('-latin-')) - Number(a.file.includes('-latin-')),
  );
  return Promise.all(
    selected.map(async (face, index) => ({
      name: index === 0 ? 'BlogGPT' : `BlogGPT-${index}`,
      data: await readFont(face.file),
      weight: 400 as const,
      style: 'normal' as const,
    })),
  );
}
const node = (
  type: string,
  style: Record<string, string | number>,
  children: unknown,
) => ({ type, props: { style, children } });
export async function shareCover(
  title: string,
  description: string,
  config: BlogConfig,
  lang: Locale = config.site.defaultLocale,
): Promise<Buffer> {
  const options = config.article.shareCover;
  const subtitle = description.slice(0, 130);
  const displayTitle = [...title].slice(0, 100).join('');
  const text = (value: BlogConfig['site']['title']) =>
    resolveLocalized(
      value,
      lang,
      config.site.defaultLocale,
      config.site.locales,
    );
  const siteTitle = text(config.site.title);
  const footer = `${text(config.author.name)} · ${siteTitle}`;
  const fonts = await coverFonts(
    `${displayTitle}${subtitle}${footer}`,
    options.fontPath,
  );
  const hash = createHash('sha256').update(
    JSON.stringify({
      version: 3,
      title: displayTitle,
      subtitle,
      footer,
      options,
    }),
  );
  for (const font of fonts) hash.update(font.data);
  const cache = path.join(
    process.cwd(),
    '.astro',
    'share-covers',
    `${hash.digest('hex')}.png`,
  );
  const existing = await readFile(cache).catch(() => undefined);
  if (existing) return existing;
  const [{ default: satori }, { default: sharp }] = await Promise.all([
    import('satori'),
    import('sharp'),
  ]);
  const scale = Math.min(options.width / 1200, options.height / 630);
  const svg = await satori(
    node(
      'div',
      {
        width: options.width,
        height: options.height,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 64 * scale,
        backgroundColor: options.background,
        color: options.foreground,
        fontFamily: 'BlogGPT',
      },
      [
        node(
          'div',
          {
            display: 'flex',
            alignItems: 'center',
            gap: 12 * scale,
            fontSize: 26 * scale,
          },
          [
            node(
              'div',
              {
                width: 24 * scale,
                height: 24 * scale,
                borderRadius: 7 * scale,
                backgroundColor: options.accent,
              },
              '',
            ),
            siteTitle,
          ],
        ),
        node(
          'div',
          { display: 'flex', flexDirection: 'column', gap: 24 * scale },
          [
            node(
              'div',
              {
                display: 'flex',
                fontSize: (displayTitle.length > 45 ? 44 : 58) * scale,
                lineHeight: 1.25,
                wordBreak: 'break-word',
              },
              displayTitle,
            ),
            node(
              'div',
              {
                display: 'flex',
                fontSize: 24 * scale,
                lineHeight: 1.5,
                color: options.foreground,
                opacity: 0.65,
              },
              subtitle,
            ),
          ],
        ),
        node(
          'div',
          { display: 'flex', fontSize: 23 * scale, opacity: 0.65 },
          footer,
        ),
      ],
    ) as ReactNode,
    { width: options.width, height: options.height, fonts },
  );
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  await mkdir(path.dirname(cache), { recursive: true });
  await writeFile(cache, png);
  return png;
}
