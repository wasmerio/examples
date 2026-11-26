# 发布 astro-wisp 到 npm

发布只在 GitHub Actions 中进行（`.github/workflows/release.yml`）：推送 `v<版本号>` tag → 质量门禁（`pnpm check`、构建演示站与 starter、tarball 冒烟测试）→ 全部通过后 `npm publish --provenance`。任何一步失败都不会发布。

认证只用 **Trusted Publishing**（GitHub Actions OIDC）：仓库和环境中不保存任何 npm token，npm 自动为每个版本生成 provenance。

当前配置（npmjs.com → astro-wisp → Settings → Trusted Publisher）：GitHub Actions，`xingcanlee` / `astro-wisp` / `release.yml` / 环境 `npm`。`npm` 环境设有人工审批，每次发布需要在 Actions 中批准。

## 首发记录（已完成，仅供参考）

npm 只能给**已存在**的包配置 Trusted Publisher，所以 0.2.0 是用一次性的临时 token（`npm` 环境 secret `NPM_TOKEN`，勾选 Bypass 2FA）由 CI 发布的；发布后已切换到 OIDC，工作流不再读取任何 token。
注意：新包首发时 npm 会先公开一个占位版本 `0.0.0-stage`，几分钟后正式版本才出现。
以下是当时的步骤，迁移到新的包名或 fork 时可以参考：

1. **npm 账号**：注册 <https://www.npmjs.com/signup> 并开启 2FA。
2. **临时 token**：npmjs.com 头像 → **Access Tokens** → **Generate New Token** → **Granular Access Token**：
   - Packages and scopes：**Read and write**，选 **All packages**（包还不存在，无法只选 astro-wisp）
   - 勾选 **Bypass two-factor authentication**（CI 无法输入 2FA 验证码）
   - Expiration：尽量短（如 7 天）
3. **GitHub 环境与 secret**：仓库 **Settings** → **Environments** → **New environment**，名称 `npm`：
   - 可选：**Required reviewers** 填自己（每次发布需要人工批准）；**Deployment branches and tags** 限制为 tag `v*`
   - 在该环境中 **Add environment secret**：名称 `NPM_TOKEN`，值为上一步的 token
4. **合并并打 tag**：把发布分支合并到 main，确认 CI 通过后：

   ```bash
   git checkout main && git pull
   git tag v0.2.0          # 必须与 packages/astro-wisp/package.json 的 version 一致
   git push origin v0.2.0
   ```

   在 Actions 中查看 **Release** 工作流（如设置了 reviewer，需要点 **Approve**）。成功后包出现在 <https://www.npmjs.com/package/astro-wisp>。

## 切换到 Trusted Publishing（首发成功后立即做，已完成）

1. npmjs.com → astro-wisp → **Settings** → **Trusted Publisher** → **GitHub Actions**：

   | 字段                 | 值            |
   | -------------------- | ------------- |
   | Organization or user | `xingcanlee`  |
   | Repository           | `astro-wisp`  |
   | Workflow filename    | `release.yml` |
   | Environment name     | `npm`         |

2. 删除 GitHub 环境中的 `NPM_TOKEN` secret，并在 npmjs.com 撤销那个 token。
3. 同一页 **Publishing access** → **Require two-factor authentication and disallow tokens**。
4. 注意：新的 Trusted Publisher 配置需要在 **2 天内**完成一次成功发布才会生效。如果近期不发新版，可以先发一个 `0.2.1`（例如只改 CHANGELOG），或等要发版时再配置（过期后删除重建即可）。

## 以后每次发布

```bash
# 1. 改 packages/astro-wisp/package.json 的 version，在 packages/astro-wisp/CHANGELOG.md 记录变更
# 2. 同步 template/package.json 中 "astro-wisp" 的版本范围（如 ^0.3.0），pnpm install 更新锁文件
git commit -am "release: astro-wisp v0.3.0"   # 走 PR，CI 通过后合并到 main
git tag v0.3.0 && git push origin v0.3.0
```

工作流会检查 tag 与包版本一致。不需要任何 token。如果 Trusted Publisher 配置与工作流不匹配（仓库、文件名、环境名），npm 会返回 404。

## 不发布 npm 时

站点也可以直接依赖 Git tag（只支持 pnpm）：

```bash
pnpm add "github:xingcanlee/astro-wisp#v0.2.0&path:/packages/astro-wisp"
```

升级时手动改 tag；`astro add astro-wisp`、`create astro --template` 需要 npm 包才能用。
