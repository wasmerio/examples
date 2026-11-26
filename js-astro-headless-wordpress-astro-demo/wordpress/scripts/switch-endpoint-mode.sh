#!/usr/bin/env bash
# Switch the demo's collection endpoints between Free mode and Pro mode.
#
#   ./wordpress/scripts/switch-endpoint-mode.sh free   # /wp-json/rkx-api-studio/v1/{posts,categories,featured}
#   ./wordpress/scripts/switch-endpoint-mode.sh pro    # /wp-json/rkx/v1/{posts,categories,featured} (needs Pro)
#
# RKX API Studio endpoint slugs are unique per HTTP method across namespaces, so the
# same WordPress site serves these three endpoints either on the default namespace
# (Free mode) or on the Pro custom namespace rkx/v1 (Pro mode), not both at once.
# Safe to run repeatedly: endpoints already in the requested mode are left unchanged.
set -euo pipefail

MODE="${1:-}"
if [ "${MODE}" != "free" ] && [ "${MODE}" != "pro" ]; then
  echo "Usage: $0 free|pro" >&2
  exit 2
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}/../.."

if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi
WP_ADMIN_USER="${WP_ADMIN_USER:-admin}"

docker compose exec -T rkx-hj-wordpress mkdir -p /tmp/seed-data
docker compose cp wordpress/config/free-endpoints.json rkx-hj-wordpress:/tmp/seed-data/free-endpoints.json
docker compose cp wordpress/config/pro-endpoints.json rkx-hj-wordpress:/tmp/seed-data/pro-endpoints.json
docker compose cp wordpress/scripts/switch-endpoint-mode.php rkx-hj-wordpress:/tmp/seed-data/switch-endpoint-mode.php
docker compose exec -T rkx-hj-wordpress wp eval-file /tmp/seed-data/switch-endpoint-mode.php "${MODE}" --user="${WP_ADMIN_USER}" --allow-root
