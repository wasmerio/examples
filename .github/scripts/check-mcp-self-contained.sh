#!/usr/bin/env bash
# Changed MCP template folders must carry their own HTTP server and must not
# climb out of the folder with a parent path. `...` in the copied source is
# not a path.
set -euo pipefail

base=${1:-}
head=${2:-}
if [[ -z "$base" || -z "$head" ]]; then
  echo "No pull request range. Skipping MCP self-contained check."
  exit 0
fi

root=$(cd "$(dirname "$0")/../.." && pwd)
cd "$root"

folders=$(
  git diff --name-only --no-renames "$base...$head" |
    awk -F/ '$1 ~ /-mcp-/ { print $1 }' |
    sort -u
)
if [[ -z "$folders" ]]; then
  echo "No MCP template folders changed."
  exit 0
fi

# shellcheck disable=SC2086
node scripts/sync-mcp-http.mjs --check $folders

status=0
while IFS= read -r folder; do
  [[ -n "$folder" ]] || continue
  if grep -R -n -F '../' "$folder" --exclude-dir=node_modules --exclude-dir=.venv --exclude-dir=.anybuild; then
    echo "Parent path in ${folder}. A catalog deploy builds only this folder."
    status=1
  fi
done <<< "$folders"

exit "$status"
