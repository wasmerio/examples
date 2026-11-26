#!/usr/bin/env bash
# Refresh the read-only upstream snapshot used for diffing.
set -euo pipefail

TAG="${1:-}"
if [ -z "$TAG" ]; then
  echo "usage: pnpm upstream:pull <tag>   e.g. pnpm upstream:pull v2.1.0" >&2
  exit 1
fi

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

echo "Fetching tom2almighty/hugo-narrow@$TAG"
git clone --depth 1 --branch "$TAG" --quiet https://github.com/tom2almighty/hugo-narrow.git "$TMP/src"

DEST="$ROOT/upstream/hugo-narrow"
rm -rf "$DEST"
mkdir -p "$DEST"

for dir in layouts assets data i18n; do
  if [ -d "$TMP/src/$dir" ]; then
    mkdir -p "$DEST/$dir"
    cp -r "$TMP/src/$dir/." "$DEST/$dir/"
  fi
done

echo "Snapshot updated at upstream/hugo-narrow"
echo
echo "Changed files against the working tree:"
git -C "$ROOT" status --short -- upstream/hugo-narrow || true
