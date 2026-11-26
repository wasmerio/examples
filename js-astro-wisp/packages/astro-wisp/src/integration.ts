import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, join, resolve } from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';
import { unified } from '@astrojs/markdown-remark';
import type { RehypePlugins, RemarkPlugins } from '@astrojs/markdown-remark';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import remarkCjkFriendly from 'remark-cjk-friendly';
import remarkCjkFriendlyGfmStrikethrough from 'remark-cjk-friendly-gfm-strikethrough';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkPele from './plugins/remark-pele';
import remarkDiagram from './plugins/remark-diagram';
import remarkReadingTime from './plugins/remark-reading-time';
import remarkHasMath from './plugins/remark-has-math';
import remarkHeadingText from './plugins/remark-heading-text';
import rehypeA11y from './plugins/rehype-a11y';
import rehypeCitations from './plugins/rehype-citations';
import rehypeFigure from './plugins/rehype-figure';
import { copyDiagramSources, diagramDevMiddleware } from './lib/diagram-assets';
import { wispShikiConfig } from './shiki';
import {
  defineWispConfig,
  type WispConfig,
  type WispConfigInput,
  type WispRuntime,
} from './config';
import {
  mergePalette,
  palette as defaultPalette,
  readPaletteOverride,
  type PaletteOverride,
} from './tokens/palette';
import { genThemeCss } from './tokens/generate';
import { checkContrast } from './tokens/contrast';
import { paletteUsesExcalifont, wispFonts } from './fonts';

const here = (p: string) => fileURLToPath(new URL(p, import.meta.url));

/**
 * rehype-katex 生成公式 HTML 时用的是它自己依赖的 katex；主题的公式样式（styles/katex.css）和目录里的标题公式
 * （Toc.astro）如果用的是另一个版本，类名会对不上（0.19 把 .sizing 改名为 .katex-sizing，上下标就不再缩小）。
 * 这里找到 rehype-katex 实际加载的那份 katex，下面用 Vite alias 让整个构建里的 `katex` 都指向它。
 */
export function rehypeKatexKatexDir(): string | undefined {
  try {
    const rk = fileURLToPath(import.meta.resolve('rehype-katex'));
    return dirname(createRequire(rk).resolve('katex/package.json'));
  } catch {
    return undefined;
  }
}
/** 已安装依赖的版本：从入口文件向上找到它自己的 package.json（不依赖包的 exports 是否导出 package.json）。 */
function installedVersion(name: string): string {
  try {
    let dir = dirname(fileURLToPath(import.meta.resolve(name)));
    for (;;) {
      const file = join(dir, 'package.json');
      if (existsSync(file)) {
        const pkg = JSON.parse(readFileSync(file, 'utf8')) as { name?: string; version?: string };
        if (pkg.name === name) return pkg.version ?? '';
      }
      const up = dirname(dir);
      if (up === dir) return '';
      dir = up;
    }
  } catch {
    return '';
  }
}

/**
 * Markdown 管线的指纹：主题的 remark/rehype 插件与 Shiki transformer 源码、主题版本、产出 HTML 的依赖版本。
 *
 * 为什么需要：内容层（glob loader）把 `.md` 渲染好的 HTML 缓存在 `.astro/data-store.json`，只有文件内容或
 * astro 配置的 JSON 摘要变化时才重新渲染；`markdown.processor` 里的插件是函数，进不了摘要。于是升级主题
 * （新增 / 修改插件）后 `.md` 文章还是旧管线的产物，而 `.mdx` 每次由 Vite 重新编译——两者渲染结果不一致。
 * 把这个指纹作为插件选项放进 processor，主题或依赖一变，摘要随之变化，内容层整体失效并重新渲染。
 */
export function pipelineDigest(): string {
  const h = createHash('sha256');
  const files = [
    ...['./plugins/', './lib/', './utils/'].flatMap((dir) =>
      readdirSync(here(dir))
        .filter((f) => f.endsWith('.ts') && !/\.(test|fixture)\.ts$/.test(f))
        .sort()
        .map((f) => `${dir}${f}`),
    ),
    './shiki.ts',
    '../package.json',
  ];
  for (const f of files) h.update(f).update(readFileSync(here(f)));
  for (const dep of ['pele', 'katex', 'rehype-katex', 'remark-math', 'remark-cjk-friendly'])
    h.update(`${dep}@${installedVersion(dep)}`);
  return h.digest('hex').slice(0, 16);
}

/** 只携带指纹的空插件（见 pipelineDigest）。 */
const wispPipeline = (_options: {
  digest: string;
  features: WispConfig['features'];
  lang: string;
  fonts: WispConfig['fonts'];
}) => undefined;

const astroFiles = (dir: string) =>
  readdirSync(here(dir))
    .filter((f) => f.endsWith('.astro'))
    .map((f) => f.slice(0, -'.astro'.length));

/** 可以通过 `components` 覆盖的组件与布局名（与 src/components、src/layouts 下的文件名一致）。 */
export const OVERRIDABLE_COMPONENTS = astroFiles('./components');
export const OVERRIDABLE_LAYOUTS = astroFiles('./layouts');

/** 主题注入的路由：routes 开关键 → [pattern, 入口文件]。 */
const ROUTES: Record<keyof WispConfig['routes'], Array<[string, string]>> = {
  home: [
    ['/', './routes/index.astro'],
    ['/page/[page]', './routes/page/[page].astro'],
  ],
  posts: [['/posts/[...id]', './routes/posts/[...id].astro']],
  archive: [['/archive', './routes/archive.astro']],
  tags: [
    ['/tags', './routes/tags/index.astro'],
    ['/tags/[tag]', './routes/tags/[tag].astro'],
  ],
  categories: [
    ['/categories', './routes/categories/index.astro'],
    ['/categories/[cat]', './routes/categories/[cat].astro'],
  ],
  about: [['/about', './routes/about.astro']],
  rss: [['/rss.xml', './routes/rss.xml.ts']],
  notFound: [['/404', './routes/404.astro']],
};

const fromRoot = (root: string, p: string) => (isAbsolute(p) ? p : resolve(root, p));
/** customCss：`./` 开头或绝对路径按项目根解析，其余（包名）交给 Vite 解析。 */
const cssSpecifier = (root: string, p: string) =>
  p.startsWith('.') || isAbsolute(p) ? resolve(root, p) : p;

/**
 * Wisp 主题集成。站点只需要：
 *
 * ```ts
 * export default defineConfig({ site: 'https://example.com', integrations: [wisp({ site: { title: '…' } })] });
 * ```
 *
 * 集成负责：注入路由（injectRoute）、注册 MDX / Sitemap / Tailwind、Markdown 管线（remark/rehype/Shiki）、
 * 组件覆盖与运行时配置（Vite 虚拟模块）、调色板覆盖（codegen 目录）、图表源文件下载。
 */
export default function wisp(input: WispConfigInput = {}): AstroIntegration {
  const config = defineWispConfig(input);
  let root = process.cwd();

  return {
    name: 'astro-wisp',
    hooks: {
      'astro:config:setup': ({
        config: astroConfig,
        updateConfig,
        injectRoute,
        command,
        logger,
        createCodegenDir,
        addWatchFile,
      }) => {
        root = fileURLToPath(astroConfig.root);
        const dev = command === 'dev';
        if (!astroConfig.site) {
          logger.warn(
            'astro.config 未设置 `site`：RSS、Sitemap、canonical 与图表下载链接需要绝对地址，暂用 https://example.com。',
          );
        }
        const site = astroConfig.site ?? 'https://example.com';

        // ---- 组件覆盖 ----
        const names = new Set([...OVERRIDABLE_COMPONENTS, ...OVERRIDABLE_LAYOUTS]);
        const unknown = Object.keys(config.components).filter((k) => !names.has(k));
        if (unknown.length) {
          throw new Error(
            `[astro-wisp] components 中有未知的组件名：${unknown.join(', ')}。可覆盖：${[...names].join(', ')}`,
          );
        }
        const componentFile = (name: string): string => {
          const override = config.components[name];
          if (override) return fromRoot(root, override);
          return OVERRIDABLE_LAYOUTS.includes(name)
            ? here(`./layouts/${name}.astro`)
            : here(`./components/${name}.astro`);
        };

        let codegenDir: string | undefined;
        const ensureCodegenDir = () => {
          if (!codegenDir) {
            codegenDir = fileURLToPath(createCodegenDir());
            mkdirSync(codegenDir, { recursive: true });
          }
          return codegenDir;
        };

        // ---- 调色板：有覆盖时生成到 codegen 目录，否则直接用包内提交的产物 ----
        let activePalette = defaultPalette;
        let themeCss = [
          here('./styles/tokens.css'),
          here('./styles/pele.css'),
          here('./styles/diagram.css'),
        ];
        if (config.palette !== undefined) {
          let override: PaletteOverride;
          if (typeof config.palette === 'string') {
            const file = fromRoot(root, config.palette);
            addWatchFile(file);
            override = readPaletteOverride(file);
          } else {
            override = config.palette as PaletteOverride;
          }
          activePalette = mergePalette(override);
          const bad = checkContrast(activePalette).filter((r) => !r.pass);
          for (const r of bad)
            logger.warn(`调色板对比度不足 4.5:1 —— [${r.mode}] ${r.pair}: ${r.ratio.toFixed(2)}`);
          const file = join(ensureCodegenDir(), 'theme.css');
          writeFileSync(file, genThemeCss(activePalette));
          themeCss = [file];
        }
        const hasExcalifont = paletteUsesExcalifont(activePalette);

        // ---- CJK 字体（Noto Sans SC）按配置的 font-display 解析或改写到 codegen 目录 ----
        const requireFromTheme = createRequire(import.meta.url);
        const resolvedNotoCssPath = requireFromTheme.resolve(
          '@fontsource-variable/noto-sans-sc/index.css',
        );
        let cjkFontUrlModule: string;
        if (config.fonts.cjkDisplay === 'swap') {
          cjkFontUrlModule = `import u from ${JSON.stringify(`${resolvedNotoCssPath.replaceAll('\\', '/')}?url`)}; export default u;`;
        } else {
          const notoDirForwardSlash = dirname(resolvedNotoCssPath).replaceAll('\\', '/');
          const rewrittenNotoCss = readFileSync(resolvedNotoCssPath, 'utf8')
            .replaceAll('url(./files/', `url(${notoDirForwardSlash}/files/`)
            .replace(/font-display:\s*swap/g, `font-display:${config.fonts.cjkDisplay}`);
          const codegenNotoFile = join(ensureCodegenDir(), 'noto-sans-sc.css');
          writeFileSync(codegenNotoFile, rewrittenNotoCss);
          cjkFontUrlModule = `import u from ${JSON.stringify(`${codegenNotoFile.replaceAll('\\', '/')}?url`)}; export default u;`;
        }

        const runtime: WispRuntime = {
          site: config.site,
          nav: config.nav,
          social: config.social,
          home: config.home,
          features: config.features,
          mermaid: config.mermaid,
          rss: config.rss,
          fonts: config.fonts,
          taxonomy: config.taxonomy,
          routes: config.routes,
          root,
          siteUrl: String(site),
          base: astroConfig.base,
          hasExcalifont,
        };

        const virtualModules: Record<string, string> = {
          'virtual:wisp/config': `export default ${JSON.stringify(runtime)};`,
          // 客户端 island 只需要语言；不要把整份配置（含项目根路径）打进浏览器 bundle
          'virtual:wisp/locale': `export const lang = ${JSON.stringify(config.site.lang)};`,
          'virtual:wisp/cjk-font-url': cjkFontUrlModule,
          'virtual:wisp/theme-css': themeCss.map((f) => `import ${JSON.stringify(f)};`).join('\n'),
          'virtual:wisp/user-css': config.customCss
            .map((f) => `import ${JSON.stringify(cssSpecifier(root, f))};`)
            .join('\n'),
        };
        for (const name of names) {
          virtualModules[`virtual:wisp/components/${name}`] =
            `export { default } from ${JSON.stringify(componentFile(name))};`;
        }

        // ---- Markdown 管线 ----
        const remarkPlugins: RemarkPlugins = [
          // 第一项：不做任何转换，只让管线指纹与关键配置进入 astro 配置摘要（见 pipelineDigest）
          [
            wispPipeline,
            {
              digest: pipelineDigest(),
              features: config.features,
              lang: config.site.lang,
              fonts: config.fonts,
            },
          ],
          // 中文强调：`**文字。**后文` 这类紧挨全角标点的 ** / * 也能闭合（CommonMark 的分界规则不认 CJK）
          remarkCjkFriendly,
          // GFM 删除线同样需要绕过 CommonMark 对中文标点的分界规则；必须在 Astro 的 GFM 扩展之后运行。
          remarkCjkFriendlyGfmStrikethrough,
        ];
        const rehypePlugins: RehypePlugins = [];
        if (config.features.math) remarkPlugins.push(remarkMath);
        if (config.features.mermaid)
          remarkPlugins.push([
            remarkPele,
            { strict: config.mermaid.strict, dev, lang: config.site.lang },
          ]);
        remarkPlugins.push([
          remarkDiagram,
          {
            dev,
            downloads: config.features.diagramDownload,
            siteUrl: String(site),
            base: astroConfig.base,
            root,
          },
        ]);
        remarkPlugins.push(remarkReadingTime, remarkHasMath, remarkHeadingText);
        if (config.features.math) rehypePlugins.push(rehypeKatex);
        // 带标题的独立图片 → figure + 题注（Astro 的图片优化在用户 rehype 插件之后运行，不受影响）
        rehypePlugins.push(rehypeFigure, [rehypeA11y, { lang: config.site.lang }]);
        // GFM 脚注 → 引用：可见的「参考与注释」标题、Lucide 回链图标、按语言的 aria-label
        rehypePlugins.push([rehypeCitations, { lang: config.site.lang }]);

        // ---- 依赖的集成：已由站点自行注册时不重复添加 ----
        const has = (name: string) => astroConfig.integrations.some((i) => i.name === name);
        const integrations: AstroIntegration[] = [];
        if (!has('@astrojs/mdx')) integrations.push(mdx());
        if (!has('@astrojs/sitemap') && astroConfig.site) integrations.push(sitemap());

        const katexDir = config.features.math ? rehypeKatexKatexDir() : undefined;
        updateConfig({
          integrations,
          // Astro Fonts API：与站点自己的 fonts 配置合并（数组拼接），站点可以再注册其他字体
          fonts: wispFonts({ includeExcalifont: hasExcalifont }),
          markdown: {
            // Astro 7 默认使用 Sätteri；Wisp 依赖 remark/rehype 生态，显式使用 unified 处理器
            processor: unified({ remarkPlugins, rehypePlugins }),
            shikiConfig: wispShikiConfig(config),
          },
          vite: {
            resolve: katexDir
              ? {
                  alias: [
                    // 裸 `katex` 必须指到 ESM 入口：指到目录时 dev 的 SSR 会加载 UMD 的 dist/katex.js 并报错
                    { find: /^katex$/, replacement: `${katexDir}/dist/katex.mjs` },
                    { find: /^katex\/(.*)$/, replacement: `${katexDir}/$1` },
                  ],
                }
              : undefined,
            ssr: {
              noExternal: [
                // RSS 全文渲染静态导入 @astrojs/mdx/server.js，需要打进 SSR 产物（见 routes/rss.xml.ts）
                '@astrojs/mdx',
                // Base 布局在服务端 import 字体 CSS；外部化后 Node 无法加载 .css（dev 下报 Unknown file extension）
                /^@fontsource-variable\//,
              ],
            },
            plugins: [
              tailwindcss(),
              {
                name: 'astro-wisp:virtual',
                resolveId(id: string) {
                  if (id in virtualModules) return `\0${id}`;
                },
                load(id: string) {
                  if (id.startsWith('\0virtual:wisp/')) return virtualModules[id.slice(1)];
                },
              },
            ],
          },
        });

        // ---- 路由 ----
        for (const [key, routes] of Object.entries(ROUTES) as Array<
          [keyof WispConfig['routes'], Array<[string, string]>]
        >) {
          if (!config.routes[key]) continue;
          for (const [pattern, entry] of routes)
            injectRoute({ pattern, entrypoint: new URL(entry, import.meta.url) });
        }
      },
      'astro:config:done': ({ injectTypes }) => {
        injectTypes({
          filename: 'virtual.d.ts',
          content: readFileSync(here('../virtual.d.ts'), 'utf8'),
        });
      },
      'astro:server:setup': ({ server }) => {
        if (config.features.diagramDownload) {
          server.middlewares.use(diagramDevMiddleware({ base: server.config.base, root }));
        }
      },
      'astro:build:done': ({ dir, logger }) => {
        if (!config.features.diagramDownload) return;
        const copied = copyDiagramSources(dir, { root });
        logger.info(`图表源文件：复制 ${copied.length} 个到 diagrams/`);
      },
    },
  };
}
