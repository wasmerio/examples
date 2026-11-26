#!/bin/bash
# Pushes examples/docs and examples/landing to their standalone mirror repos (astro-ai-docs, astro-ai-landing),
# which exist for `npm create astro` and theme directories. The examples here are the source of truth.
# Usage: scripts/sync-mirrors.sh [commit message]
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MSG="${1:-chore: sync from astro-ai-starter examples}"
sync_one() {
  local ex="$1" mirror="$2" what="$3" other="$4"
  local dst="$ROOT/../$mirror"
  [ -d "$dst/.git" ] || { echo "missing mirror checkout: $dst"; return 1; }
  rsync -a --delete --exclude node_modules --exclude dist --exclude .git --exclude .astro --exclude .env "$ROOT/examples/$ex/" "$dst/"
  # The mirror's README carries a pointer back to the starter; the example's README does not.
  local note="> This template lives in [astro-ai-starter](https://github.com/fengyiqicoder/astro-ai-starter) as \`examples/$ex\`, next to a blog and $other with the same AI wiring. This repository is a standalone copy for \`npm create astro\` and theme directories, synced from there."
  if ! grep -q "lives in \[astro-ai-starter\]" "$dst/README.md"; then
    { head -n 1 "$dst/README.md"; echo; echo "$note"; echo; tail -n +2 "$dst/README.md"; } > "$dst/README.tmp" && mv "$dst/README.tmp" "$dst/README.md"
  fi
  (cd "$dst" && git add -A && (git diff --cached --quiet || git commit -q -m "$MSG") && git push -q && echo "synced $mirror")
}
sync_one docs astro-ai-docs "docs" "a landing page"
sync_one landing astro-ai-landing "landing page" "a docs site"
