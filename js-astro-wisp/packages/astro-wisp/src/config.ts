import { z } from 'astro/zod';

const navItem = z.object({ label: z.string(), href: z.string() });
const socialItem = z.object({
  kind: z.enum(['github', 'x', 'mastodon', 'bluesky', 'email', 'rss', 'link']),
  href: z.string(),
  label: z.string().optional(),
});

export const wispConfigSchema = z.object({
  site: z
    .object({
      title: z.string().default('Wisp'),
      description: z.string().default('专注长文阅读的技术博客'),
      author: z.string().default(''),
      authorGithub: z.url().optional(),
      lang: z.string().default('zh-CN'),
    })
    .prefault({}),
  nav: z.array(navItem).default([
    { label: '归档', href: '/archive/' },
    { label: '标签', href: '/tags/' },
    { label: '关于', href: '/about/' },
  ]),
  social: z.array(socialItem).default([{ kind: 'rss', href: '/rss.xml' }]),
  home: z
    .object({
      featuredCount: z.number().int().min(0).default(3),
      pageSize: z.number().int().min(1).default(10),
    })
    .prefault({}),
  features: z
    .object({
      codeCopy: z.boolean().default(true),
      /**
       * 代码块默认自动换行。false（默认）= 长行横向滚动；读者都可以用代码块题注行的「自动换行」按钮切换，
       * 选择存在 localStorage（wisp-code-wrap），对整页代码块生效。
       */
      codeWrap: z.boolean().default(false),
      lineNumbers: z.boolean().default(true),
      math: z.boolean().default(true),
      mermaid: z.boolean().default(true),
      toc: z.boolean().default(true),
      diagramDownload: z.boolean().default(true),
      codeFold: z
        .object({
          enabled: z.boolean().default(true),
          maxLines: z.number().int().min(1).default(24),
          previewLines: z.number().int().min(1).default(12),
        })
        .prefault({}),
    })
    .prefault({}),
  mermaid: z.object({ strict: z.boolean().default(false) }).prefault({}),
  rss: z.object({ fullText: z.boolean().default(true) }).prefault({}),
  fonts: z
    .object({
      cjkDisplay: z.enum(['swap', 'fallback', 'optional']).default('swap'),
    })
    .prefault({}),
  taxonomy: z.object({ slugMap: z.record(z.string(), z.string()).default({}) }).prefault({}),
  /**
   * 主题注入的路由。设为 false 后可以在 src/pages/ 中自己实现同一路径（Astro 不允许路由冲突）。
   */
  routes: z
    .object({
      home: z.boolean().default(true),
      posts: z.boolean().default(true),
      archive: z.boolean().default(true),
      tags: z.boolean().default(true),
      categories: z.boolean().default(true),
      about: z.boolean().default(true),
      rss: z.boolean().default(true),
      notFound: z.boolean().default(true),
    })
    .prefault({}),
  /**
   * 覆盖主题组件 / 布局：键为组件名（见 OVERRIDABLE），值为相对项目根的路径。
   * 覆盖组件可以 `import Default from 'astro-wisp/components/<Name>.astro'` 包装默认实现。
   */
  components: z.record(z.string(), z.string()).default({}),
  /** 追加的样式文件（相对项目根或包名），在主题样式之后加载、不进 cascade layer，因此总能覆盖主题。 */
  customCss: z.array(z.string()).default([]),
  /** 调色板覆盖：JSON 文件路径（相对项目根），或直接写覆盖对象；与默认调色板深度合并。 */
  palette: z.union([z.string(), z.record(z.string(), z.unknown())]).optional(),
});

export type WispConfig = z.output<typeof wispConfigSchema>;
/** 运行时（virtual:wisp/config）可见的部分：构建期选项不下发到页面。 */
export type WispRuntimeConfig = Omit<WispConfig, 'components' | 'customCss' | 'palette'>;
/** virtual:wisp/config 的类型：站点配置 + 项目根 + astro.config 的 `site`（绝对 URL）。 */
export interface WispRuntime extends WispRuntimeConfig {
  root: string;
  siteUrl: string;
  base: string;
  hasExcalifont: boolean;
}
export type WispConfigInput = DeepPartial<z.input<typeof wispConfigSchema>>;

type DeepPartial<T> = T extends readonly unknown[]
  ? T
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

/**
 * 校验用户配置并与默认值深度合并。对象递归合并，数组整体替换。
 * 校验失败时抛出包含字段路径的错误。
 */
export function defineWispConfig(input: WispConfigInput = {}): WispConfig {
  const result = wispConfigSchema.safeParse(input);
  if (!result.success) {
    const msg = result.error.issues
      .map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('; ');
    throw new Error(`[astro-wisp] 配置无效：${msg}`);
  }
  return result.data;
}
