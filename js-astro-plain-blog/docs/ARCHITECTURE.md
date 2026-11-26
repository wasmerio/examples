# 当前架构

PlainBlog 是 Astro 静态站点；`astro.config.mjs` 固定静态输出、尾部斜线、`compressHTML: true`、Shiki 双主题（`vitesse-light`/`vitesse-dark`）、图片透传服务，以及可选 `SITE_URL` 和 `BASE_PATH`。没有客户端路由或 UI 框架。静态主机负责把未知路径以 404 状态返回 `dist/404.html`。

`compressHTML` 明确取 `true` 而不是 Astro 7 的 `'jsx'` 默认：`'jsx'` 会移除模板换行产生的行内空白（例如首页「也可以在」与社交图标之间），使依赖升级变成版式变更。

| 职责                                                           | 唯一 authority                                  | 使用者                                                                                  |
| -------------------------------------------------------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------- |
| 部署 base 前缀                                                 | `src/lib/paths.ts`                              | 布局、面包屑、404、首页、RSS                                                            |
| 站点信息与目录入口                                             | `src/config.ts`                                 | 布局、面包屑、首页                                                                      |
| 内容形状与 frontmatter                                         | `src/content.config.ts` 的 Astro 集合 schema    | Astro 构建；文件名交给 publication 校验                                                 |
| 日期日历语义、平面 slug、draft 排除、日期与 slug 排序、重复 ID | `src/lib/publication.mjs`                       | 内容 schema/loader、首页、文章 `getStaticPaths()`                                       |
| 文档 head 与页面外壳                                           | `src/layouts/Base.astro`                        | 全部路由                                                                                |
| 面包屑与唯一站点目录                                           | `src/components/Breadcrumb.astro`               | Base；按实际 URL 判断当前页；原生 details/summary 管开闭，脚本只处理外点、Esc、Tab 离开 |
| 页面与正文排版                                                 | `src/styles/global.css`                         | 全站及文章、Projects、About 的 `.prose`；浅色和深色只换这一组变量                       |
| 公开文章 RSS                                                   | `src/pages/rss.xml.ts`                          | 复用 publication 的公开结果；不另写筛选规则                                             |
| 社交品牌图标                                                   | `src/lib/social-icons.mjs`（Simple Icons，CC0） | 首页社交链接；只按 config 的 `icon` 字段取用，不从显示文字推断                          |

首页 `src/pages/index.astro` 是唯一聚合页面；文章路由 `src/pages/blog/[slug].astro` 只用发布选择结果生成路径。首页介绍和 Projects/About 引入 `src/content/pages/` 下的 Markdown 组件，而文章走 `src/content/posts/` 集合。HTML 的唯一 h1 由路由生成，Markdown 正文从 h2 开始。静态 404 来自 `src/pages/404.astro`。

## 验证边界

- `tests/publication.test.mjs`：公开 interface 的日期、slug、draft、未来日期、平局排序与重复路径。
- `tests/site.test.mjs`：读取 `dist/` 的真实 HTML，检查页面、链接、元信息、目录、Markdown、图片资源、草稿排除、无假 canonical。
- `tests/build-validation.test.mjs`：在临时项目副本中执行真实构建，验证非法日期/文件名/缺图失败，修改站名到达可见 h1，配置有效站点 URL 后的 canonical，以及 `BASE_PATH` 下的链接前缀与绝对地址。依赖复用本地 node_modules，副本在结束后删除，不修改作者内容或正在预览的 dist。
- `pnpm check` / `pnpm lint`：Astro 类型与诊断；`pnpm format`：Prettier；`pnpm build`：生产产物。
- 浏览器检查与 Node 测试分开，证据和复验步骤见 [VERIFICATION](VERIFICATION.md)。覆盖原生/无 JS 导航、Esc 与焦点、直接访问和后退，以及桌面和 320/390px 下长内容的局部滚动与参考密度。Safari 点击链接时可能先发出失焦事件，因此不在 `focusout` 同步关闭目录；Tab 离开后检查焦点归属，外点与 Esc 仍即时关闭。全站在有传统滚动条的桌面浏览器预留稳定 gutter，让长短文章的 65ch 正文保持同一中心线。窄屏标题只在面包屑单行省略，完整正文标题仍可见；不通过根元素裁切隐藏溢出。
