import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';

function arg(name) {
  const index = process.argv.indexOf(name);
  if (index === -1 || !process.argv[index + 1]) return '';
  return process.argv[index + 1];
}

const url = arg('--url');
const out = arg('--out');
const selector = arg('--selector') || 'wasmer-title';
if (!url || !out) {
  console.error('Pass --url and --out preview.jpg');
  process.exit(1);
}

const candidates = [
  process.env.MCP_PREVIEW_PYTHON,
  '/Users/ayush/Desktop/01 Wasmer/template-previews/.venv/bin/python',
  'python3',
].filter(Boolean);
const python = candidates.find((candidate) => candidate === 'python3' || existsSync(candidate));
const script = `
import os, sys
from playwright.sync_api import sync_playwright
from PIL import Image
url, out, selector = sys.argv[1], sys.argv[2], sys.argv[3]
tmp = out + ".full.png"
with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1600, "height": 1000}, device_scale_factor=1)
    page.goto(url, wait_until="domcontentloaded", timeout=120000)
    page.wait_for_selector(selector, timeout=30000)
    try:
        page.wait_for_load_state("networkidle", timeout=8000)
    except Exception:
        pass
    page.wait_for_timeout(500)
    page.screenshot(path=tmp, full_page=False)
    browser.close()
image = Image.open(tmp).convert("RGB")
limit = 120 * 1024
for quality in (70, 60, 50, 40, 30):
    image.save(out, "JPEG", quality=quality, optimize=True)
    if os.path.getsize(out) <= limit:
        break
os.remove(tmp)
print(out, os.path.getsize(out))
`;
const result = spawnSync(python, ['-c', script, url, out, selector], { encoding: 'utf8' });
if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);
if (result.status !== 0) process.exit(result.status || 1);
