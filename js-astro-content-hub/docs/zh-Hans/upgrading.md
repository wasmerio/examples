---
title: "升级"
description: "astro-content-hub 模板的使用者如何以最少迁移工作升级到新版本。"
order: 4
---

本指南介绍**模板使用者**(fork 或复制本仓库并重新品牌化的人)如何升级到新
版本而无需痛苦的迁移。若你是维护者、想知道发布流程,参见
[贡献](../../../CONTRIBUTING.md)。

> **简短版。** 模板的设计让 Machinery(路由、i18n、集合接线、同步工具)在上游
> 演进,而你的品牌化内容只存在于一小撮配置/内容文件中。升级就是合并上游 release
> tag 的 `git merge`,再加上一条命令(`npm run check:upstream`),它会精确告诉你
> 哪些文件需要人工决策。无需重新下载 zip,无需手动复制文件。

## 为什么 git merge 在这里可行

仓库被划分为三层(参见[架构](./architecture.md)):

| 层级 | 内容 | 升级预期 |
|---|---|---|
| **Machinery** | `src/lib/`、`src/pages/`、`src/content.config.ts`、`src/env.d.ts`、`scripts/`、`skills/`、`.github/workflows/`、`astro.config.mjs`、`tsconfig.json` | **永远不要手改**这些文件。它们是"唯一正确答案"的代码。 |
| **Your site** | `site.config.ts`(site 块 + products 数组)、`src/config/copy.ts`、`src/components/*`(外观)、`src/styles/*`、`src/content/**` | 你的品牌化在这里。与上游的冲突可预期,可解决。 |
| **Extensions** | `src/components/product-landing/<slug>.astro`、`src/styles/product-themes/<slug>.css`、`src/content/product-info/**`、`examples/*` 示例仓库 | 可选功能;除非 Machinery 接口变更,否则通常无冲突地复制过去。 |

发布版本变更 **Machinery** 文件。你的品牌化变更 **Your-site** 文件。
三方 `git merge` 能干净地协调两侧——大多数版本零冲突合并,因为你的改动与
上游改动落在不同文件上。

## 前置条件(只需一次)

你需要把上游仓库加为 git remote,并拉取你起始版本的 tag:

```bash
git remote add upstream https://github.com/awareride/astro-content-hub.git
git fetch upstream --tags
```

如果你是从 **zip 下载**开始的(没有 git 历史),无法直接 merge。补救很小:
`git init`,提交当前树,再添加 upstream remote 并 fetch。之后每次升级都是一次
merge。参见[从 zip 开始](#从-zip-开始)。

## 升级到新版本

```bash
# 1. 确保工作区干净。
git status

# 2. 创建升级分支(绝不在 main 上直接升级)。
git checkout -b upgrade/v1.1.0

# 3. 合并上游 release tag。
git merge upstream/v1.1.0
```

然后处理结果:

- **无冲突** —— 常见情况。Machinery 已合并,你的站点文件未受影响。运行下面的
  验证,然后合并分支。
- **有冲突** —— 冲突会出现在 **Your-site** 文件(`site.config.ts`、`copy.ts`、
  组件、样式)中,因为两侧都改过它们。这是预期内的;逐个手动解决,在合理的地方
  同时保留你的品牌化和上游改动。Machinery 冲突意味着你改过 Machinery 文件 ——
  参见[如果你改过 Machinery](#如果你改过-machinery)。

### 验证

```bash
npm run check:upstream        # Machinery 漂移守卫(与 release 逐字节比对)
npm run build                 # 类型检查 + 构建必须通过
```

`npm run check:upstream` 将你树中每个 Machinery 文件与**最新 release tag**
(`vX.Y.Z` 形式的 tag;可用 `UPSTREAM_TAG=v1.1.0` 覆盖)比对。它报告:

- `MISSING` —— release 中存在的 Machinery 文件不见了(你重命名或删除了它)。
  git merge **不会**标记这种情况,而它可能静默破坏站点(例如 index 路由消失)。
- `DIFFERS` —— Machinery 文件与 release 不一致(你手改过)。同样,git 可能在
  无冲突的情况下合并,却悄悄丢弃了上游修复。
- `+` 新增 —— 不在 release 中的契约路径文件(使用者的新增)。这些是允许的,
  仅列出供参考。

任何 `MISSING`/`DIFFERS` 都意味着升级完成前需要人工决策。此时命令以非零退出。

> **为什么这很重要。** git merge 擅长合并"同一路径同一文件的编辑",但它无法
> 检测你重命名了 Machinery 文件(上游路径静默消失),也无法检测你在上游变更
> **之前**就改过 Machinery 文件(git 认为它"已合并",上游修复被丢弃)。
> `check:upstream` 通过对照 release 逐字节比对来捕获这两种情况,而不是看
> 合并历史。

## 如果你改过 Machinery

契约是:**Machinery 文件只有一个正确答案,其所有权在模板维护者手中。** 若
`check:upstream` 标记了你改过的 Machinery 文件:

1. 判断你的改动是否是**应提交上游的 bug 修复** —— 若是,向上游模板仓库开
   PR,本地采用上游版本。
2. 或者采用上游版本,把你的改动作为小补丁重新应用(记录在你的升级提交中)。

两条路的目标一致:升级后你的 Machinery 文件与 release 逐字节一致,下一次升级
才能重新干净。

## 从 zip 开始

如果你下载的是 zip 而不是 clone:

```bash
git init
git add -A
git commit -m "initial import of astro-content-hub <version>"
git remote add upstream https://github.com/awareride/astro-content-hub.git
git fetch upstream --tags
```

现在 `git merge upstream/<tag>` 与上文完全一致。第一次升级可能冲突更多,因为
你的历史从 zip 快照开始,但 `npm run check:upstream` 会告诉你哪里需要处理。

## release 包含什么

模板 release 会打 tag(`v1.0.0`、`v1.1.0`、...)。release notes / CHANGELOG 列出:

- **改了什么**(功能、修复)。
- **哪些 Machinery 文件变了** —— 只要你从不手改这些,合并就是例行公事。
- **破坏性变更**(若有)—— 一律是 major 版本号提升,并附迁移步骤。

由于模板遵循 [semver](https://semver.org/) 并保持已文档化契约的向后兼容
(`Product`/`NavLink`/`FooterColumn` 接口、`copy.ts` 的 shape、CSS token 名、
`.prose` 类),你的 `site.config.ts`、`copy.ts` 和样式在跨版本时继续可用。
新功能以**可选字段**或新的 Extension 文件形式加入,不强制迁移。

## 给高频升级者的建议

- **`git rerere`**(reuse recorded resolution)会记住你解决冲突的方式,重复
  升级时自动解决:`git config --global rerere.enabled true`。
- **把升级提交与功能工作分开**。每个版本一个升级分支(`upgrade/v1.1.0`)
  能让合并历史清晰可读。
- **合并前后都跑 `npm run check:upstream`**。合并前:告诉你升级会是例行公事。
  合并后:确认没有丢失任何东西。

## 相关

- [架构](./architecture.md) —— Machinery / Your site / Extensions 层级地图。
- [部署](./deployment.md) —— 将站点指向你的基础设施。
- [编写内容](./authoring.md) —— 在中心内撰写内容。
