#!/usr/bin/env bash
# Run all quality gates locally. Mirrors .github/workflows/ci.yml.
# Usage: bash scripts/check.sh [--skip-build] [--verbose]

set -euo pipefail

SKIP_BUILD=false
VERBOSE=false
for arg in "$@"; do
  [[ "$arg" == "--skip-build" ]] && SKIP_BUILD=true
  [[ "$arg" == "--verbose" ]] && VERBOSE=true
done

VERBOSE_FLAG=""
[[ "$VERBOSE" == true ]] && VERBOSE_FLAG="--verbose"

echo "==> astro check (TypeScript)"
pnpm check

if [[ "$SKIP_BUILD" == false ]]; then
  echo "==> Building site"
  pnpm build
fi

echo ""
echo "==> Plain language check"
node scripts/plain-language.mjs $VERBOSE_FLAG

echo ""
echo "==> USWDS compliance check"
node scripts/compliance-check.mjs $VERBOSE_FLAG

echo ""
echo "==> HTML validation"
# The dev-only /internal/ component preview intentionally renders components
# out of document context (multiple <h1> Heroes, etc.) and is excluded.
find dist -name '*.html' -not -path 'dist/internal/*' -print0 | xargs -0 npx html-validate

echo ""
echo "==> Base-path link check"
# The deploy target serves from a subpath, so a link written as "/services/snap/"
# instead of withBase(...) works locally and 404s in production. Rebuild under a
# base path, serve it from under that prefix with directory listings disabled,
# and crawl — this catches both unbased links and nav links pointing at routes
# that were never built. Mirrors the `links` job in ci.yml.
if [[ "$SKIP_BUILD" == false ]]; then
  LINKROOT="$(mktemp -d)"
  mkdir -p "$LINKROOT/base-path-test"
  SITE=https://example.gov/base-path-test/ BASE_PATH=/base-path-test/ pnpm build >/dev/null
  cp -r dist/. "$LINKROOT/base-path-test/"
  npx -y http-server "$LINKROOT" -p 4011 -d false --silent >/dev/null 2>&1 &
  SERVER_PID=$!
  # $! is npx, which spawns http-server as a child and then exits, so by teardown
  # time there is no live parent left to enumerate children from — killing the
  # recorded PID leaves an orphaned http-server holding port 4011, and the next
  # run cannot bind. Kill by port instead, which does not depend on the process
  # tree still being intact.
  stop_server() {
    [[ -n "${SERVER_PID:-}" ]] && kill "$SERVER_PID" 2>/dev/null
    if command -v fuser >/dev/null 2>&1; then
      fuser -k 4011/tcp >/dev/null 2>&1 || true
    fi
    SERVER_PID=""
  }
  trap 'stop_server; rm -rf "$LINKROOT"' EXIT
  ready=false
  for _ in $(seq 1 30); do
    if curl -sf -o /dev/null http://localhost:4011/base-path-test/; then ready=true; break; fi
    sleep 1
  done
  if [[ "$ready" == false ]]; then
    echo "ERROR: static server never came up on port 4011." >&2
    echo "If a previous run was interrupted, an orphaned server may still hold" >&2
    echo "the port: pkill -f 'http-server' and try again." >&2
    exit 1
  fi
  npx -y linkinator http://localhost:4011/base-path-test/ \
    --recurse --skip "^(?!http://localhost)" --skip "tel:" --verbosity error
  stop_server
  # Restore the default-base build so `dist/` matches what the other gates saw.
  pnpm build >/dev/null
else
  echo "  (skipped with --skip-build)"
fi

echo ""
echo "All local checks passed."
echo ""
echo "Note: Accessibility (axe-core) and Lighthouse CI require a running"
echo "browser and are only run in GitHub Actions. To test locally:"
echo "  pnpm preview  then  npx @axe-core/cli http://localhost:4321/"
