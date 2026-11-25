# Starter 发布维护

starter 是主题源码的独立导出产物。`scripts/export-starter.mjs` 使用白名单复制运行代码和写作工具，叠加 `starter/files/` 和两个配置模板。主题本身的 `src/`、演示文章、配置、文档 workspace 和原 CI 都继续使用原有文件。Vercel / Netlify 配置仅存在于导出的 starter 中，不参与当前演示站和文档站部署。

## 首次启用

1. 在 GitHub 创建一个**专用的公开空仓库**，例如 `Raincarnator/astro-theme-BlogGPT-starter`，默认分支设为 `main`。不要连接现有的演示站或文档站到这个仓库。
2. 在该仓库 Settings → General 勾选 **Template repository**。发布脚本检查仓库为公开模板、不是 fork，且默认分支与发布分支一致；不满足条件就停止。
3. 在主题源仓库 Settings → Secrets and variables → Actions 添加变量 `STARTER_REPOSITORY`，值为目标 `owner/repository`。如目标默认分支不是 `main`，再配置 `STARTER_BRANCH`。
4. 添加 Actions secret `STARTER_TOKEN`：使用仅能访问该目标仓库的 fine-grained PAT，授予 **Contents: Read and write**。无需授予文档仓库或部署平台访问权限。源仓库的 `GITHUB_TOKEN` 无法跨仓库写入。
5. 将此功能合入源仓库 `main` 后运行 **Starter** workflow（也可手动 Run workflow）。目标仓库及凭据均由维护者配置，脚本不会创建仓库或修改仓库设置。

未设置 `STARTER_REPOSITORY` 时，只验证并提供构建成功的 `starter-source` artifact，不发布。默认按钮链接使用 `<源仓库名称>-starter`；启用后自动采用配置的目标仓库。目标必须允许上述 token 普通推送；如有分支保护，请按自己的仓库策略为发布身份配置权限。

## 同步规则

每次源仓库 `main` push 自动验证并发布；PR 只验证。独立 job 在 runner 临时目录中安装导出的 starter，执行 frozen-lockfile 安装、lint、完整构建和输出检查。通过后发布的是构建前打包的源码，因此不包含 node_modules、dist 或缓存。

发布以目标分支为父提交，删除旧文件并同步完整导出内容；过时文件会自动移除。普通 fast-forward 推送保留历史，遇到并发改动或权限错误会失败，不强推。文件完全一致时不产生新提交。提交信息记录源仓库和完整源 commit SHA。专用 starter 仓库的手动文件改动会在下次同步被覆盖，请在本源仓库修改。通过模板创建的个人博客仓库不会被此流程更新。

模板初始只有一篇欢迎文章、一个关于页、空分类与标签目录，友链仅包含 BlogGPT 官方文档站。默认中文；使用者可更改语言。主题运行源码和依赖版本来自源仓库，不维护另一份运行实现。锁文件保留主项目精确依赖解析，仅去掉 docs importer；可能包含 pnpm 不会安装的未使用锁记录。

## 本地导出

```sh
pnpm starter:export ../bloggpt-starter
# 可指定不同目标，用于生成对应的模板与部署按钮链接
pnpm starter:export ../another-starter owner/starter-repository
```

导出路径必须位于本仓库之外、尚不存在且父目录已存在，避免影响源码检查或把 starter 源码混入演示站的 `dist/`。不清空既有输出，请使用新目录。进入导出目录，独立执行 `pnpm install --frozen-lockfile && pnpm build`。

部署按钮遵循 [Vercel Deploy Button](https://vercel.com/docs/deploy-button) 和 [Netlify 模板部署](https://docs.netlify.com/deploy/create-deploys/) 的官方接口。托管平台会复制 starter 并使用随附配置部署静态 `dist/`。正式域名自动从平台环境推导；自定义域名需要用户设置 `SITE_URL` 后重新构建。GitHub 模板开关见 [创建模板仓库](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-template-repository)。
