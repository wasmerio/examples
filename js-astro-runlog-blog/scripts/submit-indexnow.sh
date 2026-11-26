#!/usr/bin/env bash
set -e

# 优先从环境变量读取，否则从 config.yaml 解析 host
CONFIG_URL=$(grep -A 5 '^site:' config.yaml 2>/dev/null | grep 'url:' | head -n 1 | awk '{print $2}' | tr -d '"'\''')
HOST="${INDEXNOW_HOST:-$(echo "$CONFIG_URL" | sed -E 's|^https?://||; s|/.*$||')}"
KEY="${INDEXNOW_KEY:-08559e11575db2186177f4d7a6504e83}"
KEY_LOC="https://${HOST}/${KEY}.txt"

SITEMAP_FILE="dist/sitemap-0.xml"
if [ ! -f "$SITEMAP_FILE" ]; then
  SITEMAP_FILE="dist/sitemap.xml"
fi
if [ ! -f "$SITEMAP_FILE" ]; then
  SITEMAP_FILE="/var/www/blog/sitemap-0.xml"
fi

if [ ! -f "$SITEMAP_FILE" ]; then
  echo "⚠️ 未找到生成的 sitemap 文件，请先执行 pnpm build。"
  exit 1
fi

TMP_URLS=$(mktemp)
python3 -c "
import xml.etree.ElementTree as ET
tree = ET.parse('${SITEMAP_FILE}')
root = tree.getroot()
with open('${TMP_URLS}', 'w') as f:
    for child in root:
        loc = child.find('{http://www.sitemaps.org/schemas/sitemap/0.9}loc')
        if loc is not None:
            f.write(loc.text + '\n')
"

COUNT=$(wc -l < "${TMP_URLS}")
echo "🚀 正在向 IndexNow (Bing / Copilot / Amazon / Yandex) 推送 ${COUNT} 个 URL..."

if command -v ~/.claude/skills/seo/scripts/claude-seo >/dev/null 2>&1; then
  ~/.claude/skills/seo/scripts/claude-seo run indexnow_submit.py \
    --host "${HOST}" \
    --key "${KEY}" \
    --key-location "${KEY_LOC}" \
    --urls-file "${TMP_URLS}" \
    --json
else
  # 原生 curl 向 api.indexnow.org 批量提交
  python3 -c "
import json, urllib.request
with open('${TMP_URLS}') as f:
    urls = [line.strip() for line in f if line.strip()]
payload = {
    'host': '${HOST}',
    'key': '${KEY}',
    'keyLocation': '${KEY_LOC}',
    'urlList': urls
}
req = urllib.request.Request(
    'https://api.indexnow.org/indexnow',
    data=json.dumps(payload).encode('utf-8'),
    headers={'Content-Type': 'application/json; charset=utf-8'}
)
try:
    with urllib.request.urlopen(req) as resp:
        print(f'✅ IndexNow 推送响应码: {resp.status}')
except Exception as e:
    print(f'⚠️ IndexNow 推送提示: {e}')
"
fi

rm -f "${TMP_URLS}"
echo "✅ IndexNow 流程完成！"
