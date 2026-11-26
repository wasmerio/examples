# AGENTS.md

一个文件就是你的主页 · 365 开源计划 #022。Astro 静态站 + Preact 岛（只有 `/edit`），构建时抓 GitHub 资源并缓存，主页运行时零 JS、零外部请求。

细节分工：**配置字段查 `README.md`，版式查 `DESIGN.md`，页面状态查 `SCREEN_SPEC.md`**。本文件只写那三份之外的东西。

## Commands

- 装依赖 `npm install`（仓库用 npm，有 `package-lock.json`）
- 开发 `npm run dev` = validate + astro dev
- 构建 `npm run build` = validate + fetch（抓 GitHub）+ astro build
- 构建（不联网）`npm run build:offline`
- 测试 `npm test`（vitest run）
- 只校验配置 `npm run validate` — 不构建，只查 YAML 语法与易错字段
- 只重抓资源 `npm run fetch`（`npm run fetch -- --force` 强制重抓缩略图）

没有 lint / format 脚本，也不要新增。版式纪律由 `DESIGN.md` 管，代码风格跟随既有文件的写法。

## Layout

- `src/data/projects.yaml` — **唯一的内容来源**，改这个就是改网站
- `src/data/projects.<code>.yaml` — 翻译覆盖；文件存在即发布该语言，删文件即下线
- `src/lib/` — `schema.ts` 解析、`data.ts` 装配开源节、`merge.ts` 合并翻译、`locales.ts` 语言发现
- `src/components/` — 主页组件，纯 `.astro`，不带 JS
- `src/edit/` — `/edit` 排版台，Preact 岛，站内唯一带 JS 的地方
- `scripts/` — 构建期 Node ESM 脚本（`fetch-github.mjs` / `validate-config.mjs` / `helpers.mjs`）
- `tests/` — vitest

## 生成物：不手改、不提交

`src/data/github.json`、`src/data/assets.json`、`public/shots/`、`public/avatar-auto.*`、`dist/`、`.astro/`

下一次 `npm run build` 会重新生成，手改必被覆盖。要改内容请改 `projects.yaml` 再重跑 fetch。

## Code style

- TypeScript strict（`astro/tsconfigs/strict`），JSX 走 Preact
- 注释写**为什么**，不复述代码在做什么；每条非显然的取舍都要写明理由与代价
- 颜色只用语义令牌（`var(--color-*)` 或 Tailwind 的 `text-(--color-ink-2)`），不写裸 hex
- 单项失败 `console.warn` + 降级，绝不中断构建

## 安静出错的坑

这些**不会抛异常**，只会静默产出坏东西：

- 解析 YAML 一律走 `helpers.mjs` 的 `loadConfig`（固定 CORE_SCHEMA）。用 `yaml.load` 默认 schema 会把未加引号的 `日期: 2024-01-15` 吞成 JS Date，模板拼出来是带时区的乱码，**解析期零告警**。
- og:image 必须反转义 HTML 实体（`parseOgImage`）。GitHub 自定义 Social preview 返回带签名的预签名 URL，`&` 写作 `&amp;`；不还原就 401，整站缩略图消失。
- `opengraph.githubassets.com` 按 IP 限流。抓图已有「整批跑完冷却一个窗口再补抓」的编排（`fetchShotsWithRetry`），别改成就地重试循环。
- `GITHUB_TOKEN` 是**功能必需**而非限额优化：GraphQL 强制鉴权，缺它则「最近更新」回落 `pushed_at`（被 CI 提交顶到今天）、缩略图退回逐仓库抓页面。
- 缩略图 slug 必须与 `schema.ts` 的 `WorkItem.key` 同一公式（`itemKey`）。不一致时页面按 key 查表查不到，缩略图静默消失。
- 排序键优先 `humanUpdated`（默认分支上最后一条非 bot 提交），缺失才回落 `updated`；改排序语义时两处都要看。

## 单一权威：不要重写第二份

别名表、`slugify`、`itemKey`、`selectOpensourceRepos` 只在 `scripts/helpers.mjs`。`src/lib/schema.ts`、`src/lib/data.ts`、`src/edit/importer.ts`、`scripts/*.mjs` 都从那里 import。看到「要不这里也写一份」的念头先停——历史上就是这么散开的。

改开源节列数时连带 `helpers.mjs` 的 `DEFAULT_ALIGN_STEP`，否则末行残缺。

## Testing

- 单元测试 `npm test`（vitest）
- 改 `selectOpensourceRepos`、`parseSite`、编辑器 YAML 往返任一处，**必须同时改 `tests/` 对应用例**——这些函数被构建与编辑器共用
- 提交前跑 `npm run validate && npm test && npm run build`

## Commit

- 默认分支 `main`；push 即部署到 gh-pages，CI 每周日 UTC 23:00 重建刷新 star
- Conventional Commits，**message 与 body 都用英文**
- 按功能相关性拆分，一个 commit 一个逻辑单元；不相关的改动绝不混进同一笔
- **不加任何 AI 署名**：`Co-Authored-By:`、`Generated with`、session 尾注一律不要

## Security

- 不提交任何 token；`GITHUB_TOKEN` 只从环境变量读，Actions 用 `secrets.GITHUB_TOKEN`
- `set:html` 目前只用于用户在 `projects.yaml` 里手写的页脚（是文档化特性，见 README）。别把抓来的数据（仓库名、GitHub 描述等）拼进任何 `set:html` 或未转义的 HTML 属性——那些值来自 GitHub 而非作者本人。
