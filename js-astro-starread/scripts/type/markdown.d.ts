/**
 * Starread Markdown Syntax Extension Type Declarations
 *
 * 星阅主题 Markdown 语法扩展类型声明
 *
 * scripts/markdown/ 下的语法插件统一实现本文件的类型契约：
 * 插件以 satteri mdast 访问者（visitor）形态编写，注册进 SYNTAX_EXTENSIONS
 * 注册表后，由 gfmSyntax.js 默认导出的 Astro 集成在 astro:config:done 钩子
 * 推入默认 satteri 处理器的 mdastPlugins，无需安装任何 remark 依赖。
 *
 * 新增语法扩展的步骤：
 *   1. 在 scripts/markdown/ 编写插件：{ name, <节点类型>(node, ctx) }，
 *      需要渲染自定义 HTML 时给节点设置 data.hName / data.hProperties，
 *      自定义节点用 type: 'custom'；
 *   2. 注册到 gfmSyntax.js 的 SYNTAX_EXTENSIONS 注册表；
 *   3. 在 starread.config.ts 的 markdown 配置段与本目录 config.d.ts 的
 *      MarkdownConfig 中追加开关字段；
 *   4. 在 astro.config.mjs 给 starreadMarkdownIntegration 传入对应 options。
 */

import type { AstroIntegration } from 'astro';

/** mdast 节点（satteri JS 侧为 arena 代理节点，结构遵循 mdast 规范） */
export type MdastNode = Record<string, any>;

/**
 * satteri mdast 访问者上下文。
 * 所有变异方法只记录到变更队列，落盘前 JS 侧读到的仍是旧值：
 * 务必先完成全部读取，再统一发出变更，且不要对即将被移除的
 * 节点/子树再做操作（会被丢弃并告警）。
 */
export interface MdastVisitorContext {
  /** 当前文档 URL（compile 的 fileURL 选项），可用于推断文章语言 */
  fileURL: URL | undefined;
  /** 文档级数据袋，跨插件与 mdast→hast 阶段共享 */
  data: Record<string, unknown>;
  /** 移除节点 */
  removeNode(node: MdastNode): void;
  /** 将节点替换为一个或多个节点（空数组等同移除） */
  replaceNode(node: MdastNode, content: MdastNode | MdastNode[]): void;
  /** 在节点的子级开头插入 */
  prependChild(node: MdastNode, child: MdastNode | MdastNode[]): void;
  /** 在节点的子级末尾追加 */
  appendChild(node: MdastNode, child: MdastNode | MdastNode[]): void;
  /** 在指定下标插入（越界自动钳制到首/尾） */
  insertChildAt(node: MdastNode, index: number, child: MdastNode | MdastNode[]): void;
  /** 修改节点属性；key 为 "data" 时接受任意对象（hName/hProperties 等），null 清空 */
  setProperty(node: MdastNode, key: string, value: unknown): void;
  /** 节点及其后代的文本内容（类似 mdast-util-to-string） */
  textContent(node: MdastNode): string;
}

/** satteri mdast 语法插件：按需实现各节点类型的访问者 */
export interface MdastSyntaxPlugin {
  /** 插件名，用于诊断定位 */
  name: string;
  [nodeType: string]:
    | string
    | ((node: MdastNode, ctx: MdastVisitorContext) => void | undefined | null)
    | undefined;
}

/** 语法扩展注册表条目（gfmSyntax.js 的 SYNTAX_EXTENSIONS） */
export interface MarkdownSyntaxExtension {
  /** 开关字段名，对应 starread.config.ts 的 markdown 配置 */
  key: string;
  /** 是否启用 */
  enabled: (options: Record<string, unknown>) => boolean;
  /** 插件实现 */
  plugin: MdastSyntaxPlugin;
}

/** 警告框类型定义（图标、多语言标题与 Tailwind 配色类） */
export interface AlertTypeConfig {
  /** Octicon 图标类名 */
  octicon: string;
  /** Octicon 图标 path 数据（viewBox 0 0 16 16） */
  path: string;
  /** 外框 Tailwind 配色类（含 dark: 深色模式） */
  containerClass: string;
  /** 标题行与图标的 Tailwind 配色类（含 dark: 深色模式） */
  titleClass: string;
  /** 多语言标题 */
  labels: Record<'zh' | 'en' | 'ja' | 'ko' | 'ru', string>;
}

/** 支持的警告框类型集合，key 为小写类型名（note/tip/important/warning/caution） */
export type AlertTypes = Record<string, AlertTypeConfig>;

/** 集成选项，与 starread.config.ts 的 markdown 配置段对应 */
export interface StarreadMarkdownOptions {
  /** 是否启用 GFM 风味警告框（> [!note] / [!tip] / [!important] / [!warning] / [!caution]） */
  alert?: boolean;
}

/**
 * 默认导出：Astro 集成，把启用的语法插件注册进默认 satteri 处理器。
 * 在 astro.config.mjs 的 integrations 中使用。
 */
export default function starreadMarkdownIntegration(
  options?: StarreadMarkdownOptions
): AstroIntegration;
