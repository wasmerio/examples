#!/usr/bin/env bash
set -euo pipefail

# Reproducible setup script for The Headless Journal — WordPress + RKX API Studio (Free & Pro)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

cd "${PROJECT_ROOT}"

# Load environment variables from .env if present
if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

WP_PORT="${WORDPRESS_PORT:-8088}"
WP_URL="http://localhost:${WP_PORT}"
WP_ADMIN_USER="${WP_ADMIN_USER:-admin}"
WP_ADMIN_PASSWORD="${WP_ADMIN_PASSWORD:-change_me_local_admin_password}"
WP_ADMIN_EMAIL="${WP_ADMIN_EMAIL:-editor@headless-journal.local}"

echo "1. Starting isolated Docker Compose services..."
docker compose up -d

echo "2. Waiting for WordPress container to become ready on ${WP_URL}..."
for i in {1..30}; do
  if curl -sI "${WP_URL}" >/dev/null 2>&1; then
    break
  fi
  sleep 2
done

echo "3. Ensuring WP-CLI is installed inside the WordPress container..."
docker compose exec -T rkx-hj-wordpress bash -c "which wp >/dev/null 2>&1 || (curl -sO https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar && chmod +x wp-cli.phar && mv wp-cli.phar /usr/local/bin/wp)"

echo "4. Installing WordPress Core (if not already installed)..."
docker compose exec -T rkx-hj-wordpress bash -c "wp core is-installed --allow-root || wp core install --url='${WP_URL}' --title='The Headless Journal' --admin_user='${WP_ADMIN_USER}' --admin_password='${WP_ADMIN_PASSWORD}' --admin_email='${WP_ADMIN_EMAIL}' --skip-email --allow-root"

echo "5. Ensuring RKX API Studio Free and Secure Custom Fields (ACF) are installed and active..."
docker compose exec -T rkx-hj-wordpress bash -c "wp plugin is-installed rkx-api-studio --allow-root && wp plugin activate rkx-api-studio --allow-root || wp plugin install https://downloads.wordpress.org/plugin/rkx-api-studio.1.0.0.zip --activate --allow-root"
docker compose exec -T rkx-hj-wordpress bash -c "wp plugin is-installed secure-custom-fields --allow-root && wp plugin activate secure-custom-fields --allow-root || wp plugin install secure-custom-fields --activate --allow-root"
docker compose exec -T rkx-hj-wordpress bash -c "wp plugin is-installed rkx-api-studio-pro --allow-root && wp plugin activate rkx-api-studio-pro --allow-root || true"

echo "6. Seeding 8 demo articles, categories, authors, tags, featured images, ACF fields, and endpoints..."
docker compose exec -T rkx-hj-wordpress mkdir -p /tmp/seed-data
docker cp src/data/categories.json "$(docker compose ps -q rkx-hj-wordpress):/tmp/seed-data/categories.json"
docker cp src/data/posts.json "$(docker compose ps -q rkx-hj-wordpress):/tmp/seed-data/posts.json"
for svg_file in public/images/articles/*.svg; do
  docker cp "${svg_file}" "$(docker compose ps -q rkx-hj-wordpress):/tmp/seed-data/"
done
for author_svg in public/images/authors/*.svg; do
  docker cp "${author_svg}" "$(docker compose ps -q rkx-hj-wordpress):/tmp/seed-data/author-$(basename "${author_svg}")"
done
docker cp wordpress/scripts/seed-wordpress.php "$(docker compose ps -q rkx-hj-wordpress):/tmp/seed-data/seed-wordpress.php"

docker compose exec -T rkx-hj-wordpress wp eval-file /tmp/seed-data/seed-wordpress.php --allow-root
docker compose exec -T rkx-hj-wordpress chown -R www-data:www-data /var/www/html/wp-content

mkdir -p wordpress/config
docker cp "$(docker compose ps -q rkx-hj-wordpress):/tmp/seed-data/free-endpoints.json" wordpress/config/free-endpoints.json
if docker compose exec -T rkx-hj-wordpress test -f /tmp/seed-data/pro-endpoints.json; then
  docker cp "$(docker compose ps -q rkx-hj-wordpress):/tmp/seed-data/pro-endpoints.json" wordpress/config/pro-endpoints.json
fi

echo "WordPress backend and RKX API Studio endpoints are ready at ${WP_URL}!"
