# 常见问题

这里汇总了在使用和配置 BlogGPT 过程中最常遇到的问题与排查方法。

## 开发时可见的文章，为什么正式站点找不到？

请检查文章 Frontmatter 中是否设置了 `draft: true`。默认情况下，`posts.showDraftsInDev` 为 `true`，因此在 `pnpm dev` 本地开发时可以看到草稿；而执行 `pnpm build` 正式构建时会自动过滤所有草稿。准备发布时，将 `draft` 设为 `false` 或删掉该字段。发布日期晚于构建时间的文章同样不会出现在正式站点；到达发布时间后，还需要重新构建。

## 切换语言后为什么显示回退语言的正文？

当读者在界面上切换语言（例如从中文切到英文）时，BlogGPT 会按同一目录中的基础文件名查找对应译文；同组内容的 `slug` 也必须保持一致。如果目标译文缺失，会依次尝试无后缀版本、默认语言及其余已配置语言，并提示读者当前正在阅读其他语言的正文。详见[语言与多语言内容](../content/languages.md)。

## 文章里的本地图片或附件为什么返回 404？

如果你在 Markdown 正文中使用 `./photo.jpg` 或 `./notes.zip` 这样的相对路径引用图片或附件，该文章**必须**采用[内容包（Bundle）](../content/bundles.md)形式组织——即建立独立文件夹 `content/posts/<文章名>/index.md`，并将资源放在同一文件夹下。普通的单文件文章（如 `content/posts/my-post.md`）不支持打包同级相对路径下的静态附件。

## Mermaid 图表为什么直接显示成了代码块源码？

请依次检查以下两项：

1. 在 `blog.config.ts` 中，确认 `article.mermaid` 已开启（默认为 `true`）。
2. 检查该文章的 Frontmatter 中是否误设了 `mermaid: false`，并确认代码块使用了正确的 ` ```mermaid ` 标记。

## 修改文章内容后，为什么站内搜索搜不到新内容？

正式站点使用 **Pagefind**，静态索引在执行 `pnpm build` 时生成；修改内容后需要重新构建，`pnpm preview` 才会展示最新结果。`pnpm dev` 则使用开发专用的 JSON 搜索数据，无需预先构建 Pagefind 索引。修改文章后若结果仍是旧内容，可刷新页面再搜索；发布前请运行 `pnpm build && pnpm preview` 验证正式索引。

## 修改 `blog.config.ts` 文案后，为什么切换语言还是显示旧文字？

`blog.config.ts` 中的许多文案字段（如 `site.title`、`author.bio`、`text.*`）支持 `Localized` 多语言对象格式（如 `{ zh: '...', en: '...' }`）。如果你使用了多语言对象但只修改了 `zh` 字段，切换到英文界面时自然仍会读取 `en` 字段的值。请确保同步更新对象中的所有已启用语言。

## 已经修改了 `author.name`，为什么页脚版权栏还是显示旧名字？

侧边栏名片读取的是 `author.name`，而页脚版权信息读取的是 `footer.author`（与作者名片独立配置）。请同时修改 `blog.config.ts` 中的 `footer.author`。

## 文章封面（`image` / `cover`）与分享封面（`shareCover`）有什么区别？

- **正文封面（Frontmatter 中的 `image` 或 `cover`）**：显示在文章详情页顶部以及文章列表、分类卡片中的视觉配图。
- **分享封面（`shareCover`）**：控制自动生成的 Open Graph 分享封面（默认 `1200×630`）。开启后，`og:image` 优先使用生成的卡片；关闭后，才会使用文章的 `image`（若已设置）。

## 为什么分类或标签页面上直接显示了英文 `slug`（如 `web-dev`）？

如果在文章里写了 `categories: [web-dev]`，但没有在 `content/categories/` 目录下创建对应的说明文件，系统只能直接显示 `web-dev` 这个短名称。只需新建 `content/categories/web-dev.md` 并在 Frontmatter 中设置 `title: 前端开发`，即可显示正式的中文名称。

## 为什么点击链接切页后，我自己写的客户端脚本没有重新执行？

为了实现顺滑的阅读体验，BlogGPT 采用了客户端路由无刷新切页（SPA 导航），切换文章时浏览器不会重新触发完整的 `DOMContentLoaded`。如果需要在每次切页后执行自定义脚本，请在 `custom/client.ts` 中导出 `onPageLoad` 函数。详见[自定义 Hook 与扩展](../customization/hooks.md)。

## 启动或构建时报配置错误，应该从哪里排查？

BlogGPT 会在启动和构建时自动校验 `blog.config.ts` 与所有 Markdown 文件的 Frontmatter 类型。请直接查看终端报错信息中指出的文件路径与字段名——常见原因包括文章漏写了必填的 `title` 字段，或者在 `blog.config.ts` 中填写了不支持的枚举值。可对照[配置参考](../config/reference.md)和[Frontmatter 字段说明](../content/frontmatter.md)进行修正。
