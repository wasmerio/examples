<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Nameless Blog](https://github.com/rasrc78/astro-nameless-blog) Astro theme by rasrc78, copied from commit `932de196973f433c51332585a78c2164f2ef4472` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-nameless-blog.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - None. The theme builds as published.
- **Environment variables:** None.
- **Credit:** theme by [rasrc78](https://github.com/rasrc78), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# NamelessBlog

个人博客，基于 [Astro](https://astro.build/) 框架编写。

## 基本配置

主要可修改的配置存储在 `/src/site.config.ts` 内：

- title: 网站标题
- description: 网站描述，只用于`<meta>`标签
- copyright: 网站底部版权，可使用html填写
- defaultTheme: 默认配色主题，虽然目前只写了`dark`
- titleSuffix: 是否在文章标题后加上网站标题
- postAppendTitle: 是否默认在文章开头添加frontmatter内的标题

文章frontmatter支持的属性：

- title：文章标题
- description: 文章摘要或描述
- pubDate: 文章发布日期，推荐使用ISO 8601格式或时间戳

其他：

- /pubilc/favicon.ico: 网站图标
- /content/blog: 博客放这里，支持Markdown
- /content/about.md: 关于页放这里，同上

## 不足

- 网站设计很烂，或者说好听点叫简洁
- 对Typescript不熟悉，所以基本都用Javascript编写脚本，很多ts的类型错误没处理

## TODO

- [x] fix: 移动端标题和日期分离
- [x] fix: 限制标题长度
- [ ] feat: 最后编辑日期
- [x] feat: 返回顶部按钮
- [ ] feat: 文章小标题导航
- [ ] feat: 多语言
- [ ] style: Footer好难看


------

只有我一人在用，所以README就随便写写吧。
