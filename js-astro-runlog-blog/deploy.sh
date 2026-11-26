#!/usr/bin/env bash
set -e

echo "🚀 开始构建 Runlog Lite 静态站点..."
cd "$(dirname "$0")"
pnpm build

# 兼容直接访问 /sitemap.xml 的爬虫与用户
if [ -f dist/sitemap-index.xml ]; then
  cp dist/sitemap-index.xml dist/sitemap.xml
fi

echo "📦 正在同步产物至 Caddy 服务目录 (/var/www/blog)..."
mkdir -p /var/www/blog
rm -rf /var/www/blog/*
cp -r dist/* /var/www/blog/

echo "🔐 设置目录所有权为 caddy:caddy..."
chown -R caddy:caddy /var/www/blog
chmod -R 755 /var/www/blog

echo "🔄 重载 Caddy 服务配置..."
systemctl reload caddy

echo "✅ 部署完成！访问地址:"
echo "   - GitHub Pages: https://dxer.github.io/astro-runlog-blog/"
echo "   - VPS HTTP:     http://107.173.127.244/"
