/**
 * 字体：使用 Astro 官方 Fonts API（`fonts` 配置 + `<Font />`）。字体文件在构建期复制到 `_astro/fonts/`，
 * 随站点一起部署（自托管），不请求任何第三方字体服务；构建也不联网。
 *
 * | 字体 | 来源 | provider |
 * |---|---|---|
 * | Inter（正体 + 斜体，可变字重） | 主题依赖 `@fontsource-variable/inter` | npm（只读本地包） |
 * | JetBrains Mono（可变字重） | 主题依赖 `@fontsource-variable/jetbrains-mono` | npm（只读本地包） |
 * | Excalifont（手绘图） | 随主题分发的 `src/assets/fonts/excalifont/` | local |
 *
 * 思源黑体（Noto Sans SC）不走 Fonts API：`<Font />` 会把 @font-face 内联进每个页面，思源黑体有 101 个
 * unicode-range 分片，每页 HTML 会多出约 100KB（gzip 后约 32KB）且无法跨页缓存；因此仍用
 * `@fontsource-variable/noto-sans-sc` 的外部 CSS（只下载一次、浏览器缓存）。见 docs/README.md D18。
 *
 * 全部字体为 SIL Open Font License 1.1。
 */
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { fontProviders } from 'astro/config';
import type { AstroUserConfig } from 'astro';

type FontFamily = NonNullable<AstroUserConfig['fonts']>[number];

import { FONT_VARS } from './tokens/font-vars';
import type { Palette } from './tokens/palette';

export { FONT_STACK_VARS, FONT_VARS } from './tokens/font-vars';

// 从主题包自己的依赖中解析字体包：pnpm 严格模式下站点根目录的 node_modules 里没有它们
const requireFromTheme = createRequire(import.meta.url);

/** Fontsource 文件名 `<id>-<subset>-wght-<style>.woff2` → subset（供 `<Font preload>` 按子集过滤）。 */
export function fontsourceSubset(file: string): string | undefined {
  return /-((?:latin|cyrillic|greek|vietnamese)(?:-ext)?|\[\d+\]|\d+)-wght-(?:normal|italic)\.woff2$/.exec(
    file,
  )?.[1];
}

/**
 * 官方 npm provider 的薄包装：
 * - `remote: false` + 从主题依赖解析：只读本地包，构建不联网；
 * - `files`：一个字体族由多个入口 CSS 组成（Inter 的 `wght.css` + `wght-italic.css`），合并为同一个族；
 * - 把 unifont 产出的 `file://` URL 转成绝对路径（Astro 7.4 的字体抓取器只识别绝对路径）；
 * - 按文件名补上 `meta.subset`，让 `<Font preload={[{ subset: 'latin' }]} />` 生效。
 */
function localFontsource(): ReturnType<typeof fontProviders.npm> {
  const inner = fontProviders.npm({
    remote: false,
    resolve: (id) => {
      try {
        return requireFromTheme.resolve(id);
      } catch {
        return null;
      }
    },
  });
  type NpmProviderOptions = NonNullable<Parameters<typeof inner.resolveFont>[0]['options']>;
  type WispNpmOptions = NpmProviderOptions & { files?: string[] };
  return {
    ...inner,
    name: 'wisp-fontsource',
    async resolveFont(options) {
      const opts = options.options as WispNpmOptions | undefined;
      const runs = opts?.files?.length
        ? opts.files.map((file) => ({ ...options, options: { ...opts, file } }))
        : [options];
      const fonts = [];
      for (const run of runs) fonts.push(...((await inner.resolveFont(run))?.fonts ?? []));
      for (const face of fonts) {
        for (const src of face.src) {
          if ('url' in src && src.url.startsWith('file:')) src.url = fileURLToPath(src.url);
          if ('url' in src)
            face.meta = { ...face.meta, subset: face.meta?.subset ?? fontsourceSubset(src.url) };
        }
      }
      return { fonts };
    },
    // 多入口合并的族由 resolveFont 决定可用样式，跳过 provider 的样式预检（否则会误报“不支持 italic”）
    getFontProperties: undefined,
  };
}

/** 按字体文件名补上 `meta.subset`（local provider 不产出子集信息）。 */
function withSubsetFromFile(
  provider: ReturnType<typeof fontProviders.local>,
  subsetOf: (url: string) => string | undefined,
): ReturnType<typeof fontProviders.local> {
  return {
    ...provider,
    init: provider.init?.bind(provider),
    async resolveFont(options) {
      const r = await provider.resolveFont(options);
      for (const face of r?.fonts ?? []) {
        const url = face.src.map((s) => ('url' in s ? String(s.url) : '')).find(Boolean) ?? '';
        face.meta = { ...face.meta, subset: face.meta?.subset ?? subsetOf(url) };
      }
      return r;
    },
  };
}

/** Excalifont 分片（unicode-range 与 Excalidraw 自身一致）。 */
const EXCALIFONT: Array<{ subset: string; unicodeRange: string[] }> = [
  {
    subset: 'latin',
    unicodeRange: [
      'U+20-7e',
      'U+a0-a3',
      'U+a5-a6',
      'U+a8-ab',
      'U+ad-b1',
      'U+b4',
      'U+b6-b8',
      'U+ba-ff',
      'U+131',
      'U+152-153',
      'U+2bc',
      'U+2c6',
      'U+2da',
      'U+2dc',
      'U+304',
      'U+308',
      'U+2013-2014',
      'U+2018-201a',
      'U+201c-201e',
      'U+2020',
      'U+2022',
      'U+2024-2026',
      'U+2030',
      'U+2039-203a',
      'U+20ac',
      'U+2122',
      'U+2212',
    ],
  },
  {
    subset: 'latin-ext',
    unicodeRange: [
      'U+100-130',
      'U+132-137',
      'U+139-149',
      'U+14c-151',
      'U+154-17e',
      'U+192',
      'U+1fc-1ff',
      'U+218-21b',
      'U+237',
      'U+1e80-1e85',
      'U+1ef2-1ef3',
      'U+2113',
    ],
  },
  { subset: 'cyrillic', unicodeRange: ['U+400-45f', 'U+490-491', 'U+2116'] },
  {
    subset: 'greek',
    unicodeRange: [
      'U+37e',
      'U+384-38a',
      'U+38c',
      'U+38e-393',
      'U+395-3a1',
      'U+3a3-3a8',
      'U+3aa-3cf',
      'U+3d7',
    ],
  },
  {
    subset: 'diacritics',
    unicodeRange: [
      'U+2c7',
      'U+2d8-2d9',
      'U+2db',
      'U+2dd',
      'U+302',
      'U+306-307',
      'U+30a-30c',
      'U+326-328',
      'U+212e',
      'U+2211',
      'U+fb01-fb02',
    ],
  },
  {
    subset: 'cyrillic-ext',
    unicodeRange: ['U+462-463', 'U+472-475', 'U+4d8-4d9', 'U+4e2-4e3', 'U+4e6-4e9', 'U+4ee-4ef'],
  },
  { subset: 'combining', unicodeRange: ['U+300-301', 'U+303'] },
];

export function paletteUsesExcalifont(p: Palette): boolean {
  return p.font.hand.some((f) => /excalifont/i.test(f));
}

/** Astro 的回退字体优化会在字体栈中插入通用族（sans-serif），挡住后面的中文字体，因此关闭（fallbacks: []），由令牌中的字体栈负责回退。 */
export function wispFonts(options: { includeExcalifont?: boolean } = {}): FontFamily[] {
  const { includeExcalifont = true } = options;
  const npm = localFontsource();
  const families: unknown[] = [
    {
      provider: npm,
      name: 'Inter Variable',
      cssVariable: FONT_VARS.sans,
      weights: ['100 900'],
      styles: ['normal', 'italic'],
      fallbacks: [],
      options: { package: '@fontsource-variable/inter', files: ['wght.css', 'wght-italic.css'] },
    },
    {
      provider: npm,
      name: 'JetBrains Mono Variable',
      cssVariable: FONT_VARS.mono,
      weights: ['100 900'],
      styles: ['normal'],
      fallbacks: [],
      options: { package: '@fontsource-variable/jetbrains-mono' },
    },
  ];
  if (includeExcalifont) {
    families.push({
      provider: withSubsetFromFile(
        fontProviders.local(),
        (url) => /excalifont-([a-z-]+)\.woff2$/.exec(url)?.[1],
      ),
      name: 'Excalifont',
      cssVariable: FONT_VARS.hand,
      fallbacks: [],
      options: {
        variants: EXCALIFONT.map((v) => ({
          src: [new URL(`./assets/fonts/excalifont/excalifont-${v.subset}.woff2`, import.meta.url)],
          weight: 400,
          style: 'normal',
          unicodeRange: v.unicodeRange,
        })),
      },
    });
  }
  return families as FontFamily[]; // 各族的 options 按各自 provider 类型化；Astro 公开类型只提供未特化的 FontFamily
}
