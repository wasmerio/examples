#!/usr/bin/env bash
# sync-shared.sh: keep the Tier-1 shared files identical between
# hugo-theme-popular (canonical) and astro-theme-popular. See PARITY.md.
#
# Usage (run from either repo root, with both repos checked out as siblings):
#   ./scripts/sync-shared.sh            # copy Hugo → Astro
#   ./scripts/sync-shared.sh --check    # diff only; exit 1 on drift (use in CI)
set -euo pipefail

# Locate the two repos regardless of which one we're run from.
HERE="$(cd "$(dirname "$0")/.." && pwd)"
if [ -d "$HERE/assets/css" ]; then HUGO="$HERE"; ASTRO="$(dirname "$HERE")/astro-theme-popular";
else ASTRO="$HERE"; HUGO="$(dirname "$HERE")/hugo-theme-popular"; fi

[ -d "$HUGO" ] && [ -d "$ASTRO" ] || { echo "error: expected sibling checkouts of hugo-theme-popular and astro-theme-popular"; exit 2; }

# canonical → astro  (keep this list in sync with PARITY.md Tier 1)
PAIRS=(
  "assets/css/tokens:src/styles/tokens"
  "assets/css/base.css:src/styles/base.css"
  "assets/css/components.css:src/styles/components.css"
  "assets/js:public/scripts"
  "scripts/sessionize-import.py:scripts/sessionize-import.py"
  "scripts/spreadsheet-import.py:scripts/spreadsheet-import.py"
  "scripts/sample-community.xlsx:scripts/sample-community.xlsx"
  "data/setup-questions.json:src/data/setup-questions.json"
  "scripts/setup.py:scripts/setup.py"
  "scripts/starter-content.py:scripts/starter-content.py"
  "scripts/templates:scripts/templates"
  "scripts/tests:scripts/tests"
  "scripts/check-ics.py:scripts/check-ics.py"
  "scripts/check-jsonld.py:scripts/check-jsonld.py"
  "scripts/check-image-alt.py:scripts/check-image-alt.py"
  "CHANGELOG.md:CHANGELOG.md"
  "RELEASING.md:RELEASING.md"
)

MODE="${1:-copy}"
STATUS=0
for pair in "${PAIRS[@]}"; do
  SRC="$HUGO/${pair%%:*}"; DEST="$ASTRO/${pair##*:}"
  if [ "$MODE" = "--check" ]; then
    if ! diff -rq -x __pycache__ "$SRC" "$DEST" >/dev/null 2>&1; then
      echo "DRIFT: ${pair%%:*}  ⇄  ${pair##*:}"
      diff -rq -x __pycache__ "$SRC" "$DEST" || true
      STATUS=1
    fi
  else
    if [ -d "$SRC" ]; then mkdir -p "$DEST"; cp -R "$SRC/." "$DEST/";
    else mkdir -p "$(dirname "$DEST")"; cp "$SRC" "$DEST"; fi
    echo "synced ${pair%%:*} → ${pair##*:}"
  fi
done

[ "$MODE" = "--check" ] && [ $STATUS -eq 0 ] && echo "OK: shared files are identical."
exit $STATUS
