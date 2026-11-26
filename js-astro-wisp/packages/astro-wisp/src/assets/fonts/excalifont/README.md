# Excalifont

手绘风格图表（Excalidraw）的拉丁字形。文件原样取自 `@excalidraw/excalidraw@0.18.1` 的
`dist/prod/fonts/Excalifont/`（按 unicode-range 分片）。文件按子集重命名，与上游文件的对应关系：

| 文件                            | 上游文件                                                    |
| ------------------------------- | ----------------------------------------------------------- |
| `excalifont-latin.woff2`        | `Excalifont-Regular-a88b72a24fb54c9f94e3b5fdaa7481c9.woff2` |
| `excalifont-latin-ext.woff2`    | `Excalifont-Regular-be310b9bcd4f1a43f571c46df7809174.woff2` |
| `excalifont-cyrillic.woff2`     | `Excalifont-Regular-b9dcf9d2e50a1eaf42fc664b50a3fd0d.woff2` |
| `excalifont-greek.woff2`        | `Excalifont-Regular-41b173a47b57366892116a575a43e2b6.woff2` |
| `excalifont-diacritics.woff2`   | `Excalifont-Regular-3f2c5db56cc93c5a6873b1361d730c16.woff2` |
| `excalifont-cyrillic-ext.woff2` | `Excalifont-Regular-349fac6ca4700ffec595a7150a0d1e1d.woff2` |
| `excalifont-combining.woff2`    | `Excalifont-Regular-623ccf21b21ef6b3a0d87738f77eb071.woff2` |

unicode-range 与 Excalidraw 自身一致，见 `src/fonts.ts`。由 Astro Fonts API（local provider）注册。

Excalifont 由 Excalidraw 发布，许可证为 SIL Open Font License 1.1：<https://github.com/excalidraw/excalifont>。
随主题分发，避免站点为了一个字体安装体积很大的 `@excalidraw/excalidraw`。
