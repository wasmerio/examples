# 配色规范 · paper / mono / normal

站点现在有三套可切换的配色：

- **paper**：水墨画风，宣纸底 + 墨色 + 灰绿
- **mono**：学术科普风，白纸 + 墨蓝 + 学术蓝 / 图表橙
- **normal**：单色极简，纯灰阶，无任何色相

三套都包含亮色与暗色，暗色通过页脚的 Light / Dark 切换。

## 切换配色

在 `src/config.ts` 中修改一个字段，然后重新构建：

```ts
export const THEME_CONFIG = {
  palette: 'mono', // 'paper' | 'mono' | 'normal'
} as const satisfies { palette: PaletteName }
```

修改后：

- 站点 UI 颜色自动切换（`theme.css` 中按 `data-palette` 分组）
- 代码块主题固定为 rose-pine，不随配色切换

## 文件

| 文件 | 内容 |
| --- | --- |
| `palette.html` | paper 的亮/暗双主题预览 + 色板 + 设计说明 |
| `palette.png` | 上面的整页预览图 |
| `home-light.png` / `home-dark.png` | paper 首页实际截图 |
| `preview-post-light.png` / `preview-post-dark.png` | 文章页实际截图（含代码块与目录） |
| `mono-light.png` / `mono-dark.png` | mono 首页实际截图 |
| `normal-light.png` / `normal-dark.png` | normal 首页实际截图 |

## Markdown 提示框（GitHub Alerts）

使用 GitHub 风格的引用块，标题可以省略：

```md
> [!IMPORTANT] 重要的事情
> 有相机的朋友一定要注意了，鸡蛋不要放在一个篮子里。

> [!NOTE]
> 标题省略时使用默认中文标题。
```

支持的类型：

| 类型 | 默认标题 |
| --- | --- |
| `NOTE` | 注意 |
| `TIP` | 提示 |
| `IMPORTANT` | 重要 |
| `WARNING` | 警告 |
| `CAUTION` | 小心 |

实现是一个本地 remark 插件 `scripts/remark-alert.mjs`，通过 `data.hName` / `data.hProperties` 把 blockquote 转成 `div.markdown-alert`，样式在 `markdown.css`。不依赖 `remark-alert` 或 `remark-directive`。

提示框与 `blockquote` 使用同一套排版：无圆角、无图标、左侧竖线。类型只通过左侧竖线颜色区分，颜色固定写在 `markdown.css`，不随 `paper` / `mono` 切换。

默认标题可以通过插件参数覆盖，例如 `remarkAlert({ titles: { important: '必须注意' } })`。

## 实现入口

- `src/config.ts`：`THEME_CONFIG.palette` 选择配色
- `src/styles/theme.css`：只存颜色数据（按配色分组的 `:root` 变量），不写具体样式
- `src/styles/global.css`：字号与字体变量，以及使用 `var()` 的基础样式
- `src/styles/markdown.css`：完整的 Markdown 排版，不依赖 `github-markdown-css`
- `scripts/remark-alert.mjs`：GitHub Alerts 语法插件
- `src/styles/waline.css`：评论区
- `src/components/ThemeToggle.astro`：亮/暗初始化与切换
- `src/layouts/Layout.astro`：按 `theme.css` → `global.css` 顺序引入，并输出 `data-palette`

代码块由 Expressive Code 渲染，固定使用 rose-pine-dawn / rose-pine，与站点配色相互独立。

## 对比度（paper）

| 用途 | 亮色 | 暗色 |
| --- | --- | --- |
| 正文 | 10.3:1 | 10.6:1 |
| 辅助文字 | 5.2:1 | 6.6:1 |
| 灰绿强调 | 4.1:1 | 6.2:1 |
| 标题 | 12.8:1 | 14.5:1 |

## 再加一套配色

在 `src/styles/theme.css` 中复制一组现有配色的颜色变量块，改成新的 `data-palette` 名称，然后把名称加进 `src/config.ts` 的 `PaletteName` 联合类型即可。

新建配色块时注意顺序：不依赖 `data-theme` 的块写在前面，`[data-theme="dark"]` 的变体写在后面，否则暗色会被亮色覆盖。
