import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import type { Root as HastRoot } from 'hast';
import { raw } from 'hast-util-raw';
import { toHtml } from 'hast-util-to-html';
import { unified as astroUnified } from '@astrojs/markdown-remark';
import type { RehypePlugins, RemarkPlugins } from '@astrojs/markdown-remark';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import type { HookParameters } from 'astro';
import { describe, expect, it } from 'vitest';
import wisp, { OVERRIDABLE_COMPONENTS, OVERRIDABLE_LAYOUTS, pipelineDigest } from './integration';
import { defineWispConfig } from './config';

type SetupOptions = HookParameters<'astro:config:setup'>;
type VirtualPlugin = {
  name?: string;
  resolveId: (id: string) => string | null | undefined;
  load: (id: string | null | undefined) => string | undefined;
};
type SetupUpdate = {
  integrations: Array<{ name: string }>;
  markdown: {
    processor: { options: { remarkPlugins: RemarkPlugins; rehypePlugins: RehypePlugins } };
    shikiConfig: Record<string, unknown>;
  };
  fonts: Array<{ cssVariable: string }>;
  vite: { plugins: VirtualPlugin[] };
};

/** 用假的钩子参数跑 astro:config:setup，收集注入的路由与配置更新。 */
function setup(input: Parameters<typeof wisp>[0] = {}, base = '/') {
  const root = mkdtempSync(join(tmpdir(), 'wisp-int-'));
  const codegen = join(root, '.astro', 'integrations', 'astro-wisp');
  const routes: string[] = [];
  const updates: SetupUpdate[] = [];
  const warnings: string[] = [];
  const hook = wisp(input).hooks['astro:config:setup'];
  if (!hook) throw new Error('setup hook not registered');
  hook({
    config: {
      root: pathToFileURL(`${root}/`),
      integrations: [],
      site: new URL('https://example.com'),
      base,
    },
    updateConfig: (u: unknown) => updates.push(u as SetupUpdate),
    injectRoute: (r: { pattern: string }) => routes.push(r.pattern),
    command: 'build',
    logger: { warn: (m: string) => warnings.push(m), info() {} },
    createCodegenDir: () => pathToFileURL(`${codegen}/`),
    addWatchFile() {},
  } as unknown as SetupOptions);
  const update = updates[0];
  if (!update) throw new Error('integration did not update config');
  const vite = update.vite;
  const plugin = vite.plugins.find((p) => p.name === 'astro-wisp:virtual');
  if (!plugin) throw new Error('virtual plugin not registered');
  const load = (id: string) => {
    const value = plugin.load(plugin.resolveId(id));
    if (typeof value !== 'string') throw new Error(`virtual module did not load: ${id}`);
    return value;
  };
  return { root, routes, updates, warnings, load, codegen };
}

describe('astro-wisp 集成', () => {
  it('默认注入全部路由，并注册 MDX 与 Sitemap', () => {
    const { routes, updates } = setup();
    expect(routes).toEqual(
      expect.arrayContaining([
        '/',
        '/page/[page]',
        '/posts/[...id]',
        '/archive',
        '/tags',
        '/tags/[tag]',
        '/categories',
        '/categories/[cat]',
        '/about',
        '/rss.xml',
        '/404',
      ]),
    );
    expect(updates[0].integrations.map((i: { name: string }) => i.name)).toEqual([
      '@astrojs/mdx',
      '@astrojs/sitemap',
    ]);
    expect(updates[0].fonts.map((f: { cssVariable: string }) => f.cssVariable)).toEqual([
      '--font-wisp-sans',
      '--font-wisp-mono',
      '--font-wisp-hand',
    ]);
  });

  it('routes 开关可以关闭单个路由，便于站点自行实现', () => {
    const { routes } = setup({ routes: { about: false, rss: false } });
    expect(routes).not.toContain('/about');
    expect(routes).not.toContain('/rss.xml');
    expect(routes).toContain('/archive');
  });

  it('components 覆盖：虚拟模块指向站点文件；未知组件名报错并列出可选项', () => {
    const { load, root } = setup({ components: { Footer: './src/components/MyFooter.astro' } });
    expect(load('virtual:wisp/components/Footer')).toContain(
      JSON.stringify(join(root, 'src/components/MyFooter.astro')),
    );
    expect(load('virtual:wisp/components/Header').replaceAll('\\\\', '/')).toMatch(
      /components\/Header\.astro"/,
    );
    expect(load('virtual:wisp/components/Post').replaceAll('\\\\', '/')).toMatch(
      /layouts\/Post\.astro"/,
    );
    expect(() => setup({ components: { Nope: './x.astro' } })).toThrow(
      /未知的组件名：Nope。可覆盖：.*Footer/,
    );
  });

  it('运行时配置：不含构建期选项；客户端 locale 只暴露语言', () => {
    const { load, root } = setup({
      site: { title: 'T', lang: 'en' },
      customCss: ['./a.css', 'pkg/b.css'],
    });
    const cfg = JSON.parse(load('virtual:wisp/config').replace(/^export default |;$/g, ''));
    expect(cfg).toMatchObject({
      base: '/',
      siteUrl: 'https://example.com/',
      site: { title: 'T', lang: 'en' },
    });
    expect(join(cfg.root)).toBe(join(root, '/'));
    expect(cfg).not.toHaveProperty('components');
    expect(cfg).not.toHaveProperty('customCss');
    expect(load('virtual:wisp/locale')).toBe('export const lang = "en";');
    expect(load('virtual:wisp/user-css')).toBe(
      `import ${JSON.stringify(join(root, 'a.css'))};\nimport "pkg/b.css";`,
    );
  });

  it('运行时配置保留 Astro base，供主题链接使用', () => {
    const cfg = JSON.parse(
      setup({}, '/infra-note/')
        .load('virtual:wisp/config')
        .replace(/^export default |;$/g, ''),
    );
    expect(cfg.base).toBe('/infra-note/');
  });

  it('palette 覆盖：生成到 codegen 目录并替换主题令牌；对比度不足时告警', () => {
    const { load, codegen, warnings } = setup({
      palette: { color: { base: { accent: { light: '#eeeeee', dark: '#5ad19a' } } } },
    });
    const file = join(codegen, 'theme.css');
    expect(load('virtual:wisp/theme-css')).toBe(`import ${JSON.stringify(file)};`);
    const css = readFileSync(file, 'utf8');
    expect(css).toContain('--wisp-accent: light-dark(#eeeeee, #5ad19a);');
    expect(css).toContain('--pele-accent: var(--wisp-accent);');
    expect(css).toContain('.wisp-d {');
    expect(warnings.some((w) => w.includes('accent / bg'))).toBe(true);
  });

  it('没有覆盖调色板时直接使用包内提交的令牌文件', () => {
    expect(setup().load('virtual:wisp/theme-css').replaceAll('\\\\', '/')).toMatch(
      /styles\/tokens\.css";\nimport .*styles\/pele\.css";\nimport .*styles\/diagram\.css";$/,
    );
  });

  it('virtual.d.ts 为每个可覆盖组件及虚拟模块声明了类型', () => {
    const dts = readFileSync(new URL('../virtual.d.ts', import.meta.url), 'utf8');
    expect(dts).toContain("declare module 'virtual:wisp/cjk-font-url'");
    for (const n of [...OVERRIDABLE_COMPONENTS, ...OVERRIDABLE_LAYOUTS]) {
      expect(dts, n).toContain(`declare module 'virtual:wisp/components/${n}'`);
    }
  });

  it('cjk-font-url 虚拟模块按 fonts.cjkDisplay 指向原始 CSS 或 codegen 改写版，且 palette 与 font 共用同一 codegen 目录', () => {
    const opt = setup({
      fonts: { cjkDisplay: 'optional' },
      palette: { color: { base: { accent: { light: '#0a5c36', dark: '#5ad19a' } } } },
    });
    const notoFile = join(opt.codegen, 'noto-sans-sc.css');
    const cjkMod = opt.load('virtual:wisp/cjk-font-url');
    expect(cjkMod).toContain(JSON.stringify(`${notoFile.replaceAll('\\', '/')}?url`));
    const notoCss = readFileSync(notoFile, 'utf8');
    expect(notoCss).toContain('font-display:optional');
    expect(notoCss).not.toContain('url(./files/');
    expect(readFileSync(join(opt.codegen, 'theme.css'), 'utf8')).toContain(
      '--wisp-accent: light-dark(#0a5c36, #5ad19a);',
    );

    const fb = setup({ fonts: { cjkDisplay: 'fallback' } });
    expect(readFileSync(join(fb.codegen, 'noto-sans-sc.css'), 'utf8')).toContain(
      'font-display:fallback',
    );

    const swap = setup();
    const swapMod = swap.load('virtual:wisp/cjk-font-url');
    expect(swapMod).toContain('@fontsource-variable/noto-sans-sc/index.css?url');
    expect(swapMod).not.toContain('noto-sans-sc.css');
  });

  it('hasExcalifont 随调色板手写字体栈变化，并控制 Astro Fonts API 是否注册 Excalifont', () => {
    const withHand = setup();
    const cfgDefault = JSON.parse(
      withHand.load('virtual:wisp/config').replace(/^export default |;$/g, ''),
    );
    expect(cfgDefault.hasExcalifont).toBe(true);
    expect(cfgDefault.fonts).toEqual({ cjkDisplay: 'swap' });

    const withoutHand = setup({
      palette: { font: { hand: ['Inter Variable', 'sans-serif'] } },
    });
    const cfgNoHand = JSON.parse(
      withoutHand.load('virtual:wisp/config').replace(/^export default |;$/g, ''),
    );
    expect(cfgNoHand.hasExcalifont).toBe(false);
    expect(withoutHand.updates[0]!.fonts.map((f) => f.cssVariable)).toEqual([
      '--font-wisp-sans',
      '--font-wisp-mono',
    ]);
  });

  it('支持通过 JSON 文件覆盖部分调色板，格式错误时抛出明确错误', () => {
    const dir = mkdtempSync(join(tmpdir(), 'wisp-int-pal-'));
    try {
      const okFile = join(dir, 'palette.json');
      writeFileSync(
        okFile,
        JSON.stringify({ color: { base: { accent: { light: '#0a5c36', dark: '#5ad19a' } } } }),
      );
      const { load, codegen } = setup({ palette: okFile });
      expect(load('virtual:wisp/theme-css')).toBe(
        `import ${JSON.stringify(join(codegen, 'theme.css'))};`,
      );

      const badFile = join(dir, 'bad.json');
      writeFileSync(badFile, JSON.stringify({ color: { base: { accent: '#0a5c36' } } }));
      expect(() => setup({ palette: badFile })).toThrow(/\[astro-wisp\] palette/);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('配置默认值', () => {
    const c = defineWispConfig();
    expect(c.routes).toEqual({
      home: true,
      posts: true,
      archive: true,
      tags: true,
      categories: true,
      about: true,
      rss: true,
      notFound: true,
    });
    expect(c.components).toEqual({});
    expect(c.customCss).toEqual([]);
    expect(c.palette).toBeUndefined();
    expect(() => defineWispConfig({ routes: { about: 'no' as never } })).toThrow(/routes\.about/);
  });
});

/**
 * `.md` 与 `.mdx` 走同一条 Wisp 管线（同一个 processor 的插件），这里在两条路径的用户 rehype 插件末尾
 * 截下 hast 比较。内容覆盖：表格、块级公式、Mermaid、带标题的图片、脚注引用、代码块、中文加粗、含公式的标题。
 */
const PARITY_SOURCE = [
  '段落一，引用文献[^a]。**加粗。**后文，**文字**（括号），文**`code`**字。删除线：~~文字。~~后文，~~内容~~后文。',
  '',
  '## 含公式 $H^{res}$ 的标题',
  '',
  '| 列 A | 列 B |',
  '| ---- | ---- |',
  '| `a b-c` | 1 |',
  '',
  '$$',
  'E = mc^2',
  '$$',
  '',
  '```mermaid',
  'flowchart TD',
  '  A[开始] --> B[结束]',
  '```',
  '',
  "![相位图](https://example.com/phase.png '图 1：相位图')",
  '',
  '```ts',
  'const a = 1;',
  '```',
  '',
  '[^a]: 一条注释。',
  '',
].join('\n');

async function renderBoth(source: string) {
  const { updates } = setup({ mermaid: { strict: true } });
  const { processor, shikiConfig } = updates[0]!.markdown;
  const captured: Record<'md' | 'mdx', string> = { md: '', mdx: '' };
  const capture = (key: 'md' | 'mdx') => () => (tree: HastRoot) => {
    // .md 在用户插件之后才跑 rehype-raw（Mermaid 等是 raw 节点）；先解析成元素再序列化，两边才可比
    // 块之间的换行文本节点两边不同（MDX 不保留），比较时去掉
    captured[key] = toHtml(raw(structuredClone(tree)) as HastRoot).replace(/>\s+</g, '><');
  };
  const withCapture = (key: 'md' | 'mdx') =>
    astroUnified({
      remarkPlugins: processor.options.remarkPlugins,
      rehypePlugins: [...processor.options.rehypePlugins, capture(key)],
    });
  const shared = { syntaxHighlight: 'shiki' as const, shikiConfig };
  const md = await withCapture('md').createRenderer(shared as never);
  await md.render(source, {
    fileURL: pathToFileURL(resolve('/site/src/content/posts/p.md')),
  } as never);
  const mdx = await withCapture('mdx').createMdxRenderer!(
    shared as never,
    { srcDir: pathToFileURL(`${resolve('/site/src')}/`) } as never,
  );
  await mdx.process(source, resolve('/site/src/content/posts/p.mdx'), {});
  return captured;
}

describe('Markdown 管线：.md 与 .mdx 一致', () => {
  it('同一段源码在两条路径上产出相同的 HTML', async () => {
    const { md, mdx } = await renderBoth(PARITY_SOURCE);
    // 抽查关键产物确实存在，避免两边一起缺失时也算“一致”
    expect(md).toContain('class="wisp-table"');
    expect(md).toContain('data-wisp-tab');
    expect(md).toContain('--pele-w:');
    expect(md).toContain('wisp-figure');
    expect(md).toContain('wisp-notes');
    expect(md).toContain('<span class="wisp-tok">b-c</span>');
    expect(md).toContain('id="含公式-hres-的标题"');
    expect(md).toContain('<strong>加粗。</strong>后文');
    expect(md).toContain('<del>文字。</del>后文');
    expect(md).toContain('<del>内容</del>后文');
    expect(md).toContain('<strong>文字</strong>（括号）');
    expect(md).toContain('文<strong><code>code</code></strong>字');
    expect(mdx).toBe(md);
  }, 30_000);

  it('管线指纹进入 astro 配置摘要：主题插件或关键配置变化会让内容层缓存的 .md 渲染结果失效', () => {
    const a = setup();
    const b = setup({ features: { math: false }, site: { lang: 'en' } });
    const digest = pipelineDigest();
    expect(digest).toMatch(/^[0-9a-f]{16}$/);
    // Astro 用 JSON 序列化（content/utils 的 safeStringify）判断配置是否变化；插件函数会被丢掉，
    // 指纹必须以普通值的形式出现在里面
    const jsonA = JSON.stringify(a.updates[0]!.markdown);
    const jsonB = JSON.stringify(b.updates[0]!.markdown);
    expect(jsonA).toContain(digest);
    expect(jsonB).not.toBe(jsonA);
  });
});
