# 参与 Inkfolio

[English](CONTRIBUTING.md) · [简体中文](CONTRIBUTING.zh.md)

谢谢愿意花时间。Inkfolio 是个小主题，承诺也很窄：一个不会写代码的人，只改 YAML 就能把编辑风 Astro 站跑起来。下面这些规则基本都是从这条承诺推出来的，不是流程洁癖。

## 能帮什么

- **报 bug**：开 issue，给出页面地址、期望结果、实际结果。附一张控制台报错或布局错位的截图，能省一轮来回。
- **提需求**：说清你要发什么内容、现在的模板卡在哪。如果答案是「再加一个配置键」，请顺带说明它该落在哪个文件。
- **改文档**：看不懂的页面就是 bug。尤其是 `src/content/docs/reference/` 下的逐键参考——某个键的行为和文档不一致，同样算 bug。
- **翻译**：中文条目与英文并列存在，缺译、过期译文都欢迎补。
- **发 PR**：一个 PR 只做一件事。

安全问题有单独的流程，见 [SECURITY.zh.md](SECURITY.zh.md)。

## 动手之前

- **涉及视觉的改动先开 issue。** 版式、字号、颜色、动效是这套主题的正事，不是装饰。方向没对齐的重设计会直接拒，不会合并。
- **先搜已有 issue 和 PR**，重复的比省下的更费时间。
- **先看配置面**：如果一个改动可以做成配置键，那它就应该做成配置键。

## 本地环境

Node 20+（推荐 22）。不需要全局工具，命令都走 npm scripts。

```bash
git clone https://github.com/respectevery01/inkfolio.git
cd inkfolio
npm install
npm run dev          # http://localhost:4321
```

想用自己的域名而不是 `example.com`：

```bash
SITE_URL="https://your-domain.test" npm run dev
```

## PR 前置检查

提交前请跑完这三条，评审里最常见的卡点就是构建或 lint 挂了：

```bash
npm run lint         # ESLint
npm run format:check # Prettier，只检查
npm run build        # astro check && astro build && pagefind
```

三条都要过。`npm run build` 同时验证 Pagefind 索引仍能生成——`/search` 依赖它。

## 项目约定

这些约束保证主题还是一套东西。要打破其中一条，先讨论，别绕。

**配置优先。** 站主可能想改的东西，都放进 `site.config.yaml` 或 `src/data/*.yaml`，并给合理默认值。代码读配置，不硬编码站名、导航文字、颜色、统计 ID、友链。

**不引前端框架。** 不用 React/Vue/Svelte，也不上 islands 构建器——就是 Astro 加少量内联脚本，只用在真正需要交互的地方（搜索、主题切换、同意条、弹窗）。必须用库时，本地打包，不走 CDN。

**不请求第三方运行时资源。** 字体、图标、统计、图片要么来自本站，要么不要。Font Awesome 因此本地打包，OG 图因此构建时渲染。

**统计必须过同意。** GA4 与 Clarity 在用户同意前一律不加载；Umami 是常驻的无 cookie 例外。不要加无视这条的埋点。

**双语是两份文件，不是机翻。** `posts/foo.md` 与 `posts-zh/foo.md` 配对，docs、weekly、research 同一规则。语言切换器只对真实存在的配对出现，`hreflang` 也只描述真实配对——绝不要输出会 404 的 alternate。中文要像中文，不要像英文的译文。

**每个新配置键都要配双语文档。** 加到 `src/content/docs/reference/site-config.md`，以及 `src/content/docs-zh/reference/` 下对应页。没有文档的键视为没做完。

**无障碍是设计的一部分。** 焦点态可见、菜单与弹窗可键盘操作、尊重 `prefers-reduced-motion`、两套主题下正文对比度达标。改了组件，请用 Tab 键走一遍。

**示例内容保持脱敏。** 演示站是公开的。不要提交个人数据、真实统计导出、客户名、私有仓库名、token，或任何不适合给陌生人看的东西。演示作者固定为 “Inkfolio”。

**绝不提交密钥。** 不要 `.env`、不要 token、不要带真实账号 ID 的 `wrangler.toml`。发现历史里有泄露凭据，请上报，不要悄悄删掉了事。

## 风格

- **提交信息**：一句话，说清改了什么、为什么。不加 emoji，不加 conventional-commit 前缀。
- **TypeScript**：构建里跑 `astro check`，类型要老实写，别到处 cast。
- **CSS**：用主题样式表里的 token，组件里不要出现魔法色值。
- **内容**：frontmatter 按 README 里写的字段来；不需要侧边目录时用 `toc: false`。
- **注释**：只在代码说不清的地方写，别叙述流水账。

## 评审

评审只看三件事：是否符合承诺（配置驱动、无框架）、有没有文档、能不能过构建。小 PR 通常几天内合并；大幅重设计更可能先被要求开 issue。

## 贡献的授权

Inkfolio 使用 [GPL-3.0](./LICENSE)。提交 PR 即表示你同意以同样条款授权你的贡献。没有 CLA，也不需要转让版权。
