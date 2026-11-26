#!/usr/bin/env python3
"""Download catalog photos (scripts/photos.json: file → candidate URL list)
into public/products. A file is accepted only if it's a JPEG over 15KB;
candidates are tried in order. Re-runs skip files already on disk."""
import json, os, subprocess, sys

root = os.path.join(os.path.dirname(__file__), '..')
photos = json.load(open(os.path.join(root, 'scripts/photos.json')))
outdir = os.path.join(root, 'public/products')
os.makedirs(outdir, exist_ok=True)

def fetch(url, dest):
    subprocess.run(['curl', '-sL', '--max-time', '25', '-o', dest, url], check=False)
    ok = os.path.exists(dest) and os.path.getsize(dest) > 15000
    if ok:
        with open(dest, 'rb') as f:
            ok = f.read(3) == b'\xff\xd8\xff'
    if not ok and os.path.exists(dest):
        os.remove(dest)
    return ok

failed = []
for fname, urls in photos.items():
    dest = os.path.join(outdir, fname)
    if os.path.exists(dest) and os.path.getsize(dest) > 15000:
        continue
    ok = False
    for url in urls if isinstance(urls, list) else [urls]:
        if fetch(url, dest):
            print('ok  ', fname)
            ok = True
            break
        print('skip', fname, url)
    if not ok:
        failed.append(fname)

print(f'\nDone. {len(photos) - len(failed)} ok, {len(failed)} failed: {failed or "—"}')
if failed:
    sys.exit(1)
