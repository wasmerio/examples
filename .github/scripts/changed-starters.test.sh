#!/usr/bin/env bash
set -euo pipefail

script=$(cd "$(dirname "$0")" && pwd)/changed-starters.sh
fixture=$(mktemp -d)
trap 'rm -rf "$fixture"' EXIT
cd "$fixture"
git init -q
git config user.email starter-ci@example.invalid
git config user.name "Starter CI"

mkdir -p js-existing/src php-removed skip-js-demo fail-php-demo
printf '%s\n' before > js-existing/src/file.js
touch js-existing/src/removed.js php-removed/composer.json skip-js-demo/package.json fail-php-demo/composer.json
git add .
git commit -qm base
common=$(git rev-parse HEAD)

mkdir -p python-base-only
touch python-base-only/requirements.txt
git add .
git commit -qm 'unrelated base branch change'
base=$(git rev-parse HEAD)
git checkout --quiet --detach "$common"

mkdir -p python-added jekyll .github scripts _shared/starter-ui
touch python-added/pyproject.toml python-added/app.py jekyll/Gemfile Anybuild.js-existing
touch .github/notes.md scripts/other.mjs _shared/starter-ui/wasmer-starter-ui.js
printf '%s\n' after > js-existing/src/file.js
printf '%s\n' changed > skip-js-demo/package.json
printf '%s\n' changed > fail-php-demo/composer.json
git rm -q js-existing/src/removed.js php-removed/composer.json
git add .
git commit -qm 'multiple starter changes'

assert_starters() {
  local description=$1 expected=$2 actual
  actual=$(bash "$script" "$base" HEAD)
  if [[ $actual != "$expected" ]]; then
    printf 'FAIL %s\nExpected:\n%s\nFound:\n%s\n' "$description" "$expected" "$actual" >&2
    exit 1
  fi
  printf 'PASS %s\n' "$description"
}

assert_starters 'Select changed folders once and skip removed, excluded and base-only projects' \
  $'_shared/starter-ui\njekyll\njs-existing\npython-added'

git checkout --quiet --detach "$base"
touch README.md
git add README.md
git commit -qm 'root docs only'
assert_starters 'Skip root documentation changes' ''

printf '%s\n' changed > Anybuild.js-existing
mkdir -p scripts
touch scripts/sync-starter-ui.mjs
git add .
git commit -qm 'root build config and unused shared script'
assert_starters 'Map a standalone root Anybuild file to its starter' 'js-existing'

git checkout --quiet --detach "$base"
mkdir -p js-mcp-time-mcp python-hello _shared/mcp-http/js
printf '%s\n' '{}' > js-mcp-time-mcp/package.json
printf '%s\n' 'print(1)' > python-hello/main.py
printf '%s\n' 'kind: wasmer.io/App.v0' > python-hello/app.yaml
printf '%s\n' shared > _shared/mcp-http/js/app.mjs
git add js-mcp-time-mcp/package.json
git commit -qm 'one mcp template'
assert_starters 'Build only the changed mcp template' 'js-mcp-time-mcp'

mcp_base=$(git rev-parse HEAD)
printf '%s\n' shared2 > _shared/mcp-http/js/app.mjs
git add _shared/mcp-http/js/app.mjs
git commit -qm 'shared mcp http only'
shared_actual=$(bash "$script" "$mcp_base" HEAD)
if [[ -n $shared_actual ]]; then
  printf 'FAIL shared mcp http change selected:\n%s\n' "$shared_actual" >&2
  exit 1
fi
printf 'PASS %s\n' 'Do not rebuild every starter when shared mcp http changes'
