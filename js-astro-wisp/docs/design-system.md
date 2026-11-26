# Wisp 令牌与第三方样式映射

> **外观规范在 [`DESIGN.md`](../DESIGN.md)**（字体、配色、圆角、间距、组件样式、品牌原则、Do/Don't）。改样式前先读它。
> 本文件只记录令牌的生成与接入机制：CSS 变量命名、Tailwind 接入、Shiki / KaTeX / Pele / 图表的映射。

## 1. 令牌体系

主题的默认调色板 `packages/astro-wisp/design/palette.json` 是唯一来源，由 `pnpm tokens` 生成主题包内的 `src/styles/tokens.css`（生成文件，禁止手改）。站点用 `wisp({ palette })` 覆盖时，集成在构建期用同一套函数生成令牌。

### 1.1 CSS 变量命名

| 前缀                                           | 用途                        | 示例                                                                                    |
| ---------------------------------------------- | --------------------------- | --------------------------------------------------------------------------------------- |
| `--wisp-*`                                     | 基础色                      | `--wisp-bg` `--wisp-fg` `--wisp-muted` `--wisp-accent` `--wisp-border` `--wisp-code-bg` |
| `--wisp-hue-<name>` / `--wisp-hue-<name>-fill` | 8 色分类色（stroke / fill） | `--wisp-hue-blue` `--wisp-hue-blue-fill`                                                |
| `--wisp-sem-<name>` / `--wisp-sem-<name>-fill` | 语义色，是对 hue 的引用     | `--wisp-sem-q: var(--wisp-hue-blue)`                                                    |
| `--wisp-font-*`                                | 字体栈                      | `--wisp-font-sans` `--wisp-font-mono` `--wisp-font-hand`                                |

生成结构：

```css
:root, [data-theme="light"] { color-scheme: light; --wisp-bg: #fcfcfb; ... }
[data-theme="dark"]         { color-scheme: dark;  --wisp-bg: #111214; ... }
/* 语义色只写一次，自动随 hue 切换 */
:root { --wisp-sem-q: var(--wisp-hue-blue); --wisp-sem-q-fill: var(--wisp-hue-blue-fill); ... }
```

`data-theme` 始终由 head 中的内联脚本写入一个确定值（light/dark）。"跟随系统"由脚本解析为具体值，CSS 不需要 media query 分支。

### 1.2 Tailwind v4 接入

```css
@import 'tailwindcss';
@import './tokens.css';
@plugin "@tailwindcss/typography";
@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));

@theme inline {
  --color-bg: var(--wisp-bg);
  --color-fg: var(--wisp-fg);
  --color-muted: var(--wisp-muted);
  --color-accent: var(--wisp-accent);
  --color-border: var(--wisp-border);
  --color-surface: var(--wisp-surface);
  --font-sans: var(--wisp-font-sans);
  --font-mono: var(--wisp-font-mono);
}
```

组件里只写 `bg-bg text-fg border-border` 这类语义类名。**禁止**使用 `text-gray-500` 这类原始色阶，也禁止写 `dark:` 颜色变体，颜色由令牌自动切换。

### 1.3 第三方样式的映射

| 对象     | 映射方式                                                                                                                                                                                                                                                                                                                                                                   |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Shiki    | 双主题 + `defaultColor: false`，`[data-theme=dark] .shiki { color: var(--shiki-dark); background: var(--wisp-code-bg) }`，背景统一使用 `--wisp-code-bg`                                                                                                                                                                                                                    |
| KaTeX    | 继承 `currentColor`，只调整字号（1.05em）和块级公式的外边距                                                                                                                                                                                                                                                                                                                |
| Pele     | `.pele { --pele-bg: transparent; --pele-fg: var(--wisp-fg); --pele-muted: var(--wisp-muted); --pele-line: var(--wisp-muted); --pele-surface: var(--wisp-surface); --pele-surface-alt: var(--wisp-surface-2); --pele-border: var(--wisp-border); --pele-accent: var(--wisp-accent); --pele-font: var(--wisp-font-sans); --pele-radius: 8px; --pele-series-1..8: hue 顺序 }` |
| 图表 SVG | 见 [diagrams.md](./diagrams.md) §3                                                                                                                                                                                                                                                                                                                                         |

Shiki 主题首选 `github-light` / `github-dark`。注释颜色必须在 `--wisp-code-bg` 上达到 4.5:1，不达标时用 transformer 或 CSS 覆盖 `.token-comment`。

## 2. 其余规范

中文排版、布局、组件外观、动效、可访问性底线都已并入 [`DESIGN.md`](../DESIGN.md)：

| 原章节      | DESIGN.md 中的位置                                                |
| ----------- | ----------------------------------------------------------------- |
| §2 中文排版 | Typography（Named Rules：禁止负字距、中文没有斜体、现代中文排版） |
| §3 布局     | Layout                                                            |
| §4 组件外观 | Components                                                        |
| §5 动效     | Components → Home、Running head；Do's and Don'ts                  |
| §6 可访问性 | Colors（对比度）、Do's（焦点环、reduced motion）                  |

`scripts/check-contrast.ts` 仍对 palette.json 做自动对比度检查，作为 CI 的一部分。
