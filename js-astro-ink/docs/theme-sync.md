# 将主题更新同步到博客

需要 Node.js 22.12.0+、Git 和 pnpm。主题与博客应为两个独立的本地 Git 仓库。

## 日常更新

在主题目录运行（`--target` 相对于当前终端目录）：

```powershell
cd D:\Code\astro-theme-ink
pnpm theme:sync --target ../Blog
pnpm theme:sync --target ../Blog --apply
```

第一条只预览，第二条写入。然后在博客目录验证：

```powershell
cd D:\Code\Blog
pnpm install
pnpm test
pnpm build
git diff
```

预览确认后，将博客修改和 `.theme-sync.json` 一起提交，再按博客原有方式部署。脚本不会自动提交、推送或部署，也不会启动依赖安装。

## 可视化面板

不想手动输入参数时，在主题目录运行：

```powershell
pnpm theme:sync:ui
```

它会启动 `http://127.0.0.1:4175` 的本机面板，默认填入主题目录和相邻的 `Blog` 目录。面板会先运行只读预览，列出 `UPDATE`、`ADD`、`DELETE`、`REVIEW` 和 `CONFLICT`；只有确认过预览结果后，才能点击应用。变更目录或选项后必须重新预览。

点击 `REVIEW` 或 `CONFLICT` 文件名可展开逐行对比。首次同步时，减号是主题原文，加号是博客现有内容。有基准时，面板分别显示「上次主题 → 当前主题」和「上次主题 → 当前博客」，便于分辨上游更新和博客定制。差异在展开时读取，每组最多显示 300 行、约 32K 个字符。较长的差异可用本地编辑器核对。手工编辑文件后，请重新预览。

服务仅绑定 `127.0.0.1`，不会暴露到局域网。可传入 `--source`、`--target`、`--port` 调整默认目录或端口；`--no-open` 只输出地址：

```powershell
pnpm theme:sync:ui --source D:/Code/astro-theme-ink --target D:/Code/Blog --port 4300 --no-open
```

面板调用与命令行相同的同步脚本，保留相同的范围限制、三方合并、备份和写入保护。关闭终端或按 Ctrl+C 即可停止面板。

也可以在博客目录调用已同步的脚本，但必须明确指定主题来源：

```powershell
pnpm theme:sync --source ../astro-theme-ink --target .
pnpm theme:sync --source ../astro-theme-ink --target . --apply
```

建议先提交主题更新。脚本也支持主题尚未提交的文件，会记录来源提交号、工作区状态和实际源码快照，所以连续同步本地修改也能正确计算增量。被 Git 忽略的文件不会作为新增文件同步。

## 同步范围与冲突

- 同步组件、布局、样式、主题工具函数和脚本、测试，以及明确列出的主题路由。
- 不导入示例文章，不覆盖 `src/content/`、个人图片、头像、favicon、环境变量、部署配置或博客独有的项目/条款页面。
- `src/site-config.ts`、About 页面、Astro/内容配置、`package.json`、锁文件在主题发生变化时始终要求人工核对，保留个人信息、域名和定制内容，并补入新增配置项。
- 其他文件比较“上次主题快照、当前博客文件、当前主题文件”。只改主题时更新，只改博客时保留；双方修改时尝试三方合并。删除主题文件时，若博客有定制则停止并提示。
- 任意一个文件有冲突，整次同步都不会写入文件或推进基准。无冲突的文本合并仍需检查并构建验证。

出现 `REVIEW` 或 `CONFLICT` 时，先比较主题与博客文件，将需要的改动合入博客，然后指定已经处理好的文件：

```powershell
pnpm theme:sync --target ../Blog --accept-local src/site-config.ts
pnpm theme:sync --target ../Blog --accept-local src/site-config.ts --allow-dirty --apply
```

`--accept-local` 表示“这个文件已经手工处理，保留博客当前版本并记录新主题基准”。可以重复传入多个路径。即使需要跳过某次主题变动，也必须明确记录这个决定。

若确定整个文件应采用主题版本，可使用 `--accept-theme <路径>`。它会覆盖该文件的博客定制，仅在核对后使用。对主题已删除的文件使用该选项会删除博客对应文件。

写入默认要求博客工作区干净；手工解决冲突会产生未提交改动，因此上述例子明确传入 `--allow-dirty`。该选项只放宽工作区检查，不跳过冲突检查。

## 第一次接入

```powershell
pnpm theme:sync --target ../Blog --init
```

首次没有共同基准，所有现存差异都会列为待核对。逐项使用 `--accept-local` 或 `--accept-theme`，核对完再追加 `--apply`。不应为了消除冲突而一律选择主题版本。基准存在后，脚本拒绝再次 `--init`。

`.theme-sync.json` 保存的是上次主题源码，而不是博客内容；它允许博客长期保留定制，且不依赖两个仓库有共同 Git 历史。请将它纳入博客版本控制，不要手动编辑或删除。

## 备份与恢复

每次写入前，脚本在博客 Git 目录下的 `theme-sync-backups/` 保存将被修改文件的原始字节（Base64；`null` 表示原来不存在），包括旧基准；该目录不会部署到网站。常规写入异常会立即回滚。备份适合恢复写入前的未提交内容；保留这些备份直到更新确认稳定。

正常情况下用独立 Git 提交管理每次同步，回退时一起回退页面改动和 `.theme-sync.json`。脚本默认只预览，重复应用同一主题快照不会产生新修改。
