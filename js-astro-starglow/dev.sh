#!/usr/bin/env bash
# Docker-only dev entry point: the host needs nothing but Docker.
set -euo pipefail
cd "$(dirname "$0")"

# Not $UID: it is readonly and not exported in bash/zsh.
HOST_UID="$(id -u)"
HOST_GID="$(id -g)"
PROJECT_DIR="$(pwd -P)"
export HOST_UID HOST_GID PROJECT_DIR

run() { docker compose run --rm --build --quiet-build dev "$@"; }
serve() { docker compose run --rm --build --quiet-build --service-ports dev "$@"; }

install='pnpm install --frozen-lockfile'

ACTIONLINT_IMAGE="rhysd/actionlint:1.7.12@sha256:b1934ee5f1c509618f2508e6eb47ee0d3520686341fec936f3b79331f9315667"
ZIZMOR_IMAGE="ghcr.io/zizmorcore/zizmor:1.33.1@sha256:ecd3ffe6158de1322e05a044ed43749bee12b1dccb7e1a7859bc6ac4b2a1c516"
# Same lychee version as `lycheeVersion` in .github/actions/site-checks/action.yml.
LYCHEE_IMAGE="lycheeverse/lychee:0.24.2@sha256:e2d19e57cf6ab037026f20b8e449a1f30d9d7f81eef4194763aab2eab20bd28d"

# Offline link and anchor check over dist/. Flags come from lychee.toml.
links() {
  if [ ! -f dist/index.html ]; then
    echo "Error: dist/index.html not found. Run ./dev.sh build first." >&2
    exit 1
  fi
  local base="${BASE_PATH:-}"
  base="${base%/}"
  docker run --rm --init -u "$HOST_UID:$HOST_GID" -v "$PROJECT_DIR:/repo:ro" \
    -v "$PROJECT_DIR/dist:/site$base:ro" -w /repo \
    "$LYCHEE_IMAGE" --root-dir /site 'dist/**/*.html'
}

# actionlint and zizmor over .github/. Both always run; fails if either did.
workflows() {
  local status=0
  docker run --rm -u "$HOST_UID:$HOST_GID" -v "$PROJECT_DIR:/repo:ro" -w /repo \
    "$ACTIONLINT_IMAGE" -no-color || status=1
  docker run --rm -u "$HOST_UID:$HOST_GID" -v "$PROJECT_DIR:/repo:ro" -w /repo \
    "$ZIZMOR_IMAGE" --offline --no-progress --persona=auditor /repo || status=1
  return "$status"
}

# Scaffolds a draft from templates/. Runs on the host and needs GNU date. Folder
# year and post date come from one clock read in the site timezone, so they
# always agree with the check in src/utils/postEntryId.ts.
new_content() {
  local usage='Usage: ./dev.sh new <post|note|project> <slug>'
  local type="${1:-}" slug="${2:-}"
  case "$type" in
    post | note | project) ;;
    *)
      echo "$usage" >&2
      exit 2
      ;;
  esac
  if [ -z "$slug" ] || [ "$#" -gt 2 ]; then
    echo "$usage" >&2
    exit 2
  fi
  if ! [[ "$slug" =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]]; then
    echo "Error: slug must use lowercase letters, digits and single hyphens (e.g. my-first-post)." >&2
    exit 2
  fi

  # `date -d @epoch` and `%:z` are GNU coreutils extensions (not macOS or BSD date).
  if ! date --version >/dev/null 2>&1; then
    echo "Error: ./dev.sh new needs GNU date (GNU coreutils). On macOS, install coreutils and put its gnubin directory first in PATH." >&2
    exit 1
  fi

  local zone epoch year stamp dir
  zone="$(sed -n 's/^[[:space:]]*timezone:[[:space:]]*"\([^"]*\)".*/\1/p' starglow.config.ts | head -n 1)"
  if [ -z "$zone" ]; then
    echo "Error: no timezone found in starglow.config.ts (expected a line like: timezone: \"Europe/Berlin\")." >&2
    exit 1
  fi
  # An unknown zone makes date fall back to UTC without a word, so check it exists.
  local zonedir known=""
  if [[ "$zone" =~ ^[A-Za-z0-9_+-]+(/[A-Za-z0-9_+-]+)*$ ]]; then
    for zonedir in "${TZDIR:-}" /usr/share/zoneinfo /usr/share/lib/zoneinfo /etc/zoneinfo; do
      if [ -n "$zonedir" ] && [ -f "$zonedir/$zone" ]; then
        known=yes
        break
      fi
    done
  fi
  if [ -z "$known" ]; then
    echo "Error: timezone \"$zone\" from starglow.config.ts is not in the system zoneinfo (is tzdata installed?)." >&2
    exit 1
  fi
  epoch="$(date +%s)"
  year="$(TZ="$zone" date -d "@$epoch" +%Y)"
  stamp="$(TZ="$zone" date -d "@$epoch" +%Y-%m-%dT%H:%M:%S%:z)"

  case "$type" in
    post) dir="src/content/blog/$year" ;;
    note) dir="src/content/notes/$year" ;;
    project) dir="src/content/projects" ;;
  esac

  local ext
  for ext in md mdx; do
    if [ -e "$dir/$slug.$ext" ]; then
      echo "Error: $dir/$slug.$ext already exists. Nothing was overwritten." >&2
      exit 1
    fi
  done

  if [ ! -f "templates/$type.md" ]; then
    echo "Error: templates/$type.md not found. Nothing was created." >&2
    exit 1
  fi

  local target="$dir/$slug.md"
  mkdir -p "$dir"
  sed -e "s/^pubDatetime: .*/pubDatetime: $stamp/" -e 's/^draft: .*/draft: true/' \
    "templates/$type.md" >"$target"
  echo "Created $target (draft: true). Set draft: false when it is ready to publish."
}

case "${1:-dev}" in
  dev) serve sh -c "$install && pnpm exec astro dev --host 0.0.0.0 --port 4321" ;;
  build) run sh -c "$install && pnpm build" ;;
  check) run sh -c "$install && pnpm exec astro check" ;;
  preview) serve sh -c "pnpm exec astro preview --host 0.0.0.0 --port 4321" ;;
  shell) serve bash ;;
  ci)
    # The pull-request check set in the same order as .github/actions/site-checks.
    run sh -c "$install && pnpm run format:check && pnpm run lint && pnpm exec astro check && pnpm run build:site"
    links
    run sh -c "pnpm run verify && pnpm run markers"
    ;;
  links) links ;;
  workflows) workflows ;;
  new)
    shift
    new_content "$@"
    ;;
  pnpm)
    shift
    run pnpm "$@"
    ;;
  *)
    echo "usage: ./dev.sh [dev|build|check|preview|shell|ci|links|workflows|new <post|note|project> <slug>|pnpm <args>]" >&2
    exit 2
    ;;
esac
