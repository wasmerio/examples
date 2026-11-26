#!/usr/bin/env bash
# 发布前冒烟测试：把 packages/astro-wisp 打成 tarball，装进工作区外的 starter 副本，
# 验证用户真实的安装方式（主题在 node_modules 中、pnpm 严格依赖）下 build 与 astro check 都通过。
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

(cd "$ROOT/packages/astro-wisp" && pnpm pack --pack-destination "$WORK" >/dev/null)
TARBALL="$(ls "$WORK"/astro-wisp-*.tgz)"
mkdir "$WORK/site"
(cd "$ROOT/template" && tar cf - --exclude=node_modules --exclude=dist --exclude=.astro .) | (cd "$WORK/site" && tar xf -)

node -e '
  const fs = require("fs");
  const p = process.argv[1] + "/package.json";
  const pkg = JSON.parse(fs.readFileSync(p, "utf8"));
  pkg.dependencies["astro-wisp"] = "file:" + process.argv[2];
  fs.writeFileSync(p, JSON.stringify(pkg, null, 2));
' "$WORK/site" "$TARBALL"

cd "$WORK/site"
pnpm install --no-frozen-lockfile
pnpm build
pnpm exec astro check
echo "smoke-pack: OK ($(basename "$TARBALL"))"
